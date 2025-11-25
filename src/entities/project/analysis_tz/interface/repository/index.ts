import type {
    IAnalysisTZResponse,
    IDownloadBacklogPort, ISaveBacklogPort,
    ISaveBacklogResponse, IUploadFilePort,
    IUploadFileResponse
} from "@entities/project/analysis_tz/interface";

export interface IAnalysisTZRepository {
    getBacklogData(projectId: string): Promise<IAnalysisTZResponse>,
    uploadTZFile(port: IUploadFilePort): Promise<IUploadFileResponse>,
    saveBacklog(port: ISaveBacklogPort): Promise<ISaveBacklogResponse>,
    downloadBacklog(port: IDownloadBacklogPort): Promise<Blob>
}
