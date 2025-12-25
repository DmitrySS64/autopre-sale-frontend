interface ICreateTemplatePort {
    file: File;
    name: string;
    code: string;
    description?: string;
    category?: string;
}

interface IGetTemplateByIdPort {
    id: string;
}

export type {
    ICreateTemplatePort,
    IGetTemplateByIdPort,
}