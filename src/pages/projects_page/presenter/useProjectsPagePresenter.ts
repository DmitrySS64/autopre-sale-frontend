import { useContextMenu } from "@/widgets/context_menu/use-case";
import { useModal } from "@/widgets/modal/use-case";
import { useState } from "react";

export const useProjectsPagePresenter = () => {
    const [visible, setVisible] = useState<boolean>(false);
    const [modalId, setModalId] = useState<string>('');
    const [projectName, setProjectName] = useState<string>('');
    const [projectDescription, setProjectDescription] = useState<string>('');
    const [editingProject, setEditingProject] = useState<{id: string, name: string, description: string} | null>(null);
    const [editProjectName, setEditProjectName] = useState<string>('');
    const [editProjectDescription, setEditProjectDescription] = useState<string>('');
    const [projectToDelete, setProjectToDelete] = useState<{id: string, name: string} | null>(null);

    const { showModal } = useModal();
    const { showContextMenu } = useContextMenu();

    const handleOpenModal = () => {
        setModalId('create-project-modal');
        setVisible(true);
        setProjectName('');
        setProjectDescription('');
    };

    const handleOpenEditModal = (project: {id: string, name: string, description: string}) => {
        setEditingProject(project);
        setEditProjectName(project.name);
        setEditProjectDescription(project.description);
        setModalId('edit-project-modal');
        setVisible(true);
    };

    const handleOpenDeleteModal = (projectId: string, projectName: string) => {
        setProjectToDelete({ id: projectId, name: projectName });
        setModalId('delete-project-modal');
        setVisible(true);
    };

    const handleCloseModal = (id: string) => {
        setVisible(false);
        setModalId('');
        setEditingProject(null);
        setProjectToDelete(null);
    };

    const handleCreateProject = () => {
        console.log('Создание проекта:', { projectName, projectDescription });
        handleCloseModal(modalId);
    };

    const handleEditProject = () => {
        if (editingProject) {
            console.log('Обновление проекта:', { 
                id: editingProject.id, 
                name: editProjectName, 
                description: editProjectDescription 
            });
            handleCloseModal(modalId);
        }
    };

    const handleDeleteProject = () => {
        if (projectToDelete) {
            console.log('Удаление проекта:', projectToDelete);
            handleCloseModal(modalId);
        }
    };

    const handleCancel = () => {
        handleCloseModal(modalId);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Поиск и фильтрация проектов');
    };

    const showContextMenuHandle = (e: React.MouseEvent, project: {id: string, name: string, description: string}) => {
        showContextMenu({
            items: [
                {
                    id: "edit",
                    label: 'Изменить',
                    onClick: () => handleOpenEditModal(project),
                },
                {
                    id: 'divider',
                    divider: true,
                },
                {
                    id: 'delete',
                    label: "Удалить",
                    onClick: () => handleOpenDeleteModal(project.id, project.name),
                }
            ],
            position: {
                x: e.clientX,
                y: e.clientY
            }
        });
    };

    const isCreateDisabled = !projectName.trim();
    const isEditDisabled = !editProjectName.trim();

    // Пример данных проектов
    const projects = [
        { 
            id: '1', 
            name: 'РусАгро - Видеоаналитика контроля биобезопасности', 
            description: 'Система в режиме реального времени отслеживает соблюдение санитарных норм, выявляет потенциальные угрозы и помогает предотвращать распространение болезней, гарантируя безопасность продукции.' 
        },
        { id: '2', name: 'Проект 2', description: 'Описание проекта 2' },
        { id: '3', name: 'Проект 3', description: 'Описание проекта 3' },
    ];

    return {
        form: {
            projectName,
            setProjectName,
            projectDescription,
            setProjectDescription,
            editProjectName,
            setEditProjectName,
            editProjectDescription,
            setEditProjectDescription,
        },
        state: {
            visible,
            modalId,
            editingProject,
            projectToDelete,
            projects,
            isCreateDisabled,
            isEditDisabled,
        },
        actions: {
            handleOpenModal,
            handleOpenEditModal,
            handleOpenDeleteModal,
            handleCloseModal,
            handleCreateProject,
            handleEditProject,
            handleDeleteProject,
            handleCancel,
            handleSearchSubmit,
            showContextMenuHandle,
        }
    };
};