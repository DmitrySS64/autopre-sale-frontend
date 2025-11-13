import { Button } from "@/shared/components/form/button";
import { Input } from "@/shared/components/form/input";
import { Modal } from "@/shared/components/modal/component";
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

    // Состояние для выпадающего меню
    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

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
        setDropdownOpen(null);
    };

    const handleOpenDeleteModal = (projectId: string, projectName: string) => {
        setProjectToDelete({ id: projectId, name: projectName });
        setModalId('delete-project-modal');
        setVisible(true);
        setDropdownOpen(null);
    };

    const handleCloseModal = (id: string) => {
        setVisible(false);
        setModalId('');
        setEditingProject(null);
        setProjectToDelete(null);
    };

    const handleCreateProject = () => {
        // Логика создания проекта
        console.log('Создание проекта:', { projectName, projectDescription });
        handleCloseModal(modalId);
    };

    const handleEditProject = () => {
        if (editingProject) {
            // Логика обновления проекта
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
            // Логика удаления проекта
            console.log('Удаление проекта:', projectToDelete);
            handleCloseModal(modalId);
        }
    };

    const handleCancel = () => {
        handleCloseModal(modalId);
    };

    const toggleDropdown = (projectId: string) => {
        setDropdownOpen(dropdownOpen === projectId ? null : projectId);
    };

    const isCreateDisabled = !projectName.trim();
    const isEditDisabled = !editProjectName.trim();

    // Пример данных проектов (замените на реальные данные)
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

    // Закрывать dropdown при клике вне его
    useEffect(() => {
        const handleClickOutside = () => {
            setDropdownOpen(null);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div>
            <header className="flex justify-between w-full content-center items-center">
                <div className="flex gap-[50px]">
                    <Input 
                        type="search" 
                        className="w-[400px] h-11 !rounded-4xl" 
                        placeholder="Поиск" 
                        name="Search"
                    />
                    <select className="
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
                    ">
                        <option value="" selected>Созданы недавно</option>
                        <option value="newest">Сначала новые</option>
                        <option value="oldest">Сначала старые</option>
                        <option value="name">По названию</option>
                    </select>
                </div>
                
                <Button 
                    onClick={handleOpenModal}
                    type="button" 
                    className="w-[200px] flex justify-between content-center gap-5"
                >
                    <span>Добавить</span>
                </Button>
            </header>

            {/* Список проектов */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                    <div key={project.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm relative">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 pr-8">{project.name}</h3>
                            
                            {/* Кнопка с тремя точками */}
                            <div className="relative bg-white">
                                    <svg        onClick={(e) => {
                                        e.stopPropagation();
                                        toggleDropdown(project.id);
                                    }} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                    </svg>


                                {/* Выпадающее меню */}
                                {dropdownOpen === project.id && (
                                    <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                                        <button
                                            onClick={() => handleOpenEditModal(project)}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                                        >
                                            Изменить
                                        </button>
                                        <button
                                            onClick={() => handleOpenDeleteModal(project.id, project.name)}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm">{project.description}</p>
                    </div>
                ))}
            </div>

            {/* Модалка создания проекта */}
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
                                className={`
                                    px-6 py-2 
                                    ${isCreateDisabled 
                                        ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                                        : 'bg-[#FF6B35] hover:bg-[#E55A2B] text-white'
                                    }
                                `}
                            >
                                Создать
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Модалка редактирования проекта */}
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
                                className={`
                                    px-6 py-2 
                                    ${isEditDisabled 
                                        ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                                        : 'bg-[#FF6B35] hover:bg-[#E55A2B] text-white'
                                    }
                                `}
                            >
                                Сохранить
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Модалка удаления проекта */}
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
                                onClick={handleEditProject}
                                className={`
                                    px-6 py-2 
                                    ${isEditDisabled 
                                        ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                                        : 'bg-[#FF6B35] hover:bg-[#E55A2B] text-white'
                                    }
                                `}
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