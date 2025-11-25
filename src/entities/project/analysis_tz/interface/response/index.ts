import type {ITableRowPropsDto} from "@entities/project/analysis_tz/interface/dto";

interface IAnalysisTZResponse {
    projectId: string;
    projectName: string;
    fileName?: string;
    fileUrl?: string;
    backlogData?: ITableRowPropsDto[]; // Может отсутствовать
}

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

export type {
    IAnalysisTZResponse,
    ISaveBacklogResponse,
    IUploadFileResponse
}