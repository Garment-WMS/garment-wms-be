import { Module } from '@nestjs/common';
import { GeneralSearchService } from './general-search.service';
import { GeneralSearchController } from './general-search.controller';
import { ImportReceiptModule } from '../import-receipt/import-receipt.module';
import { MaterialReceiptModule } from '../material-receipt/material-receipt.module';
import { MaterialVariantModule } from '../material-variant/material-variant.module';
import { ProductReceiptModule } from '../product-receipt/product-receipt.module';
import { ProductVariantModule } from '../product-variant/product-variant.module';
import { MaterialPackageModule } from '../material-package/material-package.module';
import { ProductSizeModule } from '../product-size/product-size.module';

@Module({
  controllers: [GeneralSearchController],
  imports: [
    MaterialVariantModule,
    ProductVariantModule,
    ImportReceiptModule,
    MaterialReceiptModule,
    ProductReceiptModule,
    MaterialPackageModule,
    ProductSizeModule
  ],
  providers: [GeneralSearchService],
})
export class GeneralSearchModule {}
