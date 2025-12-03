import {AnalysisRepository} from "@entities/project/analysis_tz/api/AnalysisRepository.ts";
import {HTTP_APP_SERVICE} from "@shared/services/http/HttpAppService.ts";
import {useMutation} from "@tanstack/react-query";
import type {
    IDownloadBacklogPort,
    ISaveBacklogPort,
    ISaveBacklogResponse,
    IUploadFilePort,
    IUploadFileResponse
} from "@entities/project/analysis_tz/interface";


const repository = new AnalysisRepository(HTTP_APP_SERVICE);

// Мутация для загрузки файла ТЗ
function useUploadTZMutation() {
    return useMutation<IUploadFileResponse, Error, IUploadFilePort>({
        mutationFn: (port: IUploadFilePort) => repository.uploadTZFile(port),
        onError: (error) => {
            console.error('Error uploading TZ file:', error);
        },
    });
}

// Мутация для сохранения бэклога
function useSaveBacklogMutation() {
    return useMutation<ISaveBacklogResponse, Error, ISaveBacklogPort>({
        mutationFn: (port: ISaveBacklogPort) => repository.saveBacklog(port),
        onError: (error) => {
            console.error('Error saving backlog:', error);
        },
    });
}

// Мутация для скачивания бэклога
function useDownloadBacklogMutation() {
    return useMutation<Blob, Error, IDownloadBacklogPort>({
        mutationFn: (port: IDownloadBacklogPort) => repository.downloadBacklog(port),
        onError: (error) => {
            console.error('Error downloading backlog:', error);
        },
    });
}

// Общий хук для всех мутаций
function useAnalysisPageMutation() {
    const uploadMutation = useUploadTZMutation();
    const saveMutation = useSaveBacklogMutation();
    const downloadMutation = useDownloadBacklogMutation();

    return {
        uploadTZ: uploadMutation.mutateAsync,
        uploadTZStatus: uploadMutation,
        saveBacklog: saveMutation.mutateAsync,
        saveBacklogStatus: saveMutation,
        downloadBacklog: downloadMutation.mutateAsync,
        downloadBacklogStatus: downloadMutation,
    };
}

export { useAnalysisPageMutation };