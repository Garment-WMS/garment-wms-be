import { Workbook, Worksheet } from '@nbelyh/exceljs';
import { HttpStatus, Injectable } from '@nestjs/common';
import {
  isEmpty,
  isInt,
  isNumber,
  isPhoneNumber,
  max,
  maxLength,
  min,
  minLength,
} from 'class-validator';
import { I18nService } from 'nestjs-i18n';
import {
  COMPANY_NAME,
  DATE_FORMAT,
  ITEM_HEADER,
  ITEM_TABLE_NAME,
  PO_INFO_HEADER,
  PO_INFO_TABLE,
  PO_SHEET_NAME,
  SHIP_TO,
  SHIP_TO_HEADER,
  SUPPLIER_HEADER,
  SUPPLIER_TABLE_NAME,
} from 'src/common/constant/excel.constant';
import { apiFailed } from 'src/common/dto/api-response';
import {
  addMissingStartCharacter,
  compareArray,
  validateDate,
} from 'src/common/utils/utils';
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
    let listItemError = new Map<
      string,
      {
        fieldName: string;
        value: string;
        text?: any;
      }
    >();
    let supplierError = new Map<
      string,
      {
        fieldName: string;
        value: string;
        text?: any;
      }
    >();
    let deliveryBatchError = new Map<
      string,
      {
        fieldName: string;
        value: string;
        text?: any;
      }
    >();
    await workbook.xlsx.load(file.buffer);
    const worksheet = workbook.getWorksheet(PO_SHEET_NAME);
    if (!worksheet) {
      return apiFailed(HttpStatus.BAD_REQUEST, 'Invalid format');
    }
    //Validate Purchase Order sheet include item and supplier
    const errorResponse = await this.validatePurchaseOrderSheet(
      worksheet,
      supplierError,
      listItemError,
    );

    const errorResponseDeliveryBatch = await this.validateDeliveryBatchSheet(
      worksheet,
      deliveryBatchError,
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
  validateDeliveryBatchSheet(
    worksheet: Worksheet,
    deliveryBatchError: Map<
      string,
      { fieldName: string; value: string; text?: any }
    >,
  ) {
    throw new Error('Method not implemented.');
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
    supplierTable,
    POInfoTable,
    shipToTable,
  ) {
    //Use when set only one error in a cell
    let errorSet = false;

    //Suppler table

    // Check supplier table header
    let supplierValue: any[][] = [];
    supplierValue = this.extractVerticalTable(supplierTable, worksheet);
    const supplierHeader = this.extractHeader(supplierValue);
    if (!compareArray(supplierHeader, SUPPLIER_HEADER)) {
      console.log('Invalid format, Supplier table header is invalid');
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'Invalid format, Supplier table header is invalid',
      );
    }

    //Check POinfo table header
    let POInfoTableValue: any[][] = [];
    POInfoTableValue = this.extractVerticalTable(POInfoTable, worksheet);
    const POInfoHeader = this.extractHeader(POInfoTableValue);
    console.log(compareArray(POInfoHeader, PO_INFO_HEADER));
    if (!compareArray(POInfoHeader, PO_INFO_HEADER)) {
      console.log('Invalid format, POInfo table header is invalid');
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'Invalid format, POInfo table header is invalid',
      );
    }

    let shipToTableValue: any[][] = [];
    shipToTableValue = this.extractVerticalTable(shipToTable, worksheet);
    const shipToHeader = this.extractHeader(shipToTableValue);
    console.log(shipToHeader);
    if (!compareArray(shipToHeader, SHIP_TO_HEADER)) {
      console.log('Invalid format, ShipTo table header is invalid');
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'Invalid format, ShipTo table header is invalid',
      );
    }

    //Supplier information validation
    for (let i = 0; i < supplierValue.length; i++) {
      if (typeof supplierValue[i][1] === 'object') {
        supplierValue[i][1].value = this.getCellValue(supplierValue[i][1]);
      }
      let value = supplierValue[i][1].value;

      if (typeof value === 'string' && value !== null) {
        supplierValue[i][1].value = value.trim();
      }

      switch (supplierValue[i][0].value.split(':')[0].trim()) {
        case 'ZIP Code':
          if (
            this.validateRequired(
              value,
              supplierValue[i][0].value.split(':')[0].trim(),
              supplierValue[i][1].address,
              supplierError,
            )
          ) {
            //Add more validation here
            supplierObject['supplierZipCode'] = value;
          }
          break;

        case 'Company Name': {
          if (
            this.validateRequired(
              value,
              supplierValue[i][0].value.split(':')[0].trim(),
              supplierValue[i][1].address,
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
                supplierValue[i][1].address,
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
                supplierValue[i][0].value.split(':')[0].trim(),
                supplierValue[i][1].address,
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
              supplierValue[i][0].value.split(':')[0].trim(),
              supplierValue[i][1].address,
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
              supplierValue[i][0].value.split(':')[0].trim(),
              supplierValue[i][1].address,
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
              supplierValue[i][0].value.split(':')[0].trim(),
              supplierValue[i][1].address,
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
                supplierValue[i][1].address,
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
              supplierValue[i][0].value.split(':')[0].trim(),
              supplierValue[i][1].address,
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

    //POInfo table validation
    for (let i = 0; i < POInfoTableValue.length; i++) {
      if (typeof POInfoTableValue[i][1] === 'object') {
        POInfoTableValue[i][1].value = this.getCellValue(
          POInfoTableValue[i][1],
        );
      }
      let value = POInfoTableValue[i][1].value;

      if (typeof value === 'string' && value !== null) {
        POInfoTableValue[i][1].value = value.trim();
      }

      switch (POInfoTableValue[i][0].value.split(':')[0].trim()) {
        case 'PO #': {
          if (
            this.validateRequired(
              value,
              POInfoTableValue[i][0].value.split(':')[0].trim(),
              POInfoTableValue[i][1].address,
              supplierError,
            )
          ) {
            //TODO : Add more validation here

            supplierObject['poNumber'] = value;
          }
          break;
        }

        case 'Created Date':
          {
            if (
              this.validateRequired(
                value,
                POInfoTableValue[i][0].value.split(':')[0].trim(),
                POInfoTableValue[i][1].address,
                supplierError,
                `${DATE_FORMAT}`,
              )
            ) {
              console.log(validateDate(value));
              if (!validateDate(value)) {
                const text = [
                  { text: `${value}` },
                  {
                    text: `[Invalid date format, must be ${DATE_FORMAT}]`,
                    font: { color: { argb: 'FF0000' } },
                  },
                ];
                this.addError(
                  supplierError,
                  POInfoTableValue[i][1].address,
                  'Created Date',
                  value,
                  text,
                );
                errorSet = true;
              }
              if (new Date(value) > new Date() && !errorSet) {
                const text = [
                  { text: `${value}` },
                  {
                    text: `[Created Date must be before current date]`,
                    font: { color: { argb: 'FF0000' } },
                  },
                ];
                this.addError(
                  supplierError,
                  POInfoTableValue[i][1].address,
                  'Created Date',
                  value,
                  text,
                );
                errorSet = true;
              }
              supplierObject['createdDate'] = value;
            }
          }
          break;
        case 'Expected Finished Date':
          if (
            this.validateRequired(
              value,
              POInfoTableValue[i][0].value.split(':')[0].trim(),
              POInfoTableValue[i][1].address,
              supplierError,
              `${DATE_FORMAT}`,
            )
          ) {
            if (!validateDate(value)) {
              const text = [
                { text: `${value}` },
                {
                  text: `[Invalid date format, must be ${DATE_FORMAT}]`,
                  font: { color: { argb: 'FF0000' } },
                },
              ];
              this.addError(
                supplierError,
                POInfoTableValue[i][1].address,
                'Expected Finished Date',
                value,
                text,
              );
              errorSet = true;
            }

            if (new Date(value) < new Date() && !errorSet) {
              const text = [
                { text: `${value}` },
                {
                  text: `[Expected Finished Date must be after current date]`,
                  font: { color: { argb: 'FF0000' } },
                },
              ];
              this.addError(
                supplierError,
                POInfoTableValue[i][1].address,
                'Expected Finished Date',
                value,
                text,
              );
              errorSet = true;
            }

            supplierObject['expectedFinishedDate'] = value;
          }
          break;
        default: {
          break;
        }
      }
    }

    //ShipTo table validation
    for (let i = 0; i < shipToTableValue.length; i++) {
      if (typeof shipToTableValue[i][1] === 'object') {
        shipToTableValue[i][1].value = this.getCellValue(supplierValue[i][1]);
      }
      let value = shipToTableValue[i][1].value;

      if (typeof value === 'string' && value !== null) {
        shipToTableValue[i][1].value = value.trim();
      }

      switch (shipToTableValue[i][0].value.split(':')[0].trim()) {
        case 'Company Name': {
          if (
            this.validateRequired(
              value,
              shipToTableValue[i][0].value.split(':')[0].trim(),
              shipToTableValue[i][1].address,
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
                shipToTableValue[i][1].address,
                'Company Name',
                value,
                text,
              );
              errorSet = true;
            }
            supplierObject['shipToCompanyName'] = value;
          }
          break;
        }

        case 'Street Address':
          if (
            this.validateRequired(
              value,
              shipToTableValue[i][0].value.split(':')[0].trim(),
              shipToTableValue[i][1].address,
              supplierError,
            )
          ) {
            supplierObject['shipToAddress'] = value;
          }
          break;

        case 'City':
          if (
            this.validateRequired(
              value,
              shipToTableValue[i][0].value.split(':')[0].trim(),
              shipToTableValue[i][1].address,
              supplierError,
            )
          ) {
            supplierObject['shipToCity'] = value;
          }
          break;

        case 'ZIP Code':
          if (
            this.validateRequired(
              value,
              shipToTableValue[i][0].value.split(':')[0].trim(),
              shipToTableValue[i][1].address,
              supplierError,
            )
          ) {
            //Add more validation here
            supplierObject['shipToZipCode'] = value;
          }
          break;

        case 'Phone':
          if (
            this.validateRequired(
              value,
              shipToTableValue[i][0].value.split(':')[0].trim(),
              shipToTableValue[i][1].address,
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
                shipToTableValue[i][1].address,
                'Phone',
                value,
                text,
              );
              errorSet = true;
            }

            supplierObject['shipToPhone'] = value;
          }
          break;

        case 'Fax':
          if (
            this.validateRequired(
              value,
              shipToTableValue[i][0].value.split(':')[0].trim(),
              shipToTableValue[i][1].address,
              supplierError,
            )
          ) {
            supplierObject['shipToFax'] = value;
          }
          break;
      }
    }
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
    value: any,
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
    listItemError: Map<
      string,
      {
        fieldName: string;
        value: string;
        text?: any;
      }
    >,
  ) {
    const supplierObject = {};
    const itemList = [];

    //Check if all the required tables are present
    const POInfoTable = worksheet.getTable(PO_INFO_TABLE);
    const POItemTable = worksheet.getTable(ITEM_TABLE_NAME);
    const shipToTable = worksheet.getTable(SHIP_TO);
    const supplierTable = worksheet.getTable(SUPPLIER_TABLE_NAME);

    if (!POInfoTable || !POItemTable || !shipToTable || !supplierTable) {
      return apiFailed(HttpStatus.BAD_REQUEST, 'Invalid format');
    }

    //Supplier information
    const errorResponse = await this.checkSupplierValidation(
      worksheet,
      supplierError,
      supplierObject,
      supplierTable,
      POInfoTable,
      shipToTable,
    );

    console.log('Error Supplier', supplierError);
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
    const errorItem = await this.validateItemTable(
      worksheet,
      listItemError,
      itemList,
    );
    console.log('Error Item', listItemError);
    if (listItemError.size > 0) {
      listItemError.forEach((value, key) => {
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
  }

  async validateItemTable(
    worksheet: Worksheet,
    listItemError: Map<
      string,
      {
        fieldName: string;
        value: string;
        text?: any;
      }
    >,
    itemList: any[],
  ) {
    const itemTable = worksheet.getTable(ITEM_TABLE_NAME) as any;

    if (!itemTable) {
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'Invalid format, Item table not found',
      );
    }
    console.log(itemTable.table);
    const header = itemTable.table.columns.map((column: any) => column.name);
    console.log(header);
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
      let errorFlag = false;
      const row = worksheet.getRow(i);
      const itemCell = {
        itemIdCell: row.getCell(1),
        descriptionCell: row.getCell(2),
        quantityCell: row.getCell(3),
        priceCell: row.getCell(4),
        totalCell: row.getCell(5),
      };
      // Check if item name is empty
      if (
        this.validateRequired(
          itemCell.itemIdCell.value as string,
          'Item',
          itemCell.itemIdCell.address,
          listItemError,
        )
      ) {
        //Add more validation here
      } else {
        errorFlag = true;
      }

      // Check if description is empty
      if (
        this.validateRequired(
          itemCell.descriptionCell.value as string,
          'Description',
          itemCell.descriptionCell.address,
          listItemError,
        )
      ) {
        //Add more validation here
      } else {
        errorFlag = true;
      }

      // Check if quantity is empty
      if (
        this.validateRequired(
          itemCell.quantityCell.value as string,
          'Quantity',
          itemCell.quantityCell.address,
          listItemError,
        )
      ) {
        errorFlag = false;
        //Add more validation here
        if (!isInt(itemCell.quantityCell.value) && !errorFlag) {
          console.log(' 1 ', itemCell.quantityCell.value);
          const text = [
            { text: `${itemCell.quantityCell.value}` },
            {
              text: `[Quantity must be a number]`,
              font: { color: { argb: 'FF0000' } },
            },
          ];
          this.addError(
            listItemError,
            itemCell.quantityCell.address,
            'Quantity',
            itemCell.quantityCell.value,
            text,
          );
          errorFlag = true;
        }
        if (!min(itemCell.quantityCell.value, 0) && !errorFlag) {
          const text = [
            { text: `${itemCell.quantityCell.value}` },
            {
              text: `[Quantity must be greater than 0]`,
              font: { color: { argb: 'FF0000' } },
            },
          ];
          this.addError(
            listItemError,
            itemCell.quantityCell.address,
            'Quantity',
            itemCell.quantityCell.value,
            text,
          );
          errorFlag = true;
        }

        if (!max(itemCell.quantityCell.value, 100000) && !errorFlag) {
          const text = [
            { text: `${itemCell.quantityCell.value}` },
            {
              text: `[Quantity must be less than 1000000]`,
              font: { color: { argb: 'FF0000' } },
            },
          ];
          this.addError(
            listItemError,
            itemCell.quantityCell.address,
            'Quantity',
            itemCell.quantityCell.value,
            text,
          );
          errorFlag = true;
        }
      } else {
        errorFlag = true;
      }

      // Check if price is empty
      if (
        this.validateRequired(
          itemCell.priceCell.value as string,
          'Price',
          itemCell.priceCell.address,
          listItemError,
        )
      ) {
        errorFlag = false;
        //Add more validation here
        if (!isNumber(itemCell.priceCell.value) && !errorFlag) {
          const text = [
            { text: `${itemCell.priceCell.value}` },
            {
              text: `[Price must be a number]`,
              font: { color: { argb: 'FF0000' } },
            },
          ];
          this.addError(
            listItemError,
            itemCell.priceCell.address,
            'Price',
            itemCell.priceCell.value,
            text,
          );
          errorFlag = true;
        }
        if (!min(itemCell.priceCell.value, 0) && !errorFlag) {
          const text = [
            { text: `${itemCell.priceCell.value}` },
            {
              text: `[Price must be greater than 0]`,
              font: { color: { argb: 'FF0000' } },
            },
          ];
          this.addError(
            listItemError,
            itemCell.priceCell.address,
            'Price',
            itemCell.priceCell.value,
            text,
          );
          errorFlag = true;
        }

        if (!max(itemCell.priceCell.value, 100000) && !errorFlag) {
          const text = [
            { text: `${itemCell.priceCell.value}` },
            {
              text: `[Price must be less than 1000000]`,
              font: { color: { argb: 'FF0000' } },
            },
          ];
          this.addError(
            listItemError,
            itemCell.priceCell.address,
            'Price',
            itemCell.priceCell.value,
            text,
          );
          errorFlag = true;
        }
      } else {
        errorFlag = true;
      }

      if (!errorFlag) {
        itemList.push({
          itemId: itemCell.itemIdCell.value,
          description: itemCell.descriptionCell.value,
          quantity: itemCell.quantityCell.value,
          price: itemCell.priceCell.value,
          total: itemCell.totalCell.value,
        });
      }
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
