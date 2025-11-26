import {useProjectsPresenter} from "@pages/projects_page/presenter";

const ProjectsPage = () => {
    const {projects, handleOpenProject} = useProjectsPresenter()

    return (
        <>
            Проекты
            {projects.map((project) => (
                <li>
                    <ol onClick={() => handleOpenProject(project.id)}>{project.name}</ol>
                </li>
            ))}
        </>
    )
}
export default ProjectsPage