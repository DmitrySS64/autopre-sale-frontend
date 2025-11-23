interface ITableFieldPropsDto {
    value: string;
}

interface ITableRowPropsDto  {
    workNumber: string;
    level?: '1' | '2' | '3';
    rowValues?: ITableFieldPropsDto[];
    children?: ITableRowPropsDto[] | undefined;
}

interface IBacklogDTO {
    fileName?: string;
    fileUrl?: string;
    backlogData: ITableRowPropsDto[];
}

interface ISaveResponseDTO {
    status: "OK" | "ERROR";
    message?: string;
}

interface IUploadResponseDTO {
    success: boolean;
    data?: IBacklogDTO;
    error?: string;
}

export type {IBacklogDTO, ISaveResponseDTO, IUploadResponseDTO, ITableRowPropsDto, ITableFieldPropsDto}