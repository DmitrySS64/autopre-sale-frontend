import type {ITableRowPropsDto} from "@entities/project/analysis_tz/interface/dto";

interface ISaveBacklogResponse {
    status: "OK" | "ERROR";
    message?: string;
    timestamp: string;
}

interface IUploadFileResponse {
    success: boolean;
    fileName?: string;
    fileUrl?: string;
    backlogData?: ITableRowPropsDto[];
    error?: string;
}

export type {ISaveBacklogResponse, IUploadFileResponse}