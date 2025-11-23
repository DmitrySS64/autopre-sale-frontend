import { Button } from "@/shared/components/form/button";

interface DeleteProjectModalProps {
  state: {
    projectToDelete: { id: string; name: string } | null;
  };
  actions: {
    handleCancel: () => void;
    handleDeleteProject: () => void;
  };
}

export const DeleteProjectModal = ({ state, actions }: DeleteProjectModalProps) => {
  return (
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
  );
};