export interface CurrentMovement {
    id: string;
    currentCode: string;
    dueDate: string;
    description: string;
    debtAmount: string | null;
    creditAmount: string | null;
    balanceAmount: string;
    priceListId: string;
    movementType: string;
    documentType: string;
    documentNo: string;
    companyCode: string;
    branchCode: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string | null;
    updatedBy: string | null;
    current: {
        id: string;
        currentCode: string;
        currentName: string;
        currentType: string;
        institution: string;
        identityNo: string;
        taxNumber: string;
        taxOffice: string;
        title: string;
        name: string;
        surname: string;
        webSite: string;
        birthOfDate: string;
        kepAddress: string;
        mersisNo: string;
        sicilNo: string;
        priceListId: string;
        createdAt: string;
        updatedAt: string;
        createdBy: string | null;
        updatedBy: string | null;
    };
}