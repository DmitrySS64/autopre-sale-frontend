import { Input } from "@/shared/components/form/input";
import { Button } from "@/shared/components/form/button";

interface CreateProjectModalProps {
  form: {
    projectName: string;
    setProjectName: (value: string) => void;
    projectDescription: string;
    setProjectDescription: (value: string) => void;
  };
  state: {
    isCreateDisabled: boolean;
  };
  actions: {
    handleCancel: () => void;
    handleCreateProject: () => void;
  };
}

export const CreateProjectModal = ({ form, state, actions }: CreateProjectModalProps) => {
  return (
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
  );
};