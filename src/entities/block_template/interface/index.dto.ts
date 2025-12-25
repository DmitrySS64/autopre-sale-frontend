interface ITemplateField {
    key: string;
    type: string;
    required: boolean;
    placeholder: string;
    orderIndex: number;
    metadata: Record<string, any>;
}

interface ITemplateFields {
    [key: string]: ITemplateField;
}

interface ITemplateDto {
    id: string;
    code: string;
    name: string;
    description?: string;
    category?: string;
    pptxFileUrl: string;
    previewUrl?: string;
    fields: ITemplateField[];
    createdAt: string;
    updatedAt: string;
}

export type {
    ITemplateField,
    ITemplateFields,
    ITemplateDto
}