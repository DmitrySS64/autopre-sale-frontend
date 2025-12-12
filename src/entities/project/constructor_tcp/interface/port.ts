interface ICreatePresentationPort {
    name: string;
    description?: string;
}

interface ICreateSlidePort {
    slideId?: string;
}

interface IModifySlidePort {
    action: 'add_block' | 'remove_block' | 'add_block_from_template';
    block?: {
        type: string;
        key: string;
        value?: Record<string, unknown>;
        position: { x: number; y: number };
        size: { w: number; h: number };
    };
    blockId?: string;
    templateBlockId?: string;
}

interface IUpdateBlockPort {
    value?: Record<string, unknown>;
    position?: { x: number; y: number };
    size?: { w: number; h: number };
}

export type {
    ICreatePresentationPort,
    IModifySlidePort,
    IUpdateBlockPort,
    ICreateSlidePort
}
