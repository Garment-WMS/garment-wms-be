import { Cell, Workbook, Worksheet } from '@nbelyh/exceljs';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ProductSize } from '@prisma/client';
import {
  isBoolean,
  isEmpty,
  isInt,
  isNotEmpty,
  isNumber,
  isPhoneNumber,
  isString,
  max,
  min,
} from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import {
  COMPANY_NAME,
  DATE_FORMAT,
  DELIVERY_BATCH_INFO_HEADER,
  DELIVERY_BATCH_INFO_TABLE,
  DELIVERY_BATCH_ITEM_TABLE,
  ITEM_HEADER,
  ITEM_TABLE_NAME,
  MATERIAL_REQUIREMENT_SHEET_NAME,
  PO_INFO_HEADER,
  PO_INFO_TABLE,
  PO_SHEET_NAME,
  PRODUCT_FORMULA_HEADER,
  PRODUCT_FORMULA_SHEET_NAME,
  PRODUCT_FORMULA_TABLE_NAME,
  PRODUCTION_BATCH_DETAIL_HEADER,
  PRODUCTION_BATCH_DETAIL_TABLE,
  PRODUCTION_BATCH_INFO,
  PRODUCTION_BATCH_SHEET_NAME,
  PRODUCTION_MATERIAL_VARIANT_DETAIL_TABLE,
  PRODUCTION_MATERIAL_VARIANT_HEADER,
  PRODUCTION_PLAN_DETAIL_HEADER,
  PRODUCTION_PLAN_DETAIL_TABLE,
  PRODUCTION_PLAN_INFO,
  PRODUCTION_PLAN_NOTE_TABLE,
  PRODUCTION_PLAN_SHEET_NAME,
  SHIP_TO,
  SHIP_TO_HEADER,
  SUPPLIER_HEADER,
  SUPPLIER_TABLE_NAME,
  TOTAL_PURCHASE_ORDER_HEADER,
  TOTAL_PURCHASE_ORDER_TABLE,
} from 'src/common/constant/excel.constant';
import { apiFailed } from 'src/common/dto/api-response';
import {
  addMissingStartCharacter,
  compareArray,
  getDatePart,
  validateDate,
} from 'src/common/utils/utils';
import { FirebaseService } from '../firebase/firebase.service';
import { MaterialPackageService } from '../material-package/material-package.service';
import { MaterialVariantService } from '../material-variant/material-variant.service';
import { PoDeliveryMaterialDto } from '../po-delivery-material/dto/po-delivery-material.dto';
import { PoDeliveryDto } from '../po-delivery/dto/po-delivery.dto';
import { ArrayExcelProductFormula } from '../product-formula-material/dto/array-excel-product-formula.dto';
import { CreateProductPlanDetailDto } from '../product-plan-detail/dto/create-product-plan-detail.dto';
import { ProductPlanDetailService } from '../product-plan-detail/product-plan-detail.service';
import { CreateProductPlanDto } from '../product-plan/dto/create-product-plan.dto';
import { ProductSizeService } from '../product-size/product-size.service';
import { CreateProductionBatchDto } from '../production-batch/dto/create-production-batch.dto';
import { CreatePurchaseOrderDto } from '../purchase-order/dto/create-purchase-order.dto';

