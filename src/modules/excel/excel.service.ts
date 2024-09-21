import { Workbook, Worksheet } from '@nbelyh/exceljs';
import { HttpStatus, Injectable } from '@nestjs/common';
import { isEmpty, isPhoneNumber, maxLength, minLength } from 'class-validator';
import { I18nService } from 'nestjs-i18n';
import {
  COMPANY_NAME,
  ITEM_HEADER,
  ITEM_TABLE_NAME,
  SUPPLIER_HEADER,
  SUPPLIER_TABLE_NAME,
} from 'src/common/constant/excel.constant';
import { apiFailed } from 'src/common/dto/api-response';
import { addMissingStartCharacter, compareArray } from 'src/common/utils/utils';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Injectable()
export class ExcelService {
  constructor(private readonly i18n: I18nService<I18nTranslations>) {}

  async readExcel(file: Express.Multer.File) {
    if (!file) {
      return apiFailed(HttpStatus.BAD_REQUEST, 'No file uploaded');
    }
    if (
      file.mimetype !==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return apiFailed(HttpStatus.BAD_REQUEST, 'Invalid file format');
    }

    const workbook = new Workbook();
    let listItemError = new Map<string, string>();
    let supplierError = new Map<
      string,
      {
        fieldName: string;
        value: string;
        text?: any;
      }
    >();
    await workbook.xlsx.load(file.buffer);

    // Get the first sheet in the workbook
    const worksheets = workbook.worksheets;

    //Check Purchase Order sheet
    //The first sheet is Purchase Order sheet
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      return apiFailed(HttpStatus.BAD_REQUEST, 'Invalid format');
    }
    //Validate Purchase Order sheet
    const errorResponse = await this.validatePurchaseOrderSheet(
      worksheet,
      supplierError,
      listItemError,
    );

    // if (errorResponse) {
    //   return errorResponse;
    // }

    // if (supplierError.size > 0 || listItemError.size > 0) {
    //   const file = await workbook.xlsx.writeBuffer();
    //   return apiFailed(HttpStatus.BAD_REQUEST, 'Invalid format', file);
    // }
    // return apiSuccess(
    //   HttpStatus.OK,
    //   'File processed successfully',
    //   'File processed successfully',
    // );

