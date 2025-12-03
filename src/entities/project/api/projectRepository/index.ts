import {BaseRepository} from "@shared/api/http/BaseRepository.ts";
import type {IProjectRepository} from "@entities/project/interface/repositiry";
import type {ProjectDocumentDto, ProjectDto} from "../../interface/dto";
import type {CreateProjectPort, EditProjectPort} from "../../interface/port";
import {EProjectStatus} from "@shared/enum/project";

const isStub = true;

function getStubProject(id: string, name?: string): ProjectDto {
    return {
        id,
        name: `Проект ${name || id}`,
        clientName: `Клиент ${id}`,
        status: EProjectStatus.Active,
        description: `Описание проекта ${name || id}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
}

class ProjectRepository extends BaseRepository implements IProjectRepository {
    public async getProjectById(projectId: string): Promise<ProjectDto> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 500));

            const stubProject = getStubProject(projectId);
            return Promise.resolve(stubProject);
        }
        return await this._httpService.get<ProjectDto>(`/api/Projects/${projectId}`)
    }
    public async getProjects(): Promise<ProjectDto[]> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const stubProjects: ProjectDto[] = [
                getStubProject('1'),
                getStubProject('2'),
            ];
            return Promise.resolve(stubProjects);
        }

        return await this._httpService.get<ProjectDto[]>('/api/Projects');
    }
    public async createProject(request: CreateProjectPort): Promise<ProjectDto> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const stubProject: ProjectDto = {
                id: '1',
                name: request.name,
                clientName: request.clientName,
                status: request.status || EProjectStatus.Draft,
                description: request.description,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            return Promise.resolve(stubProject);
        }

        return await this._httpService.post<ProjectDto>('/api/Projects', {
            body: request,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
    public async editProject(project: EditProjectPort): Promise<void> {
        console.log(project);
        throw new Error("Method not implemented.");
    }
    public async deleteProject(projectId: string): Promise<void> {
        console.log(projectId);
        throw new Error("Method not implemented.");
    }
    public async uploadProjectDocument(projectId: string, file: File): Promise<ProjectDocumentDto> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const stubDocument: ProjectDocumentDto = {
                id: 'doc-1',
                fileName: file.name,
                fileUrl: `/api/files/${file.name}`,
                uploadedAt: new Date().toISOString(),
                processed: true
            };

            return Promise.resolve(stubDocument);
        }

        const formData = new FormData();
        formData.append('file', file);

        return await this._httpService.post<ProjectDocumentDto>(
            `/api/Projects/${projectId}/documents`,
            {
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
    }
}

export {ProjectRepository}