interface itemType {
  materialVariantId: {
    cell: Cell;
    value: any;
  };
  code: {
    cell: Cell;
    value: any;
  };
  quantityByPack: {
    cell: Cell;
    value: any;
  };
  totalAmount: {
    cell: Cell;
    value: any;
  };
  expiredDate: {
    cell: Cell;
    value: any;
  };
  unitPrice: {
    cell: Cell;
    value: any;
  };
}
interface itemElement {
  cell: Cell;
  value: any;
}
@Injectable()
export class ExcelService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly firebaseService: FirebaseService,
    private readonly materialPackageService: MaterialPackageService,
    private readonly productSizeService: ProductSizeService,
    private readonly productPlanDetailService: ProductPlanDetailService,
    private readonly materialVariantService: MaterialVariantService,
  ) {}

  //TODO : Validate item in table general which item in each table
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
    let deliveryBatchItemError = new Map<
      string,
      {
        fieldName: string;
        value: string;
        text?: any;
      }
    >();

    const puchaseOrder: Partial<CreatePurchaseOrderDto> = {};
    const deliveryBatch: Partial<PoDeliveryDto>[] = [];
    const itemGeneral: itemType[] = [];
    await workbook.xlsx.load(file.buffer);
    const worksheet = workbook.getWorksheet(PO_SHEET_NAME);
    if (!worksheet) {
      return apiFailed(HttpStatus.UNSUPPORTED_MEDIA_TYPE, 'Invalid format');
    }
    // Validate Purchase Order sheet include item and supplier
    const errorResponse = await this.validatePurchaseOrderSheet(
      worksheet,
      supplierError,
      listItemError,
      puchaseOrder,
      itemGeneral,
    );
    if (errorResponse) {
      return errorResponse;
    }

    if (supplierError.size > 0 || listItemError.size > 0) {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.originalname}`;
      const bufferResult = await workbook.xlsx.writeBuffer();
      const nodeBuffer = Buffer.from(bufferResult);
      const downloadUrl = await this.firebaseService.uploadBufferToStorage(
        nodeBuffer,
        fileName,
      );
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'There is error Purchase Order sheet. Please fix before upload again !!!',
        downloadUrl,
      );
    }

    const errorResponseDeliveryBatch = await this.validateDeliveryBatchSheet(
      workbook,
      deliveryBatchError,
      deliveryBatchItemError,
      deliveryBatch,
      puchaseOrder,
      itemGeneral,
    );
    if (errorResponseDeliveryBatch) {
      return errorResponseDeliveryBatch;
    }
    if (deliveryBatchError.size > 0 || deliveryBatchItemError.size > 0) {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.originalname}`;
      const bufferResult = await workbook.xlsx.writeBuffer();
      const nodeBuffer = Buffer.from(bufferResult);
      const downloadUrl = await this.firebaseService.uploadBufferToStorage(
        nodeBuffer,
        fileName,
      );
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'There is error Purchase Order sheet. Please fix before upload again !!!',
        downloadUrl,
      );
    }

    return puchaseOrder;
  }
  async validateDeliveryBatchSheet(
    workbook: Workbook,
    deliveryBatchError: Map<
      string,
      { fieldName: string; value: string; text?: any }
    >,
    deliveryBatchItemError: Map<
      string,
      { fieldName: string; value: string; text?: any }
    >,
    deliveryBatches: Partial<PoDeliveryDto>[],
    puchaseOrder: Partial<CreatePurchaseOrderDto>,
    itemGeneral,
  ) {
    const deliveryBatchSheets: Worksheet[] = [];

    workbook.eachSheet((worksheet: Worksheet) => {
      if (worksheet.name.includes('DeliveryBatch')) {
        deliveryBatchSheets.push(worksheet);
      }
    });

    if (deliveryBatchSheets.length === 0) {
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'Invalid format, Delivery Batch sheet not found',
      );
    }
    if (puchaseOrder) {
      for (let i = 0; i < deliveryBatchSheets.length; i++) {
        const errorResponse = await this.checkDeliveryBatchValidation(
          deliveryBatchSheets[i],
          deliveryBatchError,
          deliveryBatchItemError,
          deliveryBatches,
          puchaseOrder,
          itemGeneral,
        );
        if (errorResponse) {
          return errorResponse;
        }
      }
    }

    puchaseOrder.poDelivery = deliveryBatches;
    //Loop fop each sheet
  }

  async checkDeliveryBatchValidation(
    worksheet: Worksheet,
    deliveryBatchError: Map<
      string,
      { fieldName: string; value: string; text?: any }
    >,
    deliveryBatchItemError: Map<
      string,
      { fieldName: string; value: string; text?: any }
    >,
    deliveryBatches: Partial<PoDeliveryDto>[],
    puchaseOrder: Partial<CreatePurchaseOrderDto>,
    itemGeneral: itemType[],
  ) {
    let deliveryBatchErrorSheet = new Map<
      string,
      { fieldName: string; value: string; text?: any }
    >();
    let deliveryBatchItemErrorSheet = new Map<
      string,
      { fieldName: string; value: string; text?: any }
    >();
    let deliveryBatchInfoTable;
    let batchItemTable;
    worksheet.getTables().forEach((table: any) => {
      if (table.name.includes(DELIVERY_BATCH_INFO_TABLE)) {
        deliveryBatchInfoTable = table;
      }
      if (table.name.includes(DELIVERY_BATCH_ITEM_TABLE)) {
        batchItemTable = table;
      }
    });

    if (!deliveryBatchInfoTable || !batchItemTable) {
      return apiFailed(
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        'Invalid format, Delivery Batch table not found',
      );
    }

    const deliveryBatchInfoValue = this.extractVerticalTable(
      deliveryBatchInfoTable,
      worksheet,
    );
    const deliveryBatchInfoHeader = this.extractHeader(deliveryBatchInfoValue);
    if (!compareArray(deliveryBatchInfoHeader, DELIVERY_BATCH_INFO_HEADER)) {
      return apiFailed(
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        'Invalid format, Delivery Batch Info table header is invalid',
      );
    }

    const batchItemValue = this.extractVerticalTable(batchItemTable, worksheet);
    // const batchItemHeader = this.extractHeader(batchItemValue);
    // if (!compareArray(batchItemHeader, ITEM_HEADER)) {
    //   return apiFailed(
    //     HttpStatus.BAD_REQUEST,
    //     'Invalid format, Delivery Batch Item table header is invalid',
    //   );
    // }

    // Check delivery batch info validation
    let deliveryBatchInfo: Partial<PoDeliveryDto> = {};
    const errorResponse = this.checkDeliveryBatchInfoValidation(
      worksheet,
      deliveryBatchInfoValue,
      deliveryBatchErrorSheet,
      deliveryBatchInfo,
    );
    if (deliveryBatchErrorSheet.size > 0) {
      deliveryBatchErrorSheet.forEach((value, key) => {
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
        deliveryBatchError.set(key, value);
      });
    }

    //
    let deliveryBatchItems: itemType[] = [];
    // Check delivery batch item validation
    const errorItem = await this.validateItemTable(
      worksheet,
      deliveryBatchItemErrorSheet,
      batchItemTable,
      deliveryBatchItems,
    );
    if (errorItem) {
      return errorItem;
    }

    this.validateItemTableBatch(
      deliveryBatchItems,
      itemGeneral,
      deliveryBatchItemErrorSheet,
    );

    const deliveryBatchItemsDto: Partial<PoDeliveryMaterialDto>[] = [];

    if (deliveryBatchItems.length > 0) {
      deliveryBatchItems.forEach((el) => {
        const deliveryBatchItemDetail: Partial<PoDeliveryMaterialDto> = {
          expiredDate: el.expiredDate.value,
          materialVariantId: el.materialVariantId.value,
          totalAmount: el.totalAmount.value,
          quantityByPack: el.quantityByPack.value,
        };
        deliveryBatchItemsDto.push(deliveryBatchItemDetail);
      });
    }

    deliveryBatchInfo.poDeliveryDetail = deliveryBatchItemsDto;
    if (deliveryBatchItemErrorSheet.size > 0) {
      deliveryBatchItemErrorSheet.forEach((value, key) => {
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
        deliveryBatchItemError.set(key, value);
      });
    }

    deliveryBatches.push(deliveryBatchInfo);
  }

  async checkDeliveryBatchInfoValidation(
    worksheet: Worksheet,
    deliveryTableInfo,
    deliveryBatchError: Map<
      string,
      { fieldName: string; value: string; text?: any }
    >,
    deliveryBatchInfo: Partial<PoDeliveryDto>,
  ) {
    let errorFlag = false;

    for (let i = 0; i < deliveryTableInfo.length; i++) {
      if (typeof deliveryTableInfo[i][1] === 'object') {
        deliveryTableInfo[i][1].value = this.getCellValue(
          deliveryTableInfo[i][1],
        );
      }
      let value = deliveryTableInfo[i][1].value;

      if (typeof value === 'string' && value !== null) {
        deliveryTableInfo[i][1].value = value.trim();
      }
      switch (deliveryTableInfo[i][0].value.split(':')[0].trim()) {
        case 'Expected Delivery Date':
          errorFlag = false;
          if (
            this.validateRequired(
              value,
              deliveryTableInfo[i][0].value.split(':')[0].trim(),
              deliveryTableInfo[i][1].address,
              deliveryBatchError,
              `${DATE_FORMAT}`,
            )
          ) {
            if (!validateDate(value) && !errorFlag) {
              const text = [
                { text: `${value}` },
                {
                  text: `[Invalid date format, must be ${DATE_FORMAT}]`,
                  font: { color: { argb: 'FF0000' } },
                },
              ];
              this.addError(
                deliveryBatchError,
                deliveryTableInfo[i][1].address,
                'Expected Delivery Date',
                value,
                text,
              );
              errorFlag = true;
            }

            if (
              getDatePart(new Date(value)) < getDatePart(new Date()) &&
              !errorFlag
            ) {
              const text = [
                { text: `${value.toISOString().split('T')[0]}` },
                {
                  text: `[Expected Delivery Date must be after current date]`,
                  font: { color: { argb: 'FF0000' } },
                },
              ];
              this.addError(
                deliveryBatchError,
                deliveryTableInfo[i][1].address,
                'Expected Delivery Date',
                value,
                text,
              );
              errorFlag = true;
            }

            if (!errorFlag) {
              deliveryBatchInfo.expectedDeliverDate = value;
            }
          }
          break;
        case 'Is extra':
          errorFlag = false;
          if (
            this.validateRequired(
              value,
              deliveryTableInfo[i][0].value.split(':')[0].trim(),
              deliveryTableInfo[i][1].address,
              deliveryBatchError,
            )
          ) {
            if (!isBoolean(value)) {
              const text = [
                {
                  text: `[Is extra must be check box, please download the right format]`,
                  font: { color: { argb: 'FF0000' } },
                },
              ];
              this.addError(
                deliveryBatchError,
                deliveryTableInfo[i][1].address,
                'Is extra',
                value,
                text,
              );

              errorFlag = true;
            }

            if (!errorFlag) {
              deliveryBatchInfo.isExtra = value;
            }
          }
          break;
      }
      //TODO : REturn PO delivery
    }
  }

  //Check item validation
  checkItemDeliveryTable(worksheet: Worksheet) {}

  //Check supplier validation
  async checkSupplierValidation(
    worksheet: Worksheet,
    supplierError,
    purchaseOrderObject: Partial<CreatePurchaseOrderDto>,
    supplierTable,
    POInfoTable,
    shipToTable,
    totalTable,
  ) {
    //Use when set only one error in a cell
    let errorSet = false;
    let supplierObject = {};
    let supplier;
    //Suppler table

    // Check supplier table header
    let supplierValue: any[][] = [];
    supplierValue = this.extractVerticalTable(supplierTable, worksheet);
    const supplierHeader = this.extractHeader(supplierValue);
    if (!compareArray(supplierHeader, SUPPLIER_HEADER)) {
      return apiFailed(
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        'Invalid format, Supplier table header is invalid',
      );
    }
    //Find supplier company through company code
    for (let i = 0; i < supplierValue.length; i++) {
      if (supplierValue[i][0].value.includes('Company Code')) {
        supplier = await this.prismaService.supplier.findUnique({
          where: {
            code: supplierValue[i][1].value,
          },
        });
        if (isEmpty(supplier)) {
          const text = [
            { text: `${supplierValue[i][1].value}` },
            {
              text: `[Supplier not found]`,
              font: { color: { argb: 'FF0000' } },
            },
          ];
          this.addError(
            supplierError,
            supplierValue[i][1].address,
            'Company Code',
            supplierValue[i][1].value,
            text,
          );
        } else {
          if (!purchaseOrderObject.Supplier) {
            purchaseOrderObject.Supplier = {
              id: undefined,
              supplierName: '',
              code: '',
              address: '',
              phoneNumber: '',
              fax: '',
              email: '',
              representativeName: '',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            }; // Initialize Supplier if it is undefined
          }
          purchaseOrderObject.Supplier.id = supplier.id;
        }
      }
    }

    //Check POinfo table header
    let POInfoTableValue: any[][] = [];
    POInfoTableValue = this.extractVerticalTable(POInfoTable, worksheet);
    const POInfoHeader = this.extractHeader(POInfoTableValue);
    if (!compareArray(POInfoHeader, PO_INFO_HEADER)) {
      return apiFailed(
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        'Invalid format, POInfo table header is invalid',
      );
    }

    let shipToTableValue: any[][] = [];
    shipToTableValue = this.extractVerticalTable(shipToTable, worksheet);
    const shipToHeader = this.extractHeader(shipToTableValue);
    if (!compareArray(shipToHeader, SHIP_TO_HEADER)) {
      console.log('Invalid format, ShipTo table header is invalid');
      return apiFailed(
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        'Invalid format, ShipTo table header is invalid',
      );
    }

    let totalTableValue: any[][] = [];
    totalTableValue = this.extractVerticalTable(totalTable, worksheet);
    const totalTableHeader = this.extractHeader(totalTableValue);
    if (!compareArray(totalTableHeader, TOTAL_PURCHASE_ORDER_HEADER)) {
      console.log('Invalid format, Total table header is invalid');
      return apiFailed(
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        'Invalid format, Total table header is invalid',
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
        case 'Email':
          errorSet = false;
          value = supplierValue[i][1]?.text || supplierValue[i][1].value;
          if (
            this.validateRequired(
              value,
              supplierValue[i][0].value.split(':')[0].trim(),
              supplierValue[i][1].address,
              supplierError,
            )
          ) {
            //Add more validation here
            if (supplier?.email && value !== supplier?.email && !errorSet) {
              const text = [
                { text: `${value}` },
                {
                  text: `[Email is not correct]`,
                  font: { color: { argb: 'FF0000' } },
                },
              ];
              this.addError(
                supplierError,
                supplierValue[i][1].address,
                'Email',
                value,
                text,
              );
              errorSet = true;
            }
          }
          break;

        case 'Company Name': {
          errorSet = false;
          if (
            this.validateRequired(
              value,
              supplierValue[i][0].value.split(':')[0].trim(),
              supplierValue[i][1].address,
              supplierError,
            )
          ) {
            // Is correct supplier name
            if (
              supplier?.supplier_name &&
              value !== supplier?.supplier_name &&
              !errorSet
            ) {
              const text = [
                { text: `${value}` },
                {
                  text: `[Company's name is not correct]`,
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
          errorSet = false;
          if (
            this.validateRequired(
              value,
              supplierValue[i][0].value.split(':')[0].trim(),
              supplierValue[i][1].address,
              supplierError,
              '[(+#)##-###-####]',
            )
          ) {
            const numberPhone = addMissingStartCharacter(value, '+');
            if (!isPhoneNumber(numberPhone)) {
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
            if (
              supplier?.phone_numbert &&
              value != supplier?.phone_number &&
              !errorSet
            ) {
              const text = [
                { text: `${value}` },
                {
                  text: `[Phone number is not correct]`,
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
          }
          break;
        case 'Fax':
          errorSet = false;
          if (
            this.validateRequired(
              value,
              supplierValue[i][0].value.split(':')[0].trim(),
              supplierValue[i][1].address,
              supplierError,
            )
          ) {
            const numberPhone = addMissingStartCharacter(value, '+');

            if (!isPhoneNumber(numberPhone)) {
              const text = [
                { text: `${value}` },
                {
                  text: `[Fax is invalid]`,
                  font: { color: { argb: 'FF0000' } },
                },
              ];
              this.addError(
                supplierError,
                supplierValue[i][1].address,
                'Fax',
                value,
                text,
              );
              errorSet = true;
            }

            if (supplier?.fax && value != supplier.fax && !errorSet) {
              const text = [
                { text: `${value}` },
                {
                  text: `[Fax is not correct]`,
                  font: { color: { argb: 'FF0000' } },
                },
              ];
              this.addError(
                supplierError,
                supplierValue[i][1].address,
                'Fax',
                value,
                text,
              );

              errorSet = true;
            }
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

      //Po Number
      switch (POInfoTableValue[i][0].value.split(':')[0].trim()) {
        case 'Production Plan Code': {
          errorSet = false;
          if (
            this.validateRequired(
              value,
              POInfoTableValue[i][0].value.split(':')[0].trim(),
              POInfoTableValue[i][1].address,
              supplierError,
            )
          ) {
            const productPlan =
              await this.prismaService.productionPlan.findFirst({
                where: {
                  code: value,
                },
              });
            if (!productPlan) {
              const text = [
                { text: `${value}` },
                {
                  text: `[Product Plan does not exist]`,
                  font: { color: { argb: 'FF0000' } },
                },
              ];
              this.addError(
                supplierError,
                POInfoTableValue[i][1].address,
                'Production Plan Code',
                value,
                text,
              );
              errorSet = true;
            }
            purchaseOrderObject.productionPlanId = productPlan?.id as string;
          }
          break;
        }

        case 'Ordered Date':
          errorSet = false;
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
                  { text: `${value.toISOString().split('T')[0]}` },
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
              if (!errorSet) {
                purchaseOrderObject.orderDate = value;
              }
            }
          }
          break;
        case 'Expected Finished Date':
          errorSet = false;
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
            if (
              getDatePart(new Date(value)) < getDatePart(new Date()) &&
              !errorSet
            ) {
              const text = [
                { text: `${value.toISOString().split('T')[0]}` },
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

            if (!errorSet) {
              purchaseOrderObject.expectedFinishDate = value;
            }
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
        shipToTableValue[i][1].value = this.getCellValue(
          shipToTableValue[i][1],
        );
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
            // if (
            //   !((minLength(value, 3) || maxLength(value, 100)) && !errorSet)
            // ) {
            //   const text = [
            //     { text: `${value}` },
            //     {
            //       text: `[Company's name must be between 3 and 100 characters]`,
            //       font: { color: { argb: 'FF0000' } },
            //     },
            //   ];
            //   this.addError(
            //     supplierError,
            //     shipToTableValue[i][1].address,
            //     'Company Name',
            //     value,
            //     text,
            //   );
            //   errorSet = true;
            // }
            // purchaseOrderObject.shippingAddress = value;
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
            // supplierObject['shipToAddress'] = value;
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
            // supplierObject['shipToCity'] = value;
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
            // supplierObject['shipToZipCode'] = value;
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
            // supplierObject['shipToFax'] = value;
          }
          break;
      }
    }

    //Total table validation
    for (let i = 0; i < totalTableValue.length; i++) {
      errorSet = false;
      if (typeof totalTableValue[i][1] === 'object') {
        totalTableValue[i][1].value = this.getCellValue(totalTableValue[i][1]);
      }
      let value = totalTableValue[i][1].value;

      if (typeof value === 'string' && value !== null) {
        totalTableValue[i][1].value = value.trim();
      }
      switch (totalTableValue[i][0].value.split(':')[0].trim()) {
        case 'SUBTOTAL': {
          if (
            this.validateRequired(
              value,
              totalTableValue[i][0].value.split(':')[0].trim(),
              totalTableValue[i][1].address,
              supplierError,
            )
          ) {
            console.log('value', value);
            purchaseOrderObject.subTotal = value?.result;
          }
          break;
        }

        case 'TAX':
          {
            if (
              this.validateRequired(
                value,
                totalTableValue[i][0].value.split(':')[0].trim(),
                totalTableValue[i][1].address,
                supplierError,
              )
            ) {
              //Add more validation here
              purchaseOrderObject.taxAmount = value;
            }
          }
          break;

        case 'SHIPPING':
          if (
            this.validateRequired(
              value,
              totalTableValue[i][0].value.split(':')[0].trim(),
              totalTableValue[i][1].address,
              supplierError,
            )
          ) {
            purchaseOrderObject.shippingAmount = value;
          }
          break;

        case 'OTHER':
          if (
            this.validateRequired(
              value,
              totalTableValue[i][0].value.split(':')[0].trim(),
              totalTableValue[i][1].address,
              supplierError,
            )
          ) {
            purchaseOrderObject.otherAmount = value;
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
    purchaseOrder: Partial<CreatePurchaseOrderDto>,
    itemList: itemType[],
  ) {
    //Check if all the required tables are present
    const POInfoTable = worksheet.getTable(PO_INFO_TABLE);
    const POItemTable = worksheet.getTable(ITEM_TABLE_NAME);
    const shipToTable = worksheet.getTable(SHIP_TO);
    const supplierTable = worksheet.getTable(SUPPLIER_TABLE_NAME);
    const totalTable = worksheet.getTable(TOTAL_PURCHASE_ORDER_TABLE);
    if (
      !POInfoTable ||
      !POItemTable ||
      !shipToTable ||
      !supplierTable ||
      !totalTable
    ) {
      return apiFailed(HttpStatus.UNSUPPORTED_MEDIA_TYPE, 'Invalid format');
    }

    //Supplier information
    const errorResponse = await this.checkSupplierValidation(
      worksheet,
      supplierError,
      purchaseOrder,
      supplierTable,
      POInfoTable,
      shipToTable,
      totalTable,
    );

    if (errorResponse) {
      return errorResponse;
    }

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
      return apiFailed(HttpStatus.UNSUPPORTED_MEDIA_TYPE, 'Invalid format');
    } else {
      const errorItem = await this.validateItemTable(
        worksheet,
        listItemError,
        itemTable,
        itemList,
      );
    }
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
    itemTable: any,
    itemListResult: itemType[],
  ) {
    const header = itemTable.table.columns.map((column: any) => column.name);
    //Check if header is valid
    const isHeaderValid = compareArray(header, ITEM_HEADER);
    if (!isHeaderValid) {
      return apiFailed(HttpStatus.UNSUPPORTED_MEDIA_TYPE, 'Invalid format');
    }

    const [startCell, endCell] = itemTable.table.tableRef.split(':');
    const startRow = parseInt(startCell.replace(/\D/g, ''), 10);
    const endRow = parseInt(endCell.replace(/\D/g, ''), 10);

    //Check item validation
    for (let i = startRow + 1; i < endRow; i++) {
      let materialid;
      let material;
      let isError = false;
      let errorFlag = false;
      const row = worksheet.getRow(i);
      const itemCell = {
        itemIdCell: row.getCell(1),
        descriptionCell: row.getCell(2),
        expiredDate: row.getCell(3),
        quantityCell: row.getCell(4),
        priceCell: row.getCell(5),
        totalCell: row.getCell(6),
      };
      if (
        isEmpty(itemCell.itemIdCell.value) &&
        isEmpty(itemCell.descriptionCell.value) &&
        isEmpty(itemCell.quantityCell.value) &&
        isEmpty(itemCell.priceCell.value)
      ) {
      } else {
        if (
          this.validateRequired(
            itemCell.itemIdCell.value as string,
            'Material Code',
            itemCell.itemIdCell.address,
            listItemError,
          )
        ) {
          material = await this.materialPackageService.findByMaterialCode(
            this.extractValueFromCellValue(itemCell.itemIdCell.value),
          );
          materialid = material?.id;
          if (isEmpty(material)) {
            const text = [
              { text: `${itemCell.itemIdCell.value}` },
              {
                text: `[Material not found]`,
                font: { color: { argb: 'FF0000' } },
              },
            ];
            this.addError(
              listItemError,
              itemCell.itemIdCell.address,
              'Material',
              itemCell.itemIdCell.value,
              text,
            );
            errorFlag = true;
            isError = true;
          }
        } else {
          isError = true;
          errorFlag = true;
        }

        // Check if Material name is empty
        if (
          this.validateRequired(
            itemCell.descriptionCell.value as string,
            'Material Name',
            itemCell.descriptionCell.address,
            listItemError,
          )
        ) {
          //Add more validation here
        } else {
          isError = true;
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
            isError = true;
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
            isError = true;
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
            isError = true;
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
            isError = true;
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
            isError = true;
            errorFlag = false;
          }
        } else {
          errorFlag = true;
        }

        if (isNotEmpty(itemCell.expiredDate.value)) {
          if (!validateDate(itemCell.expiredDate.value)) {
            const text = [
              { text: `${itemCell.expiredDate.value}` },
              {
                text: `[Expired date must be correct format]`,
                font: { color: { argb: 'FF0000' } },
              },
            ];
            this.addError(
              listItemError,
              itemCell.expiredDate.address,
              'Expired Date',
              itemCell.expiredDate.value,
              text,
            );
            errorFlag = true;
            isError = true;
          }
        }

        if (!isError) {
          if (
            itemListResult.find(
              (item) => item.materialVariantId.value === materialid,
            )
          ) {
            const text = [
              { text: `${itemCell.itemIdCell.value}` },
              {
                text: `[Item already exists in the list]`,
                font: { color: { argb: 'FF0000' } },
              },
            ];
            this.addError(
              listItemError,
              itemCell.itemIdCell.address,
              'Material',
              itemCell.itemIdCell.value,
              text,
            );
          }
          itemListResult.push({
            materialVariantId: {
              cell: null,
              value: materialid as string,
            },
            code: {
              cell: itemCell.itemIdCell,
              value: itemCell.itemIdCell.value,
            },
            quantityByPack: {
              cell: itemCell.quantityCell,
              value: itemCell.quantityCell.value as number,
            },
            totalAmount: {
              cell: itemCell.totalCell,
              value: this.getTotalCellValue(itemCell.totalCell),
            },
            expiredDate: {
              cell: itemCell.expiredDate,
              value: itemCell.expiredDate.value || null,
            },
            unitPrice: {
              cell: itemCell.priceCell,
              value: itemCell.priceCell.value as number,
            },
          });
        }
      }
    }
  }

  //This use to validate item in general table which item in each delivery batch
  validateItemTableBatch(
    itemInDeliveryBatch: itemType[],
    itemInGeneralTable: itemType[],
    listItemError,
  ) {
    itemInDeliveryBatch.forEach((item) => {
      const generalItem = itemInGeneralTable.find(
        (generalItem) => generalItem.code.value === item.code.value,
      );

      if (generalItem) {
        if (generalItem.quantityByPack.value < item.quantityByPack.value) {
          const text = [
            { text: `${item.quantityByPack.value}` },
            {
              text: `[Quantity must be less than or equal to general quantity]`,
              font: { color: { argb: 'FF0000' } },
            },
          ];
          this.addError(
            listItemError,
            item.quantityByPack.cell.address,
            'Quantity',
            item.quantityByPack.value,
            text,
          );
        }

        if (generalItem.expiredDate.value && item.expiredDate.value) {
          if (
            new Date(generalItem.expiredDate.value).getTime() !==
            new Date(item.expiredDate.value).getTime()
          ) {
            const text = [
              { text: `${item.expiredDate.value}` },
              {
                text: `[Expired Date must be equal to general expired date]`,
                font: { color: { argb: 'FF0000' } },
              },
            ];
            this.addError(
              listItemError,
              item.expiredDate.cell.address,
              'Expired Date',
              item.expiredDate.value,
              text,
            );
          }
        }

        if (generalItem.unitPrice.value !== item.unitPrice.value) {
          const text = [
            { text: `${item.unitPrice.value}` },
            {
              text: `[Unit Price must be equal to general unit price]`,
              font: { color: { argb: 'FF0000' } },
            },
          ];
          this.addError(
            listItemError,
            item.unitPrice.cell.address,
            'Unit Price',
            item.unitPrice.value,
            text,
          );
        }
      } else {
        const text = [
          { text: `${item.code.value}` },
          {
            text: `[Item not found in general table]`,
            font: { color: { argb: 'FF0000' } },
          },
        ];
        this.addError(
          listItemError,
          item.code.cell.address,
          'Material',
          item.code.value,
          text,
        );
      }
    });
  }

  getTotalCellValue = (totalCellValue: any): number => {
    if (
      totalCellValue &&
      typeof totalCellValue === 'object' &&
      'result' in totalCellValue
    ) {
      return totalCellValue.result;
    }
    return totalCellValue;
  };

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

  extractValueFromCellValue(cell: any) {
    if (typeof cell === 'object') {
      cell.value = this.getCellValue(cell);
    }
    let value = cell.value;
    if (typeof value === 'string' && value !== null) {
      cell.value = value.trim();
    }
    return cell?.value || cell;
  }

  //Production plan
  async readProductionPlanExcel(file: Express.Multer.File) {
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
    await workbook.xlsx.load(file.buffer);
    const worksheet = workbook.getWorksheet(PRODUCTION_PLAN_SHEET_NAME);
    if (!worksheet) {
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'Invalid file format, worksheet not found',
      );
    }
    let productionPlan: CreateProductPlanDto = new CreateProductPlanDto();
    let productionPlanError: Map<
      string,
      {
        fieldName: string;
        value: string;
        text?: any;
      }
    > = new Map();
    let errorResponse;

    await this.validateProductionPlanSheet(
      worksheet,
      productionPlan,
      productionPlanError,
      errorResponse,
    );

    if (errorResponse) {
      return errorResponse;
    }

    if (productionPlanError.size > 0) {
      productionPlanError.forEach((value, key) => {
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
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.originalname}`;
      const bufferResult = await workbook.xlsx.writeBuffer();
      const nodeBuffer = Buffer.from(bufferResult);
      const downloadUrl = await this.firebaseService.uploadBufferToStorage(
        nodeBuffer,
        fileName,
      );
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'Invalid file format, worksheet not found',
        downloadUrl,
      );
    }

    return productionPlan;
  }

  async validateProductionPlanSheet(
    worksheet: Worksheet,
    productionPlan: CreateProductPlanDto,
    productionPlanError: Map<
      string,
      {
        fieldName: string;
        value: string;
        text?: any;
      }
    > = new Map(),
    errorResponse,
  ) {
    const productionPlanInfo = worksheet.getTable(PRODUCTION_PLAN_INFO);

    if (!productionPlanInfo) {
      errorResponse = apiFailed(
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        'Invalid format, production plan info table not found',
      );
      return;
    }

    const productionPlanDetail = worksheet.getTable(
      PRODUCTION_PLAN_DETAIL_TABLE,
    );

    if (!productionPlanDetail) {
      errorResponse = apiFailed(
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        'Invalid format, production plan detail table not found',
      );
      return;
    }

    const productionPlanNote = worksheet.getTable(PRODUCTION_PLAN_NOTE_TABLE);

    if (!productionPlanNote) {
      errorResponse = apiFailed(
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        'Invalid format, production plan note table not found',
      );
      return;
    }

    const productionPlanInfoValue = this.extractVerticalTable(
      productionPlanInfo,
      worksheet,
    );

    const productionPlanNoteValue = this.extractVerticalTable(
      productionPlanNote,
      worksheet,
    );

    await this.validateProductionPlanInfoTable(
      worksheet,
      productionPlanError,
      productionPlanInfoValue,
      productionPlan,
    );

    await this.validateProductionPlanDetailTable(
      worksheet,
      productionPlanError,
      productionPlanDetail,
      productionPlan.productionPlanDetails,
    );
  }

  async validateProductionPlanInfoTable(
    worksheet: Worksheet,
    listItemError: Map<
      string,
      {
        fieldName: string;
        value: string;
        text?: any;
      }
    >,
    itemTable: any,
    productionPlan: CreateProductPlanDto,
  ) {
    for (let i = 0; i < itemTable.length; i++) {
      let errorSet = false;
      if (typeof itemTable[i][1] === 'object') {
        itemTable[i][1].value = this.getCellValue(itemTable[i][1]);
      }
      let value = itemTable[i][1].value;

      if (typeof value === 'string' && value !== null) {
        itemTable[i][1].value = value.trim();
      }
      switch (itemTable[i][0].value.split(':')[0].trim()) {
        case 'Name': {
          if (
            this.validateRequired(
              value,
              itemTable[i][0].value.split(':')[0].trim(),
              itemTable[i][1].address,
              listItemError,
            )
          ) {
            productionPlan.name = value;
          }
          break;
        }

        case 'From': {
          errorSet = false;
          if (
            this.validateRequired(
              value,
              itemTable[i][0].value.split(':')[0].trim(),
              itemTable[i][1].address,
              listItemError,
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
                listItemError,
                itemTable[i][1].address,
                'Start Date',
                value,
                text,
              );
            }
            if (new Date(value) < new Date() && !errorSet) {
              const text = [
                { text: `${value.toISOString().split('T')[0]}` },
                {
                  text: `[Start Date must be after current date]`,
                  font: { color: { argb: 'FF0000' } },
                },
              ];
              this.addError(
                listItemError,
                itemTable[i][1].address,
                'Start Date',
                value,
                text,
              );
            }
            if (!errorSet) {
              productionPlan.expectedStartDate = value;
            }
          }
        }

        case 'To': {
          errorSet = false;
          if (
            this.validateRequired(
              value,
              itemTable[i][0].value.split(':')[0].trim(),
              itemTable[i][1].address,
              listItemError,
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
                listItemError,
                itemTable[i][1].address,
                'End Date',
                value,
                text,
              );
              errorSet = true;
            }
            if (new Date(value) < new Date() && !errorSet) {
              const text = [
                { text: `${value.toISOString().split('T')[0]}` },
                {
                  text: `[End Date must be after current date]`,
                  font: { color: { argb: 'FF0000' } },
                },
              ];
              this.addError(
                listItemError,
                itemTable[i][1].address,
                'End Date',
                value,
                text,
              );
              errorSet = true;
            }

            if (!errorSet) {
              productionPlan.expectedEndDate = value;
            }
          }
          break;
        }
      }
    }
  }

  async validateProductionPlanDetailTable(
    worksheet: Worksheet,
    listItemError: Map<
      string,
      {
        fieldName: string;
        value: string;
        text?: any;
      }
    >,
    itemTable: any,
    itemListResult: CreateProductPlanDetailDto[],
  ) {
    const header = itemTable.table.columns.map((column: any) => column.name);

    //Check if header is valid
    const isHeaderValid = compareArray(header, PRODUCTION_PLAN_DETAIL_HEADER);
    if (!isHeaderValid) {
      return apiFailed(
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        'Invalid format, production plan detail header is not valid',
      );
    }

    const [startCell, endCell] = itemTable.table.tableRef.split(':');
    const startRow = parseInt(startCell.replace(/\D/g, ''), 10);
    const endRow = parseInt(endCell.replace(/\D/g, ''), 10);
    //Check item validation
    for (let i = startRow + 1; i <= endRow; i++) {
      let productCode;
      let product: ProductSize;
      let isError = false;
      let errorFlag = false;
      const row = worksheet.getRow(i);
      const itemCell = {
        productCodeCell: row.getCell(1),
        productNameCell: row.getCell(2),
        quantityToProduceCell: row.getCell(3),
        note: row.getCell(4),
      };

      if (
        isEmpty(itemCell.productCodeCell.value) &&
        isEmpty(itemCell.quantityToProduceCell.value) &&
        isEmpty(itemCell.note.value)
      ) {
        continue;
      } else {
        if (
          this.validateRequired(
            itemCell.productCodeCell.value as string,
            'Product Code',
            itemCell.productCodeCell.address,
            listItemError,
          )
        ) {
          product = await this.productSizeService.findQuery({
            code: this.extractValueFromCellValue(itemCell.productCodeCell),
          });
          productCode = product?.code;
          if (isEmpty(product)) {
            const text = [
              { text: `${itemCell.productCodeCell.value}` },
              {
                text: `[Product not found]`,
                font: { color: { argb: 'FF0000' } },
              },
            ];
            this.addError(
              listItemError,
              itemCell.productCodeCell.address,
              'Product',
              itemCell.productCodeCell.value,
              text,
            );
            errorFlag = true;
            isError = true;
          }
        }
        if (
          this.validateRequired(
            itemCell.quantityToProduceCell.value as string,
            'Quantity To Produce',
            itemCell.quantityToProduceCell.address,
            listItemError,
          )
        ) {
          console.log(
            'itemCell.quantityToProduceCell.value',
            itemCell.quantityToProduceCell.value,
          );
          if (!isInt(itemCell.quantityToProduceCell.value) && !errorFlag) {
            const text = [
              { text: `${itemCell.quantityToProduceCell.value}` },
              {
                text: `[Quantity must be a number]`,
                font: { color: { argb: 'FF0000' } },
              },
            ];
            this.addError(
              listItemError,
              itemCell.quantityToProduceCell.address,
              'Quantity To Produce',
              itemCell.quantityToProduceCell.value,
              text,
            );
            isError = true;
            errorFlag = true;
          }
          if (!min(itemCell.quantityToProduceCell.value, 0) && !errorFlag) {
            const text = [
              { text: `${itemCell.quantityToProduceCell.value}` },
              {
                text: `[Quantity must be greater than 0]`,
                font: { color: { argb: 'FF0000' } },
              },
            ];
            this.addError(
              listItemError,
              itemCell.quantityToProduceCell.address,
              'Quantity To Produce',
              itemCell.quantityToProduceCell.value,
              text,
            );
            isError = true;
            errorFlag = false;
          }
        } else {
          isError = true;
          errorFlag = true;
        }

        if (!isError) {
          itemListResult.push({
            productSizeId: product?.id,
            code: productCode,
            quantityToProduce: itemCell.quantityToProduceCell.value as number,
            note: itemCell.note.value
              ? (itemCell.note.value as string)
              : undefined,
          });
        }
      }
    }
  }

  //Production batch
  async readProductionBatchExcel(file: any) {
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
    await workbook.xlsx.load(file.buffer);
    const worksheet = workbook.getWorksheet(PRODUCTION_BATCH_SHEET_NAME);
    const materialRequirementSheet = workbook.getWorksheet(
      MATERIAL_REQUIREMENT_SHEET_NAME,
    );
    if (!worksheet || !materialRequirementSheet) {
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'Invalid file format, worksheet not found',
      );
    }
    let productionBatch: CreateProductionBatchDto =
      new CreateProductionBatchDto();
    let productionBatchError: Map<
      string,
      {
        fieldName: string;
        value: string;
        text?: any;
      }
    > = new Map();
    let productionMaterialVaraintError: Map<
      string,
      {
        fieldName: string;
        value: string;
        text?: any;
      }
    > = new Map();
    let errorResponse;

    // Logger.log('Production Batch Info', productionBatch);

    await this.validateProductionBatchSheet(
      worksheet,
      productionBatch,
      productionBatchError,
      errorResponse,
    );

    // Logger.log('Production Batch Error', productionBatch.code);

    if (errorResponse) {
      return errorResponse;
    }

    console.log('Production Batch Error', productionBatchError);

    if (productionBatchError.size > 0) {
      productionBatchError.forEach((value, key) => {
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
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.originalname}`;
      const bufferResult = await workbook.xlsx.writeBuffer();
      const nodeBuffer = Buffer.from(bufferResult);
      const downloadUrl = await this.firebaseService.uploadBufferToStorage(
        nodeBuffer,
        fileName,
      );
      return apiFailed(
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        'There is error in the file',
        downloadUrl,
      );
    }

    productionBatch.productionBatchMaterials = [];

    await this.validateProductionMaterialSheet(
      materialRequirementSheet,
      productionBatch,
      productionMaterialVaraintError,
      errorResponse,
    );
    

    if (productionMaterialVaraintError.size > 0) {
      productionMaterialVaraintError.forEach((value, key) => {
        const cell = materialRequirementSheet.getCell(key);

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
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.originalname}`;
      const bufferResult = await workbook.xlsx.writeBuffer();
      const nodeBuffer = Buffer.from(bufferResult);
      const downloadUrl = await this.firebaseService.uploadBufferToStorage(
        nodeBuffer,
        fileName,
      );
      return apiFailed(
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        'There is error in the file',
        downloadUrl,
      );
    }

    return productionBatch;
  }

  async validateProductionBatchSheet(
    worksheet: Worksheet,
    productionBatch: CreateProductionBatchDto,
    productionBatchError: Map<
      string,
      {
        fieldName: string;
        value: string;
        text?: any;
      }
    > = new Map(),
    errorResponse,
  ) {
    const productionBatchDetail = worksheet.getTable(
      PRODUCTION_BATCH_DETAIL_TABLE,
    );

    if (!productionBatchDetail) {
      errorResponse = apiFailed(
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        'Invalid format, production batch detail table not found',
      );
      return;
    }
    //Get The Production Batch Info
    await this.extractProductionBatchInfo(
      worksheet,
      productionBatch,
      productionBatchError,
    );

    if (!productionBatchDetail) {
      errorResponse = apiFailed(
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        'Invalid format, production batch detail table not found',
      );
      return;
    }

    await this.validateProductionBatchDetailTable(
      worksheet,
      productionBatchError,
      productionBatchDetail,
      productionBatch,
    );
  }

  //Extract Production Batch Info
  async extractProductionBatchInfo(
    worksheet: Worksheet,
    productionBatch: CreateProductionBatchDto,
    productionBatchError: Map<
      string,
      {
        fieldName: string;
        value: string;
        text?: any;
      }
    >,
  ) {
    const productionBatchInfo = worksheet.getTable(PRODUCTION_BATCH_INFO);

    if (!productionBatchInfo) {
      throw new BadRequestException(
        'Invalid format, production batch info table not found',
      );
    }

    const productionBatchInfoValue = this.extractVerticalTable(
      productionBatchInfo,
      worksheet,
    );

    await this.validateProductionBatchInfoTable(
      worksheet,
      productionBatchInfoValue,
      productionBatchError,
      productionBatch,
    );
  }

  async validateProductionBatchInfoTable(
    worksheet: Worksheet,
    productionBatchInfoValue,
    productionBatchError: Map<
      string,
      { fieldName: string; value: string; text?: any }
    >,
    productionBatch: CreateProductionBatchDto,
  ) {
    let errorFlag = false;
    console.log(productionBatchInfoValue);
    for (let i = 0; i < productionBatchInfoValue.length; i++) {
      if (typeof productionBatchInfoValue[i][1] === 'object') {
        productionBatchInfoValue[i][1].value = this.getCellValue(
          productionBatchInfoValue[i][1],
        );
      }
      let value = productionBatchInfoValue[i][1].value;

      if (typeof value === 'string' && value !== null) {
        productionBatchInfoValue[i][1].value = value.trim();
      }
      switch (productionBatchInfoValue[i][0].value.split(':')[0].trim()) {
        case 'Production Plan Detail Code':
          errorFlag = false;
          if (
            this.validateRequired(
              value,
              productionBatchInfoValue[i][0].value.split(':')[0].trim(),
              productionBatchInfoValue[i][1].address,
              productionBatchError,
              ` ${value}`,
            )
          ) {
            const productionPlanDetail =
              await this.productPlanDetailService.findQuery({
                code: value,
              });
            if (isEmpty(productionPlanDetail)) {
              const text = [
                { text: `${value}` },
                {
                  text: `[Production Plan Detail not found]`,
                  font: { color: { argb: 'FF0000' } },
                },
              ];
              this.addError(
                productionBatchError,
                productionBatchInfoValue[i][1].address,
                'Production Plan Detail Code',
                value,
                text,
              );
              errorFlag = true;
            }
            if (!errorFlag) {
              productionBatch.productionPlanDetailId = productionPlanDetail.id;
            }
          }
          break;
        case 'Product Batch Name':
          errorFlag = false;
          if (
            this.validateRequired(
              value,
              productionBatchInfoValue[i][0].value.split(':')[0].trim(),
              productionBatchInfoValue[i][1].address,
              productionBatchError,
            )
          ) {
            if (!errorFlag) {
              Logger.log('Product Batch Name', value);
              productionBatch.name = value;
            }
          }
          break;
        case 'From':
          errorFlag = false;
          if (
            this.validateRequired(
              value,
              productionBatchInfoValue[i][0].value.split(':')[0].trim(),
              productionBatchInfoValue[i][1].address,
              productionBatchError,
              `${DATE_FORMAT}`,
            )
          ) {
            if (!validateDate(value) && !errorFlag) {
              const text = [
                { text: `${value}` },
                {
                  text: `[Invalid date format, must be ${DATE_FORMAT}]`,
                  font: { color: { argb: 'FF0000' } },
                },
              ];
              this.addError(
                productionBatchError,
                productionBatchInfoValue[i][1].address,
                'From',
                value,
                text,
              );
              errorFlag = true;
            }

            if (
              getDatePart(new Date(value)) < getDatePart(new Date()) &&
              !errorFlag
            ) {
              const text = [
                { text: `${value.toISOString().split('T')[0]}` },
                {
                  text: `[From must be after current date]`,
                  font: { color: { argb: 'FF0000' } },
                },
              ];
              this.addError(
                productionBatchError,
                productionBatchInfoValue[i][1].address,
                'Expected Delivery Date',
                value,
                text,
              );
              errorFlag = true;
            }

            if (!errorFlag) {
              productionBatch.startDate = value;
            }
          }
          break;
        case 'To':
          errorFlag = false;
          if (
            this.validateRequired(
              value,
              productionBatchInfoValue[i][0].value.split(':')[0].trim(),
              productionBatchInfoValue[i][1].address,
              productionBatchError,
              `${DATE_FORMAT}`,
            )
          ) {
            if (!validateDate(value) && !errorFlag) {
              const text = [
                { text: `${value}` },
                {
                  text: `[Invalid date format, must be ${DATE_FORMAT}]`,
                  font: { color: { argb: 'FF0000' } },
                },
              ];
              this.addError(
                productionBatchError,
                productionBatchInfoValue[i][1].address,
                'To',
                value,
                text,
              );
              errorFlag = true;
            }

            if (
              getDatePart(new Date(value)) < getDatePart(new Date()) &&
              !errorFlag
            ) {
              const text = [
                { text: `${value.toISOString().split('T')[0]}` },
                {
                  text: `[To must be after current date]`,
                  font: { color: { argb: 'FF0000' } },
                },
              ];
              this.addError(
                productionBatchError,
                productionBatchInfoValue[i][1].address,
                'To',
                value,
                text,
              );
              errorFlag = true;
            }

            if (!errorFlag) {
              productionBatch.expectedFinishDate = value;
            }
          }
          break;
      }
    }
  }

  async validateProductionBatchDetailTable(
    worksheet: Worksheet,
    listItemError: Map<
      string,
      {
        fieldName: string;
        value: string;
        text?: any;
      }
    >,
    itemTable: any,
    itemListResult: CreateProductionBatchDto,
  ) {
    const header = itemTable.table.columns.map((column: any) => column.name);

    //Check if header is valid
    const isHeaderValid = compareArray(header, PRODUCTION_BATCH_DETAIL_HEADER);
    //Need to check return and to what did it catch it
    if (!isHeaderValid) {
      throw new BadRequestException(
        'Invalid format, production batch detail header is not valid',
      );
    }

    const [startCell, endCell] = itemTable.table.tableRef.split(':');
    const startRow = parseInt(startCell.replace(/\D/g, ''), 10);
    const endRow = parseInt(endCell.replace(/\D/g, ''), 10);
    //Check item validation
    for (let i = startRow + 1; i <= endRow; i++) {
      let productionPlanDetailCode;
      let productionPlanDetail: any;
      let isError = false;
      let errorFlag = false;
      const row = worksheet.getRow(i);
      const itemCell = {
        productionPlanCodeCell: row.getCell(1),
        nameCell: row.getCell(2),
        quantityToProduceCell: row.getCell(3),
        descriptionCell: row.getCell(4),
      };

      if (
        isEmpty(itemCell.productionPlanCodeCell.value) &&
        isEmpty(itemCell.nameCell.value) &&
        isEmpty(itemCell.quantityToProduceCell.value) &&
        isEmpty(itemCell.descriptionCell.value)
      ) {
        continue;
      } else {
        if (
          this.validateRequired(
            itemCell.productionPlanCodeCell.value as string,
            'Product Size Code',
            itemCell.productionPlanCodeCell.address,
            listItemError,
          )
        ) {
          productionPlanDetail = await this.productSizeService.findQuery({
            code: this.extractValueFromCellValue(
              itemCell.productionPlanCodeCell,
            ),
          });

          //Need to check if the product size code in the plan
          productionPlanDetailCode = productionPlanDetail?.code;
          if (isEmpty(productionPlanDetail)) {
            const text = [
              { text: `${itemCell.productionPlanCodeCell.value}` },
              {
                text: `[Product Size not found]`,
                font: { color: { argb: 'FF0000' } },
              },
            ];
            this.addError(
              listItemError,
              itemCell.productionPlanCodeCell.address,
              'Product Size Code',
              itemCell.productionPlanCodeCell.value,
              text,
            );
            errorFlag = true;
            isError = true;
          }
        }
        if (
          this.validateRequired(
            itemCell.quantityToProduceCell.value as string,
            'Quantity To Produce',
            itemCell.quantityToProduceCell.address,
            listItemError,
          )
        ) {
          if (!isInt(itemCell.quantityToProduceCell.value) && !errorFlag) {
            const text = [
              { text: `${itemCell.quantityToProduceCell.value}` },
              {
                text: `[Quantity must be a number]`,
                font: { color: { argb: 'FF0000' } },
              },
            ];

            this.addError(
              listItemError,
              itemCell.quantityToProduceCell.address,
              'Quantity To Produce',
              itemCell.quantityToProduceCell.value,
              text,
            );
            isError = true;
            errorFlag = true;
          }
          if (!min(itemCell.quantityToProduceCell.value, 0) && !errorFlag) {
            const text = [
              { text: `${itemCell.quantityToProduceCell.value}` },
              {
                text: `[Quantity must be greater than 0]`,
                font: { color: { argb: 'FF0000' } },
              },
            ];
            this.addError(
              listItemError,
              itemCell.quantityToProduceCell.address,
              'Quantity To Produce',
              itemCell.quantityToProduceCell.value,
              text,
            );
            isError = true;
            errorFlag = false;
          }
        } else {
          isError = true;
          errorFlag = true;
        }

        if (!isError) {
          console.log(
            'itemCell.quantityToProduceCell.value',
            itemCell.quantityToProduceCell.value,
          );

          itemListResult.code = productionPlanDetailCode;
          itemListResult.quantityToProduce = itemCell.quantityToProduceCell
            .value as number;
          itemListResult.description = itemCell.descriptionCell.value
            ? (itemCell.descriptionCell.value as string)
            : undefined;
        }
      }
    }
  }

  async validateProductionMaterialSheet(
    worksheet: Worksheet,
    productionBatch: CreateProductionBatchDto,
    productionMaterialVaraintError: Map<
      string,
      {
        fieldName: string;
        value: string;
        text?: any;
      }
    > = new Map(),
    errorResponse,
  ) {
    const productionMaterialVariantTable = worksheet.getTable(
      PRODUCTION_MATERIAL_VARIANT_DETAIL_TABLE,
    );

    if (!productionMaterialVariantTable) {
      throw new BadRequestException(
        'Invalid format, production material detail table not found',
      );
    }

    await this.validateProductionMaterialDetailTable(
      worksheet,
      productionMaterialVaraintError,
      productionMaterialVariantTable,
      productionBatch,
    );
  }
  async validateProductionMaterialDetailTable(
    worksheet: Worksheet,
    productionMaterialVaraintError: Map<
      string,
      { fieldName: string; value: string; text?: any }
    >,
    itemTable: any,
    productionBatch: CreateProductionBatchDto,
  ) {
    const header = itemTable.table.columns.map((column: any) => column.name);

    //Check if header is valid
    const isHeaderValid = compareArray(
      header,
      PRODUCTION_MATERIAL_VARIANT_HEADER,
    );
    if (!isHeaderValid) {
      return apiFailed(
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        'Invalid format, production material variant header is not valid',
      );
    }

    const [startCell, endCell] = itemTable.table.tableRef.split(':');
    const startRow = parseInt(startCell.replace(/\D/g, ''), 10);
    const endRow = parseInt(endCell.replace(/\D/g, ''), 10);
    for (let i = startRow + 1; i <= endRow; i++) {
      let materialVariantCode;
      let materialVariant: any;
      let isError = false;
      let errorFlag = false;
      const row = worksheet.getRow(i);
      const itemCell = {
        materialVariantCodeCell: row.getCell(1),
        materialVariantNameCell: row.getCell(2),
        quantityByUOMCell: row.getCell(3),
        unitOfmeasurementCell: row.getCell(4),
      };

      if (
        isEmpty(itemCell.materialVariantCodeCell.value) &&
        // isEmpty(itemCell.materialVariantNameCell.value) &&
        isEmpty(itemCell.quantityByUOMCell.value)
        // isEmpty(itemCell.unitOfmeasurementCell.value)
      ) {
        continue;
      } else {
        if (
          this.validateRequired(
            itemCell.materialVariantCodeCell.value as string,
            'Material Variant Code',
            itemCell.materialVariantCodeCell.address,
            productionMaterialVaraintError,
          )
        ) {
          materialVariant =
            await this.materialVariantService.findByMaterialCodeWithoutResponse(
              this.extractValueFromCellValue(itemCell.materialVariantCodeCell),
            );
          if (isEmpty(materialVariant)) {
            const text = [
              { text: `${itemCell.materialVariantCodeCell.value}` },
              {
                text: `[Material Variant not found]`,
                font: { color: { argb: 'FF0000' } },
              },
            ];
            this.addError(
              productionMaterialVaraintError,
              itemCell.materialVariantCodeCell.address,
              'Material Variant',
              itemCell.materialVariantCodeCell.value,
              text,
            );
            errorFlag = true;
            isError = true;
          } else {
            materialVariantCode = materialVariantCode?.code;
          }
        }
        if (
          this.validateRequired(
            itemCell.quantityByUOMCell.value as string,
            'Quantity To Produce',
            itemCell.quantityByUOMCell.address,
            productionMaterialVaraintError,
          )
        ) {
          if (!isInt(itemCell.quantityByUOMCell.value) && !errorFlag) {
            const text = [
              { text: `${itemCell.quantityByUOMCell.value}` },
              {
                text: `[Quantity By Uom must be a number]`,
                font: { color: { argb: 'FF0000' } },
              },
            ];
            this.addError(
              productionMaterialVaraintError,
              itemCell.quantityByUOMCell.address,
              'Quantity By Uom',
              itemCell.quantityByUOMCell.value,
              text,
            );
            isError = true;
            errorFlag = true;
          }
          if (!min(itemCell.quantityByUOMCell.value, 0) && !errorFlag) {
            const text = [
              { text: `${itemCell.quantityByUOMCell.value}` },
              {
                text: `[Quantity By Uom must be greater than 0]`,
                font: { color: { argb: 'FF0000' } },
              },
            ];
            this.addError(
              productionMaterialVaraintError,
              itemCell.quantityByUOMCell.address,
              'Quantity By Uom',
              itemCell.quantityByUOMCell.value,
              text,
            );
            isError = true;
            errorFlag = false;
          }
        } else {
          isError = true;
          errorFlag = true;
        }
        if (!isError) {
          if (
            productionBatch.productionBatchMaterials.find(
              (x) => x.materialVariantId === materialVariant?.id,
            )
          ) {
            const text = [
              { text: `${itemCell.materialVariantCodeCell.value}` },
              {
                text: `[Material Variant already exists]`,
                font: { color: { argb: 'FF0000' } },
              },
            ];
            this.addError(
              productionMaterialVaraintError,
              itemCell.materialVariantCodeCell.address,
              'Material Variant',
              itemCell.materialVariantCodeCell.value,
              text,
            );
            isError = true;
            errorFlag = true;
          }

          productionBatch.productionBatchMaterials.push({
            materialVariantId: materialVariant?.id,
            productionBatchId: null,
            quantityByUom: itemCell.quantityByUOMCell.value as number,
          });
        }
      }
    }
  }

  //Product Formula
  async readProductFormulaExcel(file: Express.Multer.File) {
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
    await workbook.xlsx.load(file.buffer);
    const productFormulaSheet = workbook.getWorksheet(
      PRODUCT_FORMULA_SHEET_NAME,
    );
    if (!productFormulaSheet) {
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'Invalid file format, worksheet not found',
      );
    }

    const productFormula: ArrayExcelProductFormula[] = [];
    let productFormulaError: Map<
      string,
      {
        fieldName: string;
        value: string;
        text?: any;
      }
    > = new Map();
    let errorResponse;
    await this.validateProductFormulaSheet(
      productFormulaSheet,
      productFormula,
      productFormulaError,
      errorResponse,
    );
    if (errorResponse) {
      return errorResponse;
    }

    if (productFormulaError.size > 0) {
      productFormulaError.forEach((value, key) => {
        const cell = productFormulaSheet.getCell(key);

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
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.originalname}`;
      const bufferResult = await workbook.xlsx.writeBuffer();
      const nodeBuffer = Buffer.from(bufferResult);
      const downloadUrl = await this.firebaseService.uploadBufferToStorage(
        nodeBuffer,
        fileName,
      );
      return apiFailed(
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        'There is error in the file',
        downloadUrl,
      );
    }
    return productFormula;
  }

  async validateProductFormulaSheet(
    worksheet: Worksheet,
    productFormula: ArrayExcelProductFormula[],
    productFormulaError: Map<
      string,
      { fieldName: string; value: string; text?: any }
    > = new Map(),
    errorResponse,
  ) {
    const productFormulaTable = worksheet.getTable(
      PRODUCT_FORMULA_TABLE_NAME,
    ) as any;
    if (!productFormulaTable) {
      console.log('error getting product formula table');
      errorResponse = apiFailed(
        HttpStatus.BAD_REQUEST,
        'Invalid file format, worksheet not found',
      );
      return;
    }

    const header = productFormulaTable.table.columns.map(
      (column: any) => column.name,
    );
    const isHeaderValid = compareArray(header, PRODUCT_FORMULA_HEADER);
    if (!isHeaderValid) {
      console.log('error getting product formula header');
      errorResponse = apiFailed(
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        'Invalid format, product formula header is not valid',
      );
      return;
    }
    const [startCell, endCell] = productFormulaTable.table.tableRef.split(':');
    const startRow = parseInt(startCell.replace(/\D/g, ''), 10);
    const endRow = parseInt(endCell.replace(/\D/g, ''), 10);

    for (let i = startRow + 1; i <= endRow; i++) {
      let materialVariantCode;
      let materialVariant: any;
      let isError = false;
      let errorFlag = false;
      const row = worksheet.getRow(i);
      const itemCell = {
        materialVariantCodeCell: row.getCell(1),
        materialVariantNameCell: row.getCell(2),
        quantityByUomCell: row.getCell(3),
        unitOfMeasurementCell: row.getCell(4),
      };

      if (
        isEmpty(itemCell.materialVariantCodeCell.value) &&
        isEmpty(itemCell.materialVariantNameCell.value) &&
        isEmpty(itemCell.quantityByUomCell.value) &&
        isEmpty(itemCell.unitOfMeasurementCell.value)
      ) {
        continue;
      } else {
        if (
          this.validateRequired(
            itemCell.materialVariantCodeCell.value as string,
            'Material Variant Code',
            itemCell.materialVariantCodeCell.address,
            productFormulaError,
          )
        ) {
          materialVariant =
            await this.materialVariantService.findByMaterialCodeWithoutResponse(
              this.extractValueFromCellValue(itemCell.materialVariantCodeCell),
            );
          if (isEmpty(materialVariant)) {
            const text = [
              { text: `${itemCell.materialVariantCodeCell.value}` },
              {
                text: `[Material Variant not found]`,
                font: { color: { argb: 'FF0000' } },
              },
            ];
            this.addError(
              productFormulaError,
              itemCell.materialVariantCodeCell.address,
              'Material Variant',
              itemCell.materialVariantCodeCell.value,
              text,
            );
            errorFlag = true;
            isError = true;
          } else {
            materialVariantCode = materialVariantCode?.code;
          }
        }
        if (
          this.validateRequired(
            itemCell.materialVariantNameCell.value as string,
            'Material Variant Name',
            itemCell.materialVariantNameCell.address,
            productFormulaError,
          )
        ) {
          if (!isString(itemCell.materialVariantNameCell.value) && !errorFlag) {
            const text = [
              { text: `${itemCell.materialVariantNameCell.value}` },
              {
                text: `[Material Variant Name must be a string]`,
                font: { color: { argb: 'FF0000' } },
              },
            ];
            this.addError(
              productFormulaError,
              itemCell.materialVariantNameCell.address,
              'Material Variant Name',
              itemCell.materialVariantNameCell.value,
              text,
            );
            isError = true;
            errorFlag = true;
          }
        } else {
          isError = true;
          errorFlag = true;
        }
        if (
          this.validateRequired(
            itemCell.quantityByUomCell.value as string,
            'Quantity by UOM',
            itemCell.quantityByUomCell.address,
            productFormulaError,
          )
        ) {
          if (!isNumber(itemCell.quantityByUomCell.value) && !errorFlag) {
            const text = [
              { text: `${itemCell.quantityByUomCell.value}` },
              {
                text: `[Quantity by UOM must be a number]`,
                font: { color: { argb: 'FF0000' } },
              },
            ];
            this.addError(
              productFormulaError,
              itemCell.quantityByUomCell.address,
              'Quantity by UOM',
              itemCell.quantityByUomCell.value,
              text,
            );
            isError = true;
            errorFlag = true;
          }
        } else {
          isError = true;
          errorFlag = true;
        }
        if (
          this.validateRequired(
            itemCell.unitOfMeasurementCell.value as string,
            'Unit of Measurement',
            itemCell.unitOfMeasurementCell.address,
            productFormulaError,
          )
        ) {
          if (!isString(itemCell.unitOfMeasurementCell.value) && !errorFlag) {
            const text = [
              { text: `${itemCell.unitOfMeasurementCell.value}` },
              {
                text: `[Unit of Measurement must be a string]`,
                font: { color: { argb: 'FF0000' } },
              },
            ];
            this.addError(
              productFormulaError,
              itemCell.unitOfMeasurementCell.address,
              'Unit of Measurement',
              itemCell.unitOfMeasurementCell.value,
              text,
            );
            isError = true;
            errorFlag = true;
          }
        } else {
          isError = true;
          errorFlag = true;
        }
        if (!isError && !errorFlag) {
          if (
            productFormula.find(
              (x) => x.materialVariantId === materialVariant?.id,
            )
          ) {
            const text = [
              { text: `${itemCell.materialVariantCodeCell.value}` },
              {
                text: `[Material Variant already exist]`,
                font: { color: { argb: 'FF0000' } },
              },
            ];
            this.addError(
              productFormulaError,
              itemCell.materialVariantCodeCell.address,
              'Material Variant',
              itemCell.materialVariantCodeCell.value,
              text,
            );
          }
          productFormula.push({
            materialVariantId: materialVariant?.id,
            quantityByUom: itemCell.quantityByUomCell.value as number,
          });
        }
      }
    }
  }
}

//Every day, i wonder the existence of my life.
