import type {ITemplateDto} from "@entities/block_template/interface/index.dto.ts";

export const STUB_TEMPLATES: ITemplateDto[] = [
    {
        id: "1",
        code: "project_overview_v1",
        name: "Описание проекта",
        description: "Блок описания проекта с заголовком и описанием",
        category: "overview",
        pptxFileUrl: "/api/templates/files/project_overview_v1.pptx",
        previewUrl: "/api/templates/previews/project_overview_v1.png",
        fields: [
            { key: "title", type: "text", required: true, placeholder: "{{ text.title }}", orderIndex: 0, metadata: {} },
            { key: "description", type: "text", required: false, placeholder: "{{ text.description }}", orderIndex: 1, metadata: {} }
        ],
        createdAt: "2024-01-01T10:00:00Z",
        updatedAt: "2024-01-01T10:00:00Z"
    },
    {
        id: "2",
        code: "project_goals_v1",
        name: "Цели проекта",
        description: "Блок с целями проекта",
        category: "overview",
        pptxFileUrl: "/api/templates/files/project_goals_v1.pptx",
        previewUrl: "/api/templates/previews/project_goals_v1.png",
        fields: [
            { key: "title", type: "text", required: true, placeholder: "{{ text.title }}", orderIndex: 0, metadata: {} },
            { key: "goals", type: "list", required: false, placeholder: "{{ list.goals }}", orderIndex: 1, metadata: {} }
        ],
        createdAt: "2024-01-01T11:00:00Z",
        updatedAt: "2024-01-01T11:00:00Z"
    },
    {
        id: "3",
        code: "technical_solution_v1",
        name: "Техническое решение",
        description: "Блок описания технического решения",
        category: "technical",
        pptxFileUrl: "/api/templates/files/technical_solution_v1.pptx",
        previewUrl: "/api/templates/previews/technical_solution_v1.png",
        fields: [
            { key: "title", type: "text", required: true, placeholder: "{{ text.title }}", orderIndex: 0, metadata: {} },
            { key: "architecture", type: "text", required: false, placeholder: "{{ text.architecture }}", orderIndex: 1, metadata: {} },
            { key: "technologies", type: "list", required: false, placeholder: "{{ list.technologies }}", orderIndex: 2, metadata: {} },
            { key: "requirements", type: "text", required: false, placeholder: "{{ text.requirements }}", orderIndex: 3, metadata: {} }
        ],
        createdAt: "2024-01-01T12:00:00Z",
        updatedAt: "2024-01-01T12:00:00Z"
    },
    {
        id: "4",
        code: "timeline_v1",
        name: "План работ",
        description: "Блок с планом работ и сроками",
        category: "roadmap",
        pptxFileUrl: "/api/templates/files/timeline_v1.pptx",
        previewUrl: "/api/templates/previews/timeline_v1.png",
        fields: [
            { key: "title", type: "text", required: true, placeholder: "{{ text.title }}", orderIndex: 0, metadata: {} },
            { key: "phases", type: "list", required: false, placeholder: "{{ list.phases }}", orderIndex: 1, metadata: {} },
            { key: "deadline", type: "text", required: false, placeholder: "{{ text.deadline }}", orderIndex: 2, metadata: {} }
        ],
        createdAt: "2024-01-01T13:00:00Z",
        updatedAt: "2024-01-01T13:00:00Z"
    },
    {
        id: "5",
        code: "budget_v1",
        name: "Бюджет",
        description: "Блок с бюджетом проекта",
        category: "financial",
        pptxFileUrl: "/api/templates/files/budget_v1.pptx",
        previewUrl: "/api/templates/previews/budget_v1.png",
        fields: [
            { key: "title", type: "text", required: true, placeholder: "{{ text.title }}", orderIndex: 0, metadata: {} },
            { key: "total", type: "number", required: false, placeholder: "{{ number.total }}", orderIndex: 1, metadata: {} },
            { key: "breakdown", type: "text", required: false, placeholder: "{{ text.breakdown }}", orderIndex: 2, metadata: {} }
        ],
        createdAt: "2024-01-01T14:00:00Z",
        updatedAt: "2024-01-01T14:00:00Z"
    }
];