import { Button } from "@/shared/components/form/button";
import { Input } from "@/shared/components/form/input";
import { Modal } from "@/shared/components/modal/component";
import { ProjectItem } from "@/shared/components/projects/project_item";
import { useSidebarLayout } from "@widgets/sidebar/case/context";
import { useEffect } from "react";
import { useProjectsPagePresenter } from "../presenter/useProjectsPagePresenter";
import { CreateProjectModal } from "@/widgets/projects/modals/CreateProjectModal";
import { EditProjectModal } from "@/widgets/projects/modals/EditProjectModal";
import { DeleteProjectModal } from "@/widgets/projects/modals/DeleteProjectModal";

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
            <header className="flex flex-col xl:flex-row justify-between w-full content-center items-start xl:items-center gap-4 xl:gap-0">
                <form onSubmit={actions.handleSearchSubmit} className="flex flex-col xl:flex-row gap-4 xl:gap-[50px] w-full xl:w-auto">
                    <Input 
                        type="search" 
                        className="w-full xl:w-[400px] h-11 !rounded-4xl" 
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
                            w-full xl:w-auto
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
                    className="w-full xl:w-[200px] flex justify-between content-center gap-5"
                >
                    <span>Добавить</span>
                </Button>
            </header>

            {/* Список проектов */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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

            {/* Модалки */}
            {state.visible && state.modalId === 'create-project-modal' && (
                <Modal 
                    title="Создание проекта" 
                    onClose={actions.handleCloseModal} 
                    id={state.modalId}
                >
                    <CreateProjectModal form={form} state={state} actions={actions} />
                </Modal>
            )}

            {state.visible && state.modalId === 'edit-project-modal' && (
                <Modal 
                    title="Изменение проекта" 
                    onClose={actions.handleCloseModal} 
                    id={state.modalId}
                >
                    <EditProjectModal form={form} state={state} actions={actions} />
                </Modal>
            )}

            {state.visible && state.modalId === 'delete-project-modal' && (
                <Modal 
                    title="Удаление проекта" 
                    onClose={actions.handleCloseModal} 
                    id={state.modalId}
                >
                    <DeleteProjectModal state={state} actions={actions} />
                </Modal>
            )}
        </div>
    )
}

export default ProjectsPage;