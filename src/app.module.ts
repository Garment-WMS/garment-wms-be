import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as rolesGuard from './common/guard/roles.guard';
import { AuthModule } from './modules/auth/auth.module';
import { BlacklistTokenModule } from './modules/blacklist-token/blacklist-token.module';
import { ImageModule } from './modules/image/image.module';
import { MailModule } from './modules/mail/mail.module';
import { OtpModule } from './modules/otp/otp.module';
import { RefreshTokenModule } from './modules/refresh-token/refresh-token.module';
// import { RoleModule } from './modules/role/role.module';

import { PrismaModule } from 'prisma/prisma.module';
import { ExcelModule } from './modules/excel/excel.module';
import { MaterialVariantModule } from './modules/material-variant/material-variant.module';

import { ImportReceiptModule } from './modules/import-receipt/import-receipt.module';
import { ImportRequestModule } from './modules/import-request/import-request.module';
import { InspectionDepartmentModule } from './modules/inspection-department/inspection-department.module';
import { InspectionReportModule } from './modules/inspection-report/inspection-report.module';
import { InspectionRequestModule } from './modules/inspection-request/inspection-request.module';
import { InventoryReportDetailModule } from './modules/inventory-report-detail/inventory-report-detail.module';
import { InventoryReportModule } from './modules/inventory-report/inventory-report.module';
import { InventoryStockModule } from './modules/inventory-stock/inventory-stock.module';
import { MaterialAttributeModule } from './modules/material-attribute/material-attribute.module';
import { MaterialPackageModule } from './modules/material-package/material-package.module';
import { MaterialReceiptModule } from './modules/material-receipt/material-receipt.module';
import { MaterialUnitModule } from './modules/material-unit/material-unit.module';
import { MaterialModule } from './modules/material/material.module';
import { PoDeliveryMaterialModule } from './modules/po-delivery-material/po-delivery-material.module';
import { PoDeliveryModule } from './modules/po-delivery/po-delivery.module';
import { PoPoDeliveryBridgeModule } from './modules/po-po-delivery-bridge/po-po-delivery-bridge.module';
import { ProductFormulaMaterialModule } from './modules/product-formula-material/product-formula-material.module';
import { ProductFormulaModule } from './modules/product-formula/product-formula.module';
import { ProductPlanDetailModule } from './modules/product-plan-detail/product-plan-detail.module';
import { ProductPlanModule } from './modules/product-plan/product-plan.module';
import { ProductSizeModule } from './modules/product-size/product-size.module';
import { ProductUomModule } from './modules/product-uom/product-uom.module';
import { ProductVariantModule } from './modules/product-variant/product-variant.module';
import { PurchaseOrderModule } from './modules/purchase-order/purchase-order.module';
import { QuarterlyProductDetailModule } from './modules/quarterly-product-detail/quarterly-product-detail.module';
import { QuarterlyProductPlanModule } from './modules/quarterly-product-plan/quarterly-product-plan.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { UomModule } from './modules/uom/uom.module';
import { UserModule } from './modules/user/user.module';
import { WarehouseStaffModule } from './modules/warehouse-staff/warehouse-staff.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    BlacklistTokenModule,
    RefreshTokenModule,
    MailModule,
    ImageModule,
    OtpModule,
    ExcelModule,
    PurchaseOrderModule,
    SupplierModule,
    PoDeliveryModule,
    PoDeliveryMaterialModule,
    MaterialModule,
    ProductSizeModule,
    // PackagingUnitModule,
    UomModule,
    MaterialUnitModule,
    MaterialAttributeModule,
    ImportRequestModule,
    MaterialVariantModule,
    MaterialPackageModule,
    PoPoDeliveryBridgeModule,
    ProductPlanModule,
    QuarterlyProductPlanModule,
    QuarterlyProductDetailModule,
    ProductModule,
    ProductFormulaModule,
    ProductUomModule,
    ProductVariantModule,
    ProductFormulaMaterialModule,
    ImportReceiptModule,
    InspectionReportModule,
    InspectionRequestModule,
    MaterialReceiptModule,
    InventoryReportModule,
    InventoryStockModule,
    InspectionDepartmentModule,
    WarehouseStaffModule,
    InventoryReportDetailModule,
    ProductPlanDetailModule,
  ],
  controllers: [AppController],
  providers: [AppService, rolesGuard.RolesGuard],
  exports: [],
})
export class AppModule {}
