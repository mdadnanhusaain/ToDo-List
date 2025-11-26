import Checkbox from "../atoms/Checkbox";
import DeleteIcon from "../icons/DeleteIcon";
import EditIcon from "../icons/EditIcon";

export default function TaskListItem({ task, onToggle, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3 flex-1">
        <Checkbox checked={task.completed} onChange={onToggle} />
        <span
          className={`text-sm text-[#090E23] ${
            task.completed && "line-through"
          }`}
        >
          {task.title}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-[#C0C0C0] hover:text-red-500 transition-colors cursor-pointer"
            aria-label="Delete task"
          >
            <DeleteIcon className="size-6" />
          </button>
        )}
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="text-[#C0C0C0] hover:text-indigo-500 transition-colors cursor-pointer"
            aria-label="Edit task"
          >
            <EditIcon className="size-6" />
          </button>
        )}
      </div>
    </div>
  );
}
