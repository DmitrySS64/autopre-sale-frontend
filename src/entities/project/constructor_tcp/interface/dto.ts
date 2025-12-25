interface IFieldDto {
    id: string;
    name: string;
    label: string;
    value?: string;
    setValue?: (value: string) => void;
    required?: boolean;
}

interface IPresentationDto {
    id: string;
    projectId: string;
    name: string;
    status: 'Draft' | 'Generated';
    fileUrl?: string;
    createdAt: string;
    updatedAt: string;
    slides?: ISlideDto[];
}

interface ISlideDto {
    id: string;
    presentationId: string;
    orderIndex: number;
    createdAt: string;
    blocks?: IBlockDto[]; // Может быть undefined при создании нового слайда
}

interface IBlockDto {
    id: string;
    slideId: string;
    templateBlockId: string;
    positionIndex?: number; // Может быть undefined
    createdAt: string;
    values?: IBlockValueDto[]; // Может быть пустым массивом или undefined
}

interface IBlockValueDto {
    id: string;
    slideBlockId: string;
    fieldKey: string;
    value: any; // JSON value
    updatedAt: string;
}

interface IGenerateResultDto {
    presentationId: string;
    fileUrl: string;
}

// Интерфейсы для ошибок (опционально)
interface ICreatePresentationError {
    code?: string;
    message?: string;
}

interface IModifySlideError {
    code?: string;
    message?: string;
}

interface IUpdateBlockError {
    code?: string;
    message?: string;
}

interface IGeneratePresentationError {
    code?: string;
    message?: string;
}

export type {
    IFieldDto,
    IPresentationDto,
    ISlideDto,
    IBlockDto,
    IBlockValueDto,
    IGenerateResultDto,
    ICreatePresentationError,
    IModifySlideError,
    IUpdateBlockError,
    IGeneratePresentationError
}