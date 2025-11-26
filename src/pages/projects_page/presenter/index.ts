import {useCallback, useEffect, useState} from "react";
import type {ProjectDto} from "@entities/project/interface/dto";
import {useProjectsQuery} from "@entities/project/api/query";
import {useSidebarLayout} from "@widgets/sidebar/case/context";
import {useNavigate} from "@tanstack/react-router";
import ERouterPath from "@shared/routes";

const useProjectsPresenter = () => {
    const {setTitle} = useSidebarLayout()
    useEffect(() => {
        setTitle("Проекты")
    }, [setTitle])

    const [projects, setProjects] = useState<ProjectDto[]>([]);
    const {data} = useProjectsQuery()
    const navigate = useNavigate()

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

    return {
        projects,
        handleOpenProject
    }
}

export {useProjectsPresenter}