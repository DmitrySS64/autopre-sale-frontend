import { useState } from "react";

interface ProjectItemProps {
    project: {
        id: string;
        name: string;
        description: string;
    };
    onEdit: (project: { id: string; name: string; description: string }) => void;
    onDelete: (projectId: string, projectName: string) => void;
    onContextMenu: (e: React.MouseEvent, project: { id: string; name: string; description: string }) => void;
}

export const ProjectItem = ({ project, onEdit, onDelete, onContextMenu }: ProjectItemProps) => {
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    const toggleDropdown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDropdownOpen(!dropdownOpen);
    };

    const handleEdit = () => {
        onEdit(project);
        setDropdownOpen(false);
    };

    const handleDelete = () => {
        onDelete(project.id, project.name);
        setDropdownOpen(false);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        onContextMenu(e, project);
    };

    return (
        <div 
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm relative"
            onContextMenu={handleContextMenu}
        >
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 pr-8">{project.name}</h3>
                
                {/* Кнопка с тремя точками */}
                <div className="relative">
                    <svg 
                        onClick={toggleDropdown}
                        className="w-5 h-5 cursor-pointer" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                    >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>

                    {/* Выпадающее меню */}
                    {dropdownOpen && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                            <button
                                type="button"
                                onClick={handleEdit}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                            >
                                Изменить
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
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
    );
};