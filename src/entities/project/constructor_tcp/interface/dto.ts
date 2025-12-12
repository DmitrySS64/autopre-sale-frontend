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
    name: string;
    createdAt: string;
}

interface ISlideDto {
    id: string;
    presentationId: string;
    order: number;
    blocks: IBlockDto[];
}

interface IBlockDto {
    id: string;
    slideId: string;
    type: string;
    key: string;
    value: Record<string, unknown>;
    position: { x: number; y: number };
    size: { w: number; h: number };
}

interface IGenerateResultDto {
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
    IGenerateResultDto,
    ICreatePresentationError,
    IModifySlideError,
    IUpdateBlockError,
    IGeneratePresentationError
}