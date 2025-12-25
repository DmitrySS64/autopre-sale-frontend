interface ICreatePresentationPort {
    projectId: string;
    name: string;
}

interface ICreateSlidePort {
    // No additional parameters needed for backend
}

interface IModifySlidePort {
    addBlocks?: Array<{
        templateBlockId: string;
    }>;
    removeBlocks?: string[]; // Array of block IDs to remove
}

interface IUpdateBlockPort {
    values: Record<string, any>; // Map of fieldKey to value
}

export type {
    ICreatePresentationPort,
    IModifySlidePort,
    IUpdateBlockPort,
    ICreateSlidePort
}
