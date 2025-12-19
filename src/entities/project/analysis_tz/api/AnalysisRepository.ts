import {
    EExportType,
    type IAnalysisTZResponse,
    type ISaveBacklogResponse, type IWorkDto
} from "@entities/project/analysis_tz/interface";
import {BaseRepository} from "@shared/api/http/BaseRepository.ts";
import type {
    IAnalysisTZRepository,
    IDownloadBacklogPort,
    ISaveBacklogPort,
} from "@entities/project/analysis_tz/interface";
import {IS_STUB as isStub, DEFAULT_URL} from "@shared/api/const";
import {tableRowDtosToWorkDtos, workDtosToTableRowDtos} from "@entities/project/analysis_tz/utils/converter.ts";
import type {IProjectDto} from "@entities/project/interface/dto";
import {CookieService} from "@shared/services/cookie/CookieService.ts";
import {ECookieKey} from "@shared/services/cookie/ECookieKey.ts";

const stubWorks: IWorkDto[] = [
    {
        id: "1",
        workNumber: "1",
        level: 1,
        workType: "Разработка",
        acceptanceCriteria: "Функциональность должна соответствовать требованиям",
        childWorks: [
            {
                id: "1.1",
                workNumber: "1.1",
                level: 2,
                workType: "Бэкенд",
                acceptanceCriteria: "API должно работать корректно",
                childWorks: []
            },
            {
                id: "1.2",
                workNumber: "1.2",
                level: 2,
                workType: "Фронтенд",
                acceptanceCriteria: "Интерфейс должен быть удобным",
                childWorks: []
            }
        ]
    }
]


class AnalysisRepository extends BaseRepository implements IAnalysisTZRepository {
    public async getBacklogData(projectId: string): Promise<IAnalysisTZResponse> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 500));

            const backlogData = stubWorks;
            const tableRowDtos = workDtosToTableRowDtos(backlogData);

            if (projectId == '2') {
                return {
                    projectId,
                    projectName: `Проект ${projectId}`,
                };
            }

            return {
                projectId,
                projectName: `Проект ${projectId}`,
                fileName: "technical_specification.docx",
                fileUrl: `/api/files/technical_specification.docx`,
                backlogData: tableRowDtos
            };
        }
        try {
            // Запрос к Backlog API
            const works = await this._httpService.get<IWorkDto[]>(
                `/api/backlog-service/Backlog/${projectId}`
            );

            const tableRowDtos = workDtosToTableRowDtos(works);

            // Здесь нужно также получить информацию о файле ТЗ
            // Предполагаем, что есть отдельный эндпоинт для этого
            const documentInfo = await this.getDocumentInfo(projectId);

            return {
                projectId,
                projectName: documentInfo.projectName || `Проект ${projectId}`,
                fileName: documentInfo.fileName,
                fileUrl: documentInfo.fileUrl,
                backlogData: tableRowDtos.length > 0 ? tableRowDtos : undefined
            };
        } catch (error) {
            console.error('Error fetching backlog:', error);

            // Если бэклога нет (404 или другая ошибка), возвращаем только информацию о проекте
            try {
                const documentInfo = await this.getDocumentInfo(projectId);

                return {
                    projectId,
                    projectName: documentInfo.projectName || `Проект ${projectId}`,
                    fileName: documentInfo.fileName,
                    fileUrl: documentInfo.fileUrl
                    // backlogData будет undefined
                };
            } catch {
                // Если не удалось получить информацию о проекте
                return {
                    projectId,
                    projectName: `Проект ${projectId}`,
                    // fileName и fileUrl будут undefined
                };
            }
        }

        //return await this._httpService.get<IAnalysisTZResponse>(`/api/projects/${projectId}/analysis`);
    }


    // Сохранение бэклога
    public async saveBacklog(port: ISaveBacklogPort): Promise<ISaveBacklogResponse> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            return {
                status: "OK",
                message: "Данные успешно сохранены",
                timestamp: new Date().toISOString()
            };
        }

        try {
            // Конвертируем клиентские DTO в API DTO
            const workDtos = tableRowDtosToWorkDtos(port.backlogData);

            // Отправляем на сервер
            await this._httpService.put(
                `/api/backlog-service/Backlog/${port.projectId}`,
                {
                    body: workDtos,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            return {
                status: "OK",
                message: "Данные успешно сохранены",
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error saving backlog:', error);
            return {
                status: "ERROR",
                message: error instanceof Error ? error.message : 'Ошибка сохранения',
                timestamp: new Date().toISOString()
            };
        }
    }

    // Экспорт бэклога
    public async downloadBacklog(port: IDownloadBacklogPort): Promise<Blob> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 500));
            // Возвращаем пустой blob для заглушки
            return new Blob(['Заглушка экспорта'], { type: 'text/plain' });
        }

        try {
            const exportType: EExportType = port.format === 'csv' ? EExportType.Csv : EExportType.Xlsx;
            const cookieService = new CookieService();
            
            let accessToken: string = '';
            try {
                accessToken = cookieService.get(ECookieKey.ACCESS_TOKEN);
            } catch (error) {
                console.error('Failed to get access token from cookies:', error);
                throw new Error('Токен авторизации не найден. Пожалуйста, войдите в систему заново.');
            }

            if (!accessToken) {
                throw new Error('Токен авторизации пустой. Пожалуйста, войдите в систему заново.');
            }
            
            const url = new URL(`/api/backlog-service/Backlog/${port.projectId}/export`, DEFAULT_URL);
            url.searchParams.append('type', exportType);

            const headers: HeadersInit = {
                'Authorization': `Bearer ${accessToken}`
            };

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers,
                credentials: 'include'
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Export response error:', response.status, errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            return await response.blob();
        } catch (error) {
            console.error('Error exporting backlog:', error);
            throw new Error(`Ошибка экспорта: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
        }
    }

    private async getDocumentInfo(projectId: string): Promise<{
        projectName: string;
        fileName?: string;
        fileUrl?: string;
    }> {
        if (isStub) {
            return {
                projectName: `Проект ${projectId}`,
                fileName: "technical_specification.docx",
                fileUrl: `/api/files/technical_specification.docx`
            };
        }

        // Получаем информацию о проекте, который уже содержит документ
        try {
            const project = await this._httpService.get<IProjectDto>(`/api/project-service/Projects/${projectId}`);

            // Backend возвращает документ в поле Document (единственный документ)
            // Поддерживаем оба варианта для обратной совместимости
            const document = project.document || project.documents?.[0];

            return {
                projectName: project.name,
                fileName: document?.fileName,
                fileUrl: document?.fileUrl
            };
        } catch {
            // Если не удалось получить проект
            return {
                projectName: `Проект ${projectId}`
            };
        }
    }
}

export {AnalysisRepository}