import {useSidebarLayout} from "@widgets/sidebar/case/context";
import {useEffect} from "react";

const ProjectsPage = () => {
    const {setTitle} = useSidebarLayout()
    useEffect(() => {
        setTitle("Проекты")
    }, [setTitle])

    return (
        <>
            Проекты
        </>
    )
}
export default ProjectsPage