    return await workbook.xlsx.writeBuffer();
  }

  //Check item validation
  checkItemValidation(worksheet: Worksheet) {
    const headerCell = worksheet.getCell('A19:E19');
  }

  //Check supplier validation
  async checkSupplierValidation(
    worksheet: Worksheet,
    supplierError,
    supplierObject,
  ) {
    //Use when set only one error in a cell
    let errorSet = false;

    //Suppler table
    const supplierTable: any = worksheet.getTable(SUPPLIER_TABLE_NAME);
    if (!supplierTable) {
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'Invalid format, Supplier table not found',
      );
    }

    // Initialize a 2D array to store the values
    let informationValue: any[][] = [];

    informationValue = this.extractVerticalTable(supplierTable, worksheet);
    //Check length of supplier header
    if (informationValue.length !== SUPPLIER_HEADER.length) {
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'Invalid format, Supplier table header not found',
      );
    }

    const header = this.extractHeader(informationValue);
    if (!compareArray(header, SUPPLIER_HEADER)) {
      console.log('Invalid format, Supplier table header is invalid');
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'Invalid format, Supplier table header is invalid',
      );
    }

    for (let i = 0; i < informationValue.length; i++) {
      if (typeof informationValue[i][1] === 'object') {
        informationValue[i][1].value = this.getCellValue(
          informationValue[i][1],
        );
      }
      let value = informationValue[i][1].value;

      if (typeof value === 'string' && value !== null) {
        informationValue[i][1].value = value.trim();
      }

      switch (informationValue[i][0].value.split(':')[0].trim()) {
        case 'Company Name': {
          if (
            this.validateRequired(
              value,
              informationValue[i][0].value.split(':')[0].trim(),
              informationValue[i][1].address,
              supplierError,
            )
          ) {
            // Min length and max length check
            if (
              !((minLength(value, 3) || maxLength(value, 100)) && !errorSet)
            ) {
              const text = [
                { text: `${value}` },
                {
                  text: `[Company's name must be between 3 and 100 characters]`,
                  font: { color: { argb: 'FF0000' } },
                },
              ];

              this.addError(
                supplierError,
                informationValue[i][1].address,
                COMPANY_NAME,
                value,
                text,
              );
              errorSet = true;
            }
            supplierObject['companyName'] = value;
          }
          break;
        }

        case 'Contact of Department':
          {
            if (
              this.validateRequired(
                value,
                informationValue[i][0].value.split(':')[0].trim(),
                informationValue[i][1].address,
                supplierError,
              )
            ) {
              //Add more validation here
              supplierObject['contactOfDepartment'] = value;
            }
          }
          break;
        case 'Street Address':
          if (
            this.validateRequired(
              value,
              informationValue[i][0].value.split(':')[0].trim(),
              informationValue[i][1].address,
              supplierError,
            )
          ) {
            supplierObject['address'] = value;
          }
          break;
        case 'City':
          if (
            this.validateRequired(
              value,
              informationValue[i][0].value.split(':')[0].trim(),
              informationValue[i][1].address,
              supplierError,
            )
          ) {
            supplierObject['city'] = value;
          }
          break;
        case 'Phone':
          if (
            this.validateRequired(
              value,
              informationValue[i][0].value.split(':')[0].trim(),
              informationValue[i][1].address,
              supplierError,
              '[(+#)##-###-####]',
            )
          ) {
            value = addMissingStartCharacter(value, '+');
            if (!isPhoneNumber(value)) {
              const text = [
                { text: `${value}` },
                {
                  text: `[Phone number is invalid]`,
                  font: { color: { argb: 'FF0000' } },
                },
              ];
              this.addError(
                supplierError,
                informationValue[i][1].address,
                'Phone',
                value,
                text,
              );
              errorSet = true;
            }

            supplierObject['phone'] = value;
          }
          break;
        case 'Fax':
          if (
            this.validateRequired(
              value,
              informationValue[i][0].value.split(':')[0].trim(),
              informationValue[i][1].address,
              supplierError,
            )
          ) {
            supplierObject['fax'] = value;
          }
          break;
        default: {
          break;
        }
      }
    }

    //Check supplier header
  }

  getCellValue(cell: any): string {
    if (cell.value && cell.value.richText) {
      return cell.value.richText.map((segment: any) => segment.text).join('');
    }
    return cell.value;
  }

  //Check empty validation
  validateRequired(
    value: string,
    fieldName: string,
    cellAddress: string,
    errors: Map<string, any>,
    placeholder?: string,
  ) {
    if (isEmpty(value)) {
      const text = [
        { text: `[${placeholder ? placeholder : fieldName}]` },
        {
          text: `[${fieldName} can not be empty]`,
          font: { color: { argb: 'FF0000' } },
        },
      ];
      this.addError(errors, cellAddress, fieldName, value, text);
      return false;
    }
    return true;
  }

  //Use to add error in right format
  addError(
    errors: Map<string, any>,
    cellAddress: string,
    fieldName: string,
    value: string,
    text: any,
  ) {
    errors.set(cellAddress, {
      fieldName: fieldName,
      value: value,
      text: text,
    });
  }

  //Validate Purchase Order sheet
  async validatePurchaseOrderSheet(
    worksheet: Worksheet,
    supplierError: Map<
      string,
      {
        fieldName: string;
        value: string;
        text?: any;
      }
    >,
    listItemError: Map<string, string>,
  ) {
    const supplierObject = {};

    //Supplier information
    const errorResponse = await this.checkSupplierValidation(
      worksheet,
      supplierError,
      supplierObject,
    );
    console.log(errorResponse);

    if (supplierError.size > 0) {
      supplierError.forEach((value, key) => {
        const cell = worksheet.getCell(key);

        // Set the cell value to the error message
        cell.value = { richText: [] };
        cell.value.richText = [
          //Use to add - between text
          ...value?.text.reduce((acc, curr, index) => {
            if (index > 0) {
              acc.push({ text: ' - ', font: { color: { argb: 'FF0000' } } });
            }
            acc.push(curr);
            return acc;
          }, []),
        ];
      });
    }

    //Item information
    const itemTable = worksheet.getTable(ITEM_TABLE_NAME) as any;

    if (!itemTable) {
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'Invalid format, Item table not found',
      );
    }

    const header = itemTable.table.columns.map((column: any) => column.name);
    //Check if header is valid
    const isHeaderValid = compareArray(header, ITEM_HEADER);
    if (!isHeaderValid) {
      return apiFailed(HttpStatus.BAD_REQUEST, 'Invalid format');
    }

    const [startCell, endCell] = itemTable.table.tableRef.split(':');
    const startRow = parseInt(startCell.replace(/\D/g, ''), 10);
    const endRow = parseInt(endCell.replace(/\D/g, ''), 10);

    //Check item validation
    for (let i = startRow + 1; i < endRow; i++) {
      // console.log(worksheet.getRow(i).values);
    }
  }

  //Extract vetical table from excel
  extractVerticalTable(table: any, worksheet: any) {
    const [startCell, endCell] = table.table.tableRef.split(':');

    const startRow = worksheet.getCell(startCell).row;
    const startCol = worksheet.getCell(startCell).col;
    const endRow = worksheet.getCell(endCell).row;
    const endCol = worksheet.getCell(endCell).col;

    // Initialize a 2D array to store the values
    const values: any[][] = [];

    // Iterate over the rows and columns within the specified range
    for (let row = startRow; row <= endRow; row++) {
      const rowValues: any[] = [];
      for (let col = startCol; col <= endCol; col++) {
        const cell = worksheet.getCell(row, col);
        rowValues.push(cell);
      }
      values.push(rowValues);
    }

    return values;
  }

  //Extract header from 2d array, also remove :
  extractHeader(values: any[][]) {
    const header: string[] = [];
    for (let i = 0; i < values.length; i++) {
      const cell = values[i][0];
      const headerResult = cell.value.split(':')[0].trim();
      header.push(headerResult);
    }
    return header;
  }
}

//Reminder: Lam tiep cai checkSupplierValidation cho tung row
