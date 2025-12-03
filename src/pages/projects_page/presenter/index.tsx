import React, {useCallback, useEffect, useState} from "react";
import type {ProjectDto} from "@entities/project/interface/dto";
import {useProjectsQuery} from "@entities/project/api/query";
import {useSidebarLayout} from "@widgets/sidebar/case/context";
import {useNavigate} from "@tanstack/react-router";
import ERouterPath from "@shared/routes";
import {useModal} from "@widgets/modal/use-case";
import {useContextMenu} from "@widgets/context_menu/use-case";
import {CreateProjectModal} from "@pages/projects_page/modal/createProjectModal";
import {EditProjectModal} from "@pages/projects_page/modal/editProjectModal";
import {DeleteProjectModal} from "@pages/projects_page/modal/deleteProjectModal";
import {useAppForm} from "@shared/lib/form";
import {searchProjectSchema} from "@pages/projects_page/schema";
import {useAlert} from "@widgets/alert/use-case";


interface ISearchValues {
    value: {
        search: string;
    }
}

const useProjectsPresenter = () => {
    const {setTitle} = useSidebarLayout()
    useEffect(() => {
        setTitle("Проекты")
    }, [setTitle])

    const [projects, setProjects] = useState<ProjectDto[]>([]);
    const {data} = useProjectsQuery()
    const navigate = useNavigate()
    const { showModal, closeAllModals } = useModal();
    const { showContextMenu } = useContextMenu();
    const { showAlert } = useAlert();

    useEffect(() => {
        if (data) {
            setProjects(data)
        }
    }, [data])

    const handleOpenProject = useCallback((id: string) => {
        navigate({
            to: (ERouterPath.PROJECT + '/' + id + ERouterPath.ANALYSIS) as string
        }).then()
    }, [navigate])

    const handleCreateProjectModal = () => {
        showModal({
            title: 'Создание проекта',
            content: CreateProjectModal()
        })
    }

    const handleEditProjectModal = useCallback((id: string) => {
        const project = projects.find((project) => project.id === id)?.[0]
        showModal(EditProjectModal(project, closeAllModals))
    }, [closeAllModals, projects, showModal])

    const handleDeleteProjectModal = useCallback((id: string) => {
        const project = projects.find((project) => project.id === id)?.[0]
        showModal(DeleteProjectModal(project, closeAllModals))
    }, [closeAllModals, projects, showModal])

    const handleShowContextMenu = useCallback((e: React.MouseEvent, projectId: string) => {
        showContextMenu({
            items: [
                {
                    id: 'edit',
                    label: 'Изменить',
                    onClick: () => handleEditProjectModal(projectId)
                }, {
                    id: 'delete',
                    label: "Удалить",
                    onClick: () => handleDeleteProjectModal(projectId),
                }
            ],
            position: {
                x: e.clientX,
                y: e.clientY
            }
        })
    }, [handleDeleteProjectModal, handleEditProjectModal, showContextMenu])

    const handleProjectSearch = useCallback(({value}: ISearchValues) => {
        showAlert(`Поиск по "${value.search}"`)
    }, [showAlert])

    const form = useAppForm({
        validators: {onBlur: searchProjectSchema},
        onSubmit: handleProjectSearch
    })

    return {
        form,
        projects,
        handleOpenProject,
        handleShowContextMenu,
        handleCreateProject: handleCreateProjectModal,
    }
}

export {useProjectsPresenter}