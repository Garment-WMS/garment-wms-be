import { HttpStatus, Injectable } from '@nestjs/common';
import { apiSuccess } from 'src/common/dto/api-response';
import { ImportReceiptService } from '../import-receipt/import-receipt.service';
import { MaterialPackageService } from '../material-package/material-package.service';
import { MaterialReceiptService } from '../material-receipt/material-receipt.service';
import { MaterialVariantService } from '../material-variant/material-variant.service';
import { ProductReceiptService } from '../product-receipt/product-receipt.service';
import { ProductSizeService } from '../product-size/product-size.service';
import { ProductVariantService } from '../product-variant/product-variant.service';
import { CreateGeneralSearchDto } from './dto/create-general-search.dto';
import { UpdateGeneralSearchDto } from './dto/update-general-search.dto';

@Injectable()
export class GeneralSearchService {
  constructor(
    private readonly materialVariantService: MaterialVariantService,
    private readonly productVariantService: ProductVariantService,
    private readonly importReceiptService: ImportReceiptService,
    private readonly materialReceiptService: MaterialReceiptService,
    private readonly productReceiptService: ProductReceiptService,
    private readonly productSizeService: ProductSizeService,
    private readonly materialPackageService: MaterialPackageService,
  ) {}

  async findMaterialOrProductByCode(code: string) {
    let materialVariant = await this.materialVariantService.findByQuery({
      code: code,
    });
    let productVariant = await this.productVariantService.findByQuery({
      code: code,
    });
    const materialPackage:any = await this.materialPackageService.findByQuery({
      code: code,
    });
    const productSize:any = await this.productSizeService.findQuery({
      code: code,
    });
    if(materialPackage && materialVariant===null){
      materialVariant = materialPackage.materialVariant
    }else if(productSize && productVariant===null){
      productVariant = productSize.productVariant
    }
    return apiSuccess(
      HttpStatus.OK,
      {
        materialVariant: materialVariant,
        productVariant: productVariant,
      },
      'Search success',
    );
  }

  async findReceiptByCode(code: string) {
    const importReceipt = await this.importReceiptService.findByQuery({
      code: code,
    });
    const materialReceipt = await this.materialReceiptService.findByQuery({
      code: code,
    });
    const productReceipt = await this.productReceiptService.findByQuery({
      code: code,
    });

    return apiSuccess(
      HttpStatus.OK,
      {
        importReceipt: importReceipt,
        materialReceipt: materialReceipt,
        productReceipt: productReceipt,
      },
      'Search success',
    );
  }

  create(createGeneralSearchDto: CreateGeneralSearchDto) {
    return 'This action adds a new generalSearch';
  }

  findAll() {
    return `This action returns all generalSearch`;
  }

  findOne(id: number) {
    return `This action returns a #${id} generalSearch`;
  }

  update(id: number, updateGeneralSearchDto: UpdateGeneralSearchDto) {
    return `This action updates a #${id} generalSearch`;
  }

  remove(id: number) {
    return `This action removes a #${id} generalSearch`;
  }
}
