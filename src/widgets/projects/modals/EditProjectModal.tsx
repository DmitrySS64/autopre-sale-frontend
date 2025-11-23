import { Input } from "@/shared/components/form/input";
import { Button } from "@/shared/components/form/button";

interface EditProjectModalProps {
  form: {
    editProjectName: string;
    setEditProjectName: (value: string) => void;
    editProjectDescription: string;
    setEditProjectDescription: (value: string) => void;
  };
  state: {
    isEditDisabled: boolean;
  };
  actions: {
    handleCancel: () => void;
    handleEditProject: () => void;
  };
}

export const EditProjectModal = ({ form, state, actions }: EditProjectModalProps) => {
  return (
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
  );
};