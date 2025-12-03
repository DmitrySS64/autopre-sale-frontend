// entities/project/api/request/useProjectRequests.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectRepository } from "../projectRepository";
import { HTTP_APP_SERVICE } from "@shared/services/http/HttpAppService";
import { EQueryKeys } from "@shared/enum/query";
import type { ProjectDto, ProjectDocumentDto } from "../../interface/dto";
import type { CreateProjectPort } from "../../interface/port";

const repository = new ProjectRepository(HTTP_APP_SERVICE);

// Хук для получения всех проектов
const useProjectsQuery = () => {
    return useQuery<ProjectDto[], Error>({
        queryKey: [EQueryKeys.PROJECTS],
        queryFn: () => repository.getProjects(),
        staleTime: 5 * 60 * 1000, // 5 минут
    });
};

// Хук для получения проекта по ID
const useProjectQuery = (projectId: string) => {
    return useQuery<ProjectDto, Error>({
        queryKey: [EQueryKeys.PROJECTS, projectId],
        queryFn: () => repository.getProjectById(projectId),
        enabled: !!projectId,
        staleTime: 5 * 60 * 1000,
    });
};

// Хук для создания проекта
const useCreateProjectMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<ProjectDto, Error, CreateProjectPort>({
        mutationFn: (request) => repository.createProject(request),
        onSuccess: () => {
            // Инвалидируем кэш проектов
            queryClient.invalidateQueries({ queryKey: [EQueryKeys.PROJECTS] });
        },
    });
};

// Хук для загрузки документа проекта
const useUploadProjectDocumentMutation = () => {
    return useMutation<ProjectDocumentDto, Error, { projectId: string; file: File }>({
        mutationFn: ({ projectId, file }) => repository.uploadProjectDocument(projectId, file),
    });
};

export {
    useProjectsQuery,
    useProjectQuery,
    useCreateProjectMutation,
    useUploadProjectDocumentMutation
}