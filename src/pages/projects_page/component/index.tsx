import { Button } from "@/shared/components/form/button";
import { Input } from "@/shared/components/form/input";
import { Modal } from "@/shared/components/modal/component";
import { ProjectItem } from "@/shared/components/projects/project_item";
import { useSidebarLayout } from "@widgets/sidebar/case/context";
import { useEffect } from "react";
import { useProjectsPagePresenter } from "../presenter/useProjectsPagePresenter";

const ProjectsPage = () => {
    const { setTitle } = useSidebarLayout();
    const {
        form,
        state,
        actions
    } = useProjectsPagePresenter();

    useEffect(() => {
        setTitle("Проекты")
    }, [setTitle]);

    return (
        <div>
            <header className="flex justify-between w-full content-center items-center">
                <form onSubmit={actions.handleSearchSubmit} className="flex gap-[50px]">
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
                    onClick={actions.handleOpenModal}
                    type="button" 
                    className="w-[200px] flex justify-between content-center gap-5"
                >
                    <span>Добавить</span>
                </Button>
            </header>

            {/* Список проектов */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {state.projects.map((project) => (
                    <ProjectItem
                        key={project.id}
                        project={project}
                        onEdit={actions.handleOpenEditModal}
                        onDelete={actions.handleOpenDeleteModal}
                        onContextMenu={actions.showContextMenuHandle}
                    />
                ))}
            </div>

            {/* Модалка создания проекта */}
            {state.visible && state.modalId === 'create-project-modal' && (
                <Modal 
                    title="Создание проекта" 
                    onClose={actions.handleCloseModal} 
                    id={state.modalId}
                >
                    <div className="flex flex-col gap-6 p-1">
                        <div className="flex flex-col gap-2">
                            <Input
                                type="text"
                                value={form.projectName}
                                onChange={(e) => form.setProjectName(e.target.value)}
                                placeholder="Название"
                                className="w-full h-11"
                                autoFocus
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <textarea
                                value={form.projectDescription}
                                onChange={(e) => form.setProjectDescription(e.target.value)}
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
                                onClick={actions.handleCancel}
                                outline
                            >
                                Отмена
                            </Button>
                            <Button
                                type="button"
                                onClick={actions.handleCreateProject}
                                disabled={state.isCreateDisabled}
                            >
                                Создать
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Модалка редактирования проекта */}
            {state.visible && state.modalId === 'edit-project-modal' && (
                <Modal 
                    title="Изменение проекта" 
                    onClose={actions.handleCloseModal} 
                    id={state.modalId}
                >
                    <div className="flex flex-col gap-6 p-1">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Название</label>
                            <Input
                                type="text"
                                value={form.editProjectName}
                                onChange={(e) => form.setEditProjectName(e.target.value)}
                                placeholder="Название"
                                className="w-full h-11"
                                autoFocus
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Описание</label>
                            <textarea
                                value={form.editProjectDescription}
                                onChange={(e) => form.setEditProjectDescription(e.target.value)}
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
                                onClick={actions.handleCancel}
                                outline
                            >
                                Отмена
                            </Button>
                            <Button
                                type="button"
                                onClick={actions.handleEditProject}
                                disabled={state.isEditDisabled}
                            >
                                Сохранить
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Модалка удаления проекта */}
            {state.visible && state.modalId === 'delete-project-modal' && (
                <Modal 
                    title="Удаление проекта" 
                    onClose={actions.handleCloseModal} 
                    id={state.modalId}
                >
                    <div className="flex flex-col gap-6 p-1">
                        <div className="text-center">
                            <p className="text-gray-500 text-sm">
                                Вы точно хотите удалить проект <span className="font-semibold">"{state.projectToDelete?.name}"</span>
                            </p>
                        </div>
                        <div className="flex justify-between gap-3 pt-4">
                            <Button
                                type="button"
                                onClick={actions.handleCancel}
                                outline
                            >
                                Отмена
                            </Button>
                            <Button
                                type="button"
                                onClick={actions.handleDeleteProject}
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