import { Button } from "@/shared/components/form/button";
import { Input } from "@/shared/components/form/input";
import { Modal } from "@/shared/components/modal/component";
import { ProjectItem } from "@/shared/components/projects/project_item";
import { useSidebarLayout } from "@widgets/sidebar/case/context";
import { useEffect, useState } from "react";

const ProjectsPage = () => {
    const { setTitle } = useSidebarLayout()
    const [visible, setVisible] = useState<boolean>(false);
    const [modalId, setModalId] = useState<string>('');
    
    // Состояния для формы создания
    const [projectName, setProjectName] = useState<string>('');
    const [projectDescription, setProjectDescription] = useState<string>('');

    // Состояния для формы редактирования
    const [editingProject, setEditingProject] = useState<{id: string, name: string, description: string} | null>(null);
    const [editProjectName, setEditProjectName] = useState<string>('');
    const [editProjectDescription, setEditProjectDescription] = useState<string>('');

    // Состояния для удаления проекта
    const [projectToDelete, setProjectToDelete] = useState<{id: string, name: string} | null>(null);

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
        // Логика создания проекта
        handleCloseModal(modalId);
    };

    const handleEditProject = () => {
        if (editingProject) {
            // Логика обновления проекта

            handleCloseModal(modalId);
        }
    };

    const handleDeleteProject = () => {
        if (projectToDelete) {
            // Логика удаления проекта
            handleCloseModal(modalId);
        }
    };

    const handleCancel = () => {
        handleCloseModal(modalId);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Логика обработки поиска и фильтрации
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

    useEffect(() => {
        setTitle("Проекты")
    }, [setTitle])

    return (
        <div>
            <header className="flex justify-between w-full content-center items-center">
                <form onSubmit={handleSearchSubmit} className="flex gap-[50px]">
                    <Input 
                        type="search" 
                        className="w-[400px] h-11 !rounded-4xl" 
                        placeholder="Поиск" 
                        name="search"
                    />
                    <select 
                        name="sort"
                        className="
                            h-11 
                            px-4 py-2 pr-10 
                            bg-white 
                            border border-gray-300 
                            rounded-lg 
                            text-gray-900 text-sm font-normal
                            appearance-none 
                            cursor-pointer
                            hover:border-gray-400 
                            focus:outline-none focus:ring-2 focus:ring-[#FFE7DB] focus:border-transparent
                            transition-all duration-200
                        "
                    >
                        <option value="recent">Созданы недавно</option>
                        <option value="newest">Сначала новые</option>
                        <option value="oldest">Сначала старые</option>
                        <option value="name">По названию</option>
                    </select>
                    <button type="submit" className="sr-only">Применить фильтры</button>
                </form>
                
                <Button 
                    onClick={handleOpenModal}
                    type="button" 
                    className="w-[200px] flex justify-between content-center gap-5"
                >
                    <span>Добавить</span>
                </Button>
            </header>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                    <ProjectItem
                        key={project.id}
                        project={project}
                        onEdit={handleOpenEditModal}
                        onDelete={handleOpenDeleteModal}
                    />
                ))}
            </div>

            {visible && modalId === 'create-project-modal' && (
                <Modal 
                    title="Создание проекта" 
                    onClose={handleCloseModal} 
                    id={modalId}
                >
                    <div className="flex flex-col gap-6 p-1">
                        <div className="flex flex-col gap-2">
                            <Input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="Название"
                                className="w-full h-11"
                                autoFocus
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <textarea
                                value={projectDescription}
                                onChange={(e) => setProjectDescription(e.target.value)}
                                placeholder="Описание"
                                className="
                                    w-full 
                                    min-h-[100px] 
                                    px-3 py-2 
                                    border border-gray-300 
                                    rounded-lg 
                                    text-gray-900 
                                    text-sm 
                                    resize-vertical
                                    focus:outline-none focus:ring-2 focus:ring-[#FFE7DB] focus:border-transparent
                                    transition-all duration-200
                                "
                            />
                        </div>

                        <div className="flex justify-between gap-3 pt-4">
                            <Button
                                type="button"
                                onClick={handleCancel}
                                outline
                            >
                                Отмена
                            </Button>
                            <Button
                                type="button"
                                onClick={handleCreateProject}
                                disabled={isCreateDisabled}
                            >
                                Создать
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {visible && modalId === 'edit-project-modal' && (
                <Modal 
                    title="Изменение проекта" 
                    onClose={handleCloseModal} 
                    id={modalId}
                >
                    <div className="flex flex-col gap-6 p-1">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Название</label>
                            <Input
                                type="text"
                                value={editProjectName}
                                onChange={(e) => setEditProjectName(e.target.value)}
                                placeholder="Название"
                                className="w-full h-11"
                                autoFocus
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Описание</label>
                            <textarea
                                value={editProjectDescription}
                                onChange={(e) => setEditProjectDescription(e.target.value)}
                                placeholder="Описание"
                                className="
                                    w-full 
                                    min-h-[100px] 
                                    px-3 py-2 
                                    border border-gray-300 
                                    rounded-lg 
                                    text-gray-900 
                                    text-sm 
                                    resize-vertical
                                    focus:outline-none focus:ring-2 focus:ring-[#FFE7DB] focus:border-transparent
                                    transition-all duration-200
                                "
                            />
                        </div>

                        <div className="flex justify-between gap-3 pt-4">
                            <Button
                                type="button"
                                onClick={handleCancel}
                                outline
                            >
                                Отмена
                            </Button>
                            <Button
                                type="button"
                                onClick={handleEditProject}
                                disabled={isEditDisabled}
                            >
                                Сохранить
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {visible && modalId === 'delete-project-modal' && (
                <Modal 
                    title="Удаление проекта" 
                    onClose={handleCloseModal} 
                    id={modalId}
                >
                    <div className="flex flex-col gap-6 p-1">
                        <div className="text-center">
                            <p className="text-gray-500 text-sm">
                                Вы точно хотите удалить проект <span className="font-semibold">"{projectToDelete?.name}"</span>
                            </p>
                        </div>
                        <div className="flex justify-between gap-3 pt-4">
                            <Button
                                type="button"
                                onClick={handleCancel}
                                outline
                            >
                                Отмена
                            </Button>
                            <Button
                                type="button"
                                onClick={handleDeleteProject}
                            >
                                Удалить
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default ProjectsPage;