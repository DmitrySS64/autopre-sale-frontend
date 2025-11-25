import type {
    IAnalysisTZResponse,
    ISaveBacklogResponse,
    IUploadFileResponse
} from "@entities/project/analysis_tz/interface";
import {BaseRepository} from "@shared/api/http/BaseRepository.ts";
import type {
    IAnalysisTZRepository,
    IDownloadBacklogPort,
    ISaveBacklogPort,
    IUploadFilePort
} from "@entities/project/analysis_tz/interface";

const isStub = true

const stubBacklogData: IAnalysisTZResponse = {
    projectId: "1",
    projectName: "Тестовый проект",
    fileName: "technical_specification.docx",
    fileUrl: "/api/files/technical_specification.docx",
    backlogData: [
        {
            workNumber: '1',
            level: '1',
            rowValues: [
                {value: "Значение 1"},
                {value: "Значение 2"},
            ],
            children: [
                {
                    workNumber: '1.1',
                    level: '2',
                    rowValues: [
                        {value: "Дочернее значение 1"},
                        {value: "Дочернее значение 2"},
                    ]
                }
            ]
        }
    ]
}

// Заглушка для проекта без анализа
const stubProjectWithoutAnalysis: IAnalysisTZResponse = {
    projectId: "2",
    projectName: "Проект без ТЗ",
    // fileName и fileUrl отсутствуют
    // backlogData отсутствует
}

class AnalysisRepository extends BaseRepository implements IAnalysisTZRepository {
    public async getBacklogData(projectId: string): Promise<IAnalysisTZResponse> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 500)); // Имитация задержки сети

            if (projectId === "1") {
                return Promise.resolve(stubBacklogData);
            } else if (projectId === "2") {
                return Promise.resolve(stubProjectWithoutAnalysis);
            } else {
                // Проект без ТЗ и бэклога
                return Promise.resolve({
                    projectId,
                    projectName: `Проект ${projectId}`,
                    // fileName, fileUrl, backlogData отсутствуют
                });
            }
        }

        return await this._httpService.get<IAnalysisTZResponse>(`/api/projects/${projectId}/analysis`);
    }

    public async uploadTZFile(port: IUploadFilePort): Promise<IUploadFileResponse> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Имитация загрузки файла

            const mockResponse: IUploadFileResponse = {
                success: true,
                fileName: port.file.name,
                fileUrl: `/api/files/${port.file.name}`,
                backlogData: [
                    {
                        workNumber: '1',
                        level: '1',
                        rowValues: [
                            {value: "Новое значение 1"},
                            {value: "Новое значение 2"},
                        ]
                    }
                ]
            };

            return Promise.resolve(mockResponse);
        }

        const formData = new FormData();
        formData.append('file', port.file);
        formData.append('projectId', port.projectId);

        return await this._httpService.post<IUploadFileResponse>('/api/upload-tz', {
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    }

    public async saveBacklog(port: ISaveBacklogPort): Promise<ISaveBacklogResponse> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация сохранения

            const mockResponse: ISaveBacklogResponse = {
                status: "OK",
                message: "Данные успешно сохранены",
                timestamp: new Date().toISOString()
            };

            return Promise.resolve(mockResponse);
        }

        return await this._httpService.post<ISaveBacklogResponse>('/api/save-backlog', {
            body: port,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    public async downloadBacklog(port: IDownloadBacklogPort): Promise<Blob> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 500));
            // Возвращаем пустой blob для заглушки
            return new Blob();
        }

        return await this._httpService.post<Blob>(`/api/download-backlog/${port.format}`, {
            body: { projectId: port.projectId },
            responseType: 'blob'
        });
    }
}

export {AnalysisRepository}