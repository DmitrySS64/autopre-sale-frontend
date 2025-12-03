import type {EProjectStatus} from "@shared/enum/project";

interface ProjectDto {
    id: string;
    name: string;
    clientName: string;
    status: EProjectStatus;
    description?: string;
    documents?: ProjectDocumentDto[]
    createdAt: string;
    updatedAt: string;
}

interface ProjectDocumentDto {
    id: string;
    fileName: string;
    fileUrl: string;
    uploadedAt: string;
    processed: boolean;
}

export type {
    ProjectDto,
    ProjectDocumentDto
}