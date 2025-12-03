import type {EProjectStatus} from "@shared/enum/project";

interface CreateProjectPort {
    name: string;
    clientName: string;
    status?: EProjectStatus;
    description?: string;
}

interface EditProjectPort {
    id: string;
    name: string;
    clientName: string;
    status?: EProjectStatus;
    description?: string;
}

export type {
    CreateProjectPort,
    EditProjectPort
}