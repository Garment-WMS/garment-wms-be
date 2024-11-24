import { $Enums, Prisma } from '@prisma/client';

export const accountSelect: Prisma.AccountSelect = {
  id: true,
  email: true,
  password: false,
  username: true,
  avatarUrl: true,
  cidId: true,
  dateOfBirth: true,
  firstName: true,
  gender: true,
  isDeleted: true,
  isVerified: true,
  lastName: true,
  phoneNumber: true,
  status: true,
  createdAt: true,
  deletedAt: true,
  updatedAt: true,
};

export const warehouseManagerInclude: Prisma.WarehouseManagerInclude = {
  account: {
    select: accountSelect,
  },
};

export const purchasingStaffInclude: Prisma.PurchasingStaffInclude = {
  account: {
    select: accountSelect,
  },
};

export const productionDepartmentInclude: Prisma.ProductionDepartmentInclude = {
  account: {
    select: accountSelect,
  },
};

export const factoryDirectorInclude: Prisma.FactoryDirectorInclude = {
  account: {
    select: accountSelect,
  },
};

export const materialVariantInclude: Prisma.MaterialVariantInclude = {
  material: {
    include: {
      materialUom: true,
    },
  },
  materialAttribute: true,
  materialInspectionCriteria: true,
};

export const materialPackageInclude: Prisma.MaterialPackageInclude = {
  materialVariant: {
    include: materialVariantInclude,
  },
};

export const productVariantInclude: Prisma.ProductVariantInclude = {
  product: {
    include: {
      productUom: true,
    },
  },
};

export const productSizeInclude: Prisma.ProductSizeInclude = {
  productVariant: {
    include: productVariantInclude,
  },
};

export const productFormulaMaterialInclude: Prisma.ProductFormulaMaterialInclude =
  {
    materialVariant: {
      include: materialVariantInclude,
    },
  };

export const productFormulaInclude: Prisma.ProductFormulaInclude = {
  productSize: {
    include: productSizeInclude,
  },
  productFormulaMaterial: {
    include: productFormulaMaterialInclude,
  },
};

export const importRequestDetailInclude: Prisma.ImportRequestDetailInclude = {
  materialPackage: {
    include: materialPackageInclude,
  },
  productSize: {
    include: productSizeInclude,
  },
};

export const inspectionDepartmentInclude: Prisma.InspectionDepartmentInclude = {
  account: {
    select: accountSelect,
  },
  _count: {
    select: {
      inspectionRequest: {
        where: {
          status: {
            equals: $Enums.InspectionRequestStatus.INSPECTING,
          },
          deletedAt: {
            equals: null,
          },
        },
      },
    },
  },
};

export const importReceiptInclude: Prisma.ImportReceiptInclude = {
  warehouseManager: {
    include: warehouseManagerInclude,
  },
  warehouseStaff: {
    include: warehouseManagerInclude,
  },
  materialReceipt: true,
  productReceipt: true,
  inspectionReport: {
    include: {
      inspectionRequest: true,
    },
  },
};

export const inspectionReportDetailWithoutInspectionReportInclude: Prisma.InspectionReportDetailInclude =
  {
    materialPackage: {
      include: materialPackageInclude,
    },
    productSize: { include: productSizeInclude },
  };

export const inspectionReportIncludeWithoutInspectionRequestWithImportReceipt: Prisma.InspectionReportInclude =
  {
    inspectionReportDetail: {
      include: inspectionReportDetailWithoutInspectionReportInclude,
    },
    importReceipt: {
      include: importReceiptInclude,
    },
  };

export const chatInclude: Prisma.ChatInclude = {
  sender: {
    include: {
      warehouseStaff: true,
      inspectionDepartment: true,
      purchasingStaff: true,
      warehouseManager: true,
      productionDepartment: true,
      factoryDirector: true,
    },
  },
};

export const discussionInclude: Prisma.DiscussionInclude = {
  chat: {
    include: chatInclude,
  },
};

export const importRequestInclude: Prisma.ImportRequestInclude = {
  discussion: {
    include: discussionInclude,
  },
  importRequestDetail: {
    include: importRequestDetailInclude,
  },
  warehouseManager: {
    include: warehouseManagerInclude,
  },
  purchasingStaff: {
    include: purchasingStaffInclude,
  },
  warehouseStaff: {
    include: warehouseManagerInclude,
  },
  productionDepartment: {
    include: productionDepartmentInclude,
  },
  productionBatch: {
    include: {
      productionPlanDetail: {
        include: {
          productionPlan: true,
          productSize: { include: productSizeInclude },
        },
      },
    },
  },
  poDelivery: {
    include: {
      poDeliveryDetail: true,
      purchaseOrder: {
        include: {
          supplier: true,
          purchasingStaff: {
            include: {
              account: true,
            },
          },
        },
      },
    },
  },
  inspectionRequest: {
    include: {
      inspectionDepartment: { include: inspectionDepartmentInclude },
    },
  },
};

export const inspectionReportInclude: Prisma.InspectionReportInclude = {
  inspectionRequest: {
    include: {
      importRequest: {
        include: importRequestInclude,
      },
      inspectionDepartment: true,
      purchasingStaff: true,
    },
  },

  inspectionReportDetail: {
    include: inspectionReportDetailWithoutInspectionReportInclude,
  },
};

