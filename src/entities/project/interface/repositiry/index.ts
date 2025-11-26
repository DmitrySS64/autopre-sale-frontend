import type {CreateProjectPort, EditProjectPort} from "@entities/project/interface/port";
import type {ProjectDocumentDto, ProjectDto} from "@entities/project/interface/dto";

export interface IProjectRepository {
    getProjectById(projectId: string): Promise<ProjectDto>,
    getProjects(): Promise<ProjectDto[]>,
    createProject(request: CreateProjectPort): Promise<ProjectDto>,
    editProject(project: EditProjectPort): Promise<void>,
    deleteProject(projectId: string): Promise<void>,
    uploadProjectDocument(projectId: string, file: File): Promise<ProjectDocumentDto>,
}
