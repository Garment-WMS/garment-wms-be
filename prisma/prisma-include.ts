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

export const inspectionReportDetailDefectIncludeWithoutInspectionReportDetail: Prisma.InspectionReportDetailDefectInclude =
  {
    defect: true,
  };

export const inspectionReportDetailWithoutInspectionReportInclude: Prisma.InspectionReportDetailInclude =
  {
    materialPackage: {
      include: materialPackageInclude,
    },
    productSize: { include: productSizeInclude },
    inspectionReportDetailDefect: {
      include: inspectionReportDetailDefectIncludeWithoutInspectionReportDetail,
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
    where: {
      quantityByPack: {
        not: {
          equals: 0,
        },
      },
    },
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
      inspectionReport: {
        include: {
          importReceipt: {
            include: {
              productReceipt: true,
              materialReceipt: true,
            },
          },
          inspectionReportDetail: {
            include: {
              materialPackage: {
                include: materialPackageInclude,
              },
              productSize: { include: productSizeInclude },
              inspectionReportDetailDefect: {
                include: {
                  defect: true,
                },
              },
            },
          },
        },
      },
      inspectionDepartment: { include: inspectionDepartmentInclude },
    },
  },
};

export const importRequestIncludeUnique: Prisma.ImportRequestInclude = {
  ...importRequestInclude,
  inspectionRequest: {
    include: {
      inspectionDepartment: { include: inspectionDepartmentInclude },
      inspectionReport: {
        include: {
          inspectionReportDetail: {
            include: {
              materialPackage: {
                include: materialPackageInclude,
              },
              productSize: { include: productSizeInclude },
              inspectionReportDetailDefect: {
                include: {
                  defect: true,
                },
              },
            },
          },
        },
      },
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
  importReceipt: {
    include: {
      materialReceipt: true,
      productReceipt: true,
    },
  },
};

export const inspectionRequestInclude: Prisma.InspectionRequestInclude = {
  importRequest: {
    include: {
      importRequestDetail: {
        include: importRequestDetailInclude,
        where: {
          quantityByPack: {
            not: {
              equals: 0,
            },
          },
        },
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
    include: {
      inspectionReportDetail: {
        include: inspectionReportDetailWithoutInspectionReportInclude,
      },
    },
  },
};

export const productionBatchInclude: Prisma.ProductionBatchInclude = {
  importRequest: {
    include: importRequestInclude,
  },
  materialExportRequest: {
    include: {
      materialExportReceipt: {
        include: {
          materialExportReceiptDetail: {
            include: {
              materialReceipt: {
                include: {
                  materialPackage: true,
                },
              },
            },
          },
        },
      },
    },
  },
  productionBatchMaterialVariant: {
    include: {
      materialVariant: {
        include: materialVariantInclude,
      },
    },
  },
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
      inspectionReportDetail: {
        include: inspectionReportDetailWithoutInspectionReportInclude,
      },
    },
  },
};

export const materialInclude: Prisma.MaterialInclude = {
  materialUom: true,
};
export const materialExportRequestDetailInclude: Prisma.MaterialExportRequestDetailInclude =
  {
    materialVariant: { include: materialVariantInclude },
  };

export const materialExportRequestInclude: Prisma.MaterialExportRequestInclude =
  {
    discussion: {
      include: discussionInclude,
    },
    materialExportRequestDetail: {
      include: materialExportRequestDetailInclude,
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

export const materialExportReceiptInclude: Prisma.MaterialExportReceiptInclude =
  {
    discussion: { include: discussionInclude },
    warehouseStaff: {
      include: warehouseStaffInclude,
    },
    materialExportRequest: {
      include: materialExportRequestInclude,
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

export const materialReceiptIncludeWithoutImportExportReceipt: Prisma.MaterialReceiptInclude =
  {
    receiptAdjustment: true,
    materialPackage: {
      include: materialPackageInclude,
    },
  };

export const productReceiptIncludeWithoutImportExportReceipt: Prisma.ProductReceiptInclude =
  {
    receiptAdjustment: true,
    productSize: {
      include: productSizeInclude,
    },
  };

export const importReceiptInclude: Prisma.ImportReceiptInclude = {
  warehouseManager: {
    include: warehouseManagerInclude,
  },
  warehouseStaff: {
    include: warehouseManagerInclude,
  },
  materialReceipt: {
    include: materialReceiptIncludeWithoutImportExportReceipt,
  },
  productReceipt: {
    include: productReceiptIncludeWithoutImportExportReceipt,
  },
  inspectionReport: {
    include: inspectionReportInclude,
  },
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
  importRequest: {
    include: importRequestInclude,
  },

  // todo: true,
};

export const productReceiptIncludeQuery: Prisma.ProductReceiptInclude = {
  importReceipt: { include: importReceiptInclude },
  receiptAdjustment: true,
  productSize: {
    include: productSizeInclude,
  },
};
export const productReceiptIncludeQueryWithoutReceipt: Prisma.ProductReceiptInclude =
  {
    receiptAdjustment: true,
    productSize: {
      include: productSizeInclude,
    },
  };

export const materialReceiptIncludeWithoutImportReceipt: Prisma.MaterialReceiptInclude =
  {
    receiptAdjustment: true,
    importReceipt: {
      include: importReceiptInclude,
    },
    materialExportReceiptDetail: {
      include: {
        materialExportReceipt: true,
      },
    },
    materialPackage: {
      include: materialPackageInclude,
    },
  };

export const materialReceiptIncludeWithoutImportReceipt2: Prisma.MaterialReceiptInclude =
  {
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