export const inspectionRequestInclude: Prisma.InspectionRequestInclude = {
  importRequest: {
    include: {
      importRequestDetail: {
        include: importRequestDetailInclude,
      },
    },
  },
  inspectionDepartment: {
    include: {
      account: true,
    },
  },
  purchasingStaff: {
    include: {
      account: true,
    },
  },
  warehouseManager: {
    include: warehouseManagerInclude,
  },
  inspectionReport: {
    include: inspectionReportInclude,
  },
};

export const productionBatchInclude: Prisma.ProductionBatchInclude = {
  importRequest: {
    include: importRequestInclude,
  },
  materialExportRequest: true,
  productionPlanDetail: {
    include: {
      productSize: {
        include: {
          productVariant: {
            include: {
              product: {
                include: {
                  productUom: true,
                },
              },
            },
          },
        },
      },
    },
  },
};

export const userInclude: Prisma.AccountInclude = {
  factoryDirector: true,
  warehouseStaff: true,
  inspectionDepartment: true,
  purchasingStaff: true,
  productionDepartment: true,
  warehouseManager: true,
};

export const warehouseStaffInclude: Prisma.WarehouseStaffInclude = {
  account: {
    select: accountSelect,
  },
  _count: {
    select: {
      importRequest: {
        where: {
          inspectionRequest: {
            some: {
              inspectionReport: {
                importReceipt: {
                  status: $Enums.ImportReceiptStatus.IMPORTING,
                },
              },
            },
          },
        },
      },
      importReceipt: {
        where: {
          status: $Enums.ImportReceiptStatus.IMPORTING,
        },
      },
    },
  },
};

export const inventoryReportPlan: Prisma.InventoryReportPlanInclude = {
  inventoryReportPlanDetail: {
    include: {
      warehouseStaff: {
        include: {
          account: true,
        },
      },
      materialVariant: {
        include: {
          materialPackage: true,
          material: {
            include: {
              materialUom: true,
            },
          },
        },
      },
      productVariant: {
        include: {
          productSize: true,
          product: {
            include: {
              productUom: true,
            },
          },
        },
      },
      inventoryReport: {
        include: {
          inventoryReportDetail: true,
        },
      },
    },
  },
};

export const importReceipt: Prisma.ImportReceiptInclude = {
  materialReceipt: {
    include: {
      materialPackage: {
        include: {
          materialVariant: {
            include: {
              material: {
                include: {
                  materialUom: true,
                },
              },
            },
          },
        },
      },
    },
  },

  productReceipt: true,
  inspectionReport: {
    include: {
      inspectionRequest: {
        include: {
          importRequest: {
            include: {
              poDelivery: {
                include: {
                  purchaseOrder: {
                    include: {
                      supplier: true,
                    },
                  },
                },
              },
              warehouseStaff: {
                include: {
                  account: true,
                },
              },
            },
          },
        },
      },
    },
  },
};

export const materialInclude: Prisma.MaterialInclude = {
  materialUom: true,
};

export const materialExportReceiptInclude: Prisma.MaterialExportReceiptInclude =
  {
    warehouseStaff: {
      include: warehouseStaffInclude,
    },
    materialExportReceiptDetail: {
      include: {
        materialReceipt: {
          include: {
            materialPackage: {
              include: materialPackageInclude,
            },
          },
        },
      },
    },
  };

export const taskInclude: Prisma.TaskInclude = {
  warehouseStaff: {
    include: warehouseManagerInclude,
  },
  inspectionRequest: {
    include: inspectionRequestInclude,
  },
  importReceipt: {
    include: importReceiptInclude,
  },
  materialExportReceipt: {
    include: materialExportReceiptInclude,
  },
  inspectionDepartment: {
    include: inspectionDepartmentInclude,
  },
  inventoryReport: {
    include: inventoryReportPlan,
  },
  todo: true,
};

export const materialExportRequestDetailInclude: Prisma.MaterialExportRequestDetailInclude =
  {
    materialVariant: { include: materialVariantInclude },
  };

export const materialExportRequestInclude: Prisma.MaterialExportRequestInclude =
  {
    materialExportRequestDetail: {
      include: materialExportRequestDetailInclude,
    },
    productFormula: {
      include: productFormulaInclude,
    },
    productionBatch: {
      include: productionBatchInclude,
    },
    productionDepartment: {
      include: productionDepartmentInclude,
    },
    warehouseManager: {
      include: warehouseManagerInclude,
    },
    warehouseStaff: {
      include: warehouseStaffInclude,
    },
  };

export const productReceiptIncludeQuery: Prisma.ProductReceiptInclude = {
  importReceipt: { include: importReceiptInclude },
  receiptAdjustment: true,
  productSize: {
    include: productSizeInclude,
  },
};

export const materialReceiptInclude: Prisma.MaterialReceiptInclude = {
  receiptAdjustment: true,
  materialExportReceiptDetail: {
    include: {
      materialExportReceipt: true,
    },
  },
  materialPackage: {
    include: materialPackageInclude,
  },
};
