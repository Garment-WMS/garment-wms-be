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

export const importRequestDetailInclude: Prisma.ImportRequestDetailInclude = {
  materialPackage: {
    include: {
      materialVariant: {
        include: {
          material: {
            include: {
              materialUom: true,
            },
          },
          materialAttribute: true,
          materialInspectionCriteria: true,
        },
      },
    },
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

export const importRequestInclude: Prisma.ImportRequestInclude = {
  importRequestDetail: {
    include: importRequestDetailInclude,
  },
  warehouseManager: {
    include: {
      account: true,
    },
  },
  purchasingStaff: {
    include: {
      account: true,
    },
  },
  warehouseStaff: {
    include: {
      account: true,
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
  productionPlanDetail: true,
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
          inventoryStock: true,
        },
      },
      productSize: {
        include: {
          productVariant: true,
          inventoryStock: true,
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
