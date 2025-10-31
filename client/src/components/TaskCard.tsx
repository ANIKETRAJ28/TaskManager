import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCircle2, Circle, Edit3, X, Check } from "lucide-react";
import type { ITask } from "@/Interface/task";
import { useAppDispatch } from "@/hook";
import { removeTask, updateTask } from "@/Store/taskSlice";
import { useState } from "react";
import MoonLoader from "react-spinners/MoonLoader";

const TaskCard = ({ task }: { task: ITask }) => {
  const [edit, setEdit] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const [newDescription, setNewDescription] = useState(task.description || "");
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 mt-1"
              disabled={disabled}
              onClick={async () => {
                setDisabled(true);
                await dispatch(
                  updateTask({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    status: task.status === "PENDING" ? "COMPLETED" : "PENDING",
                  })
                );
                setDisabled(false);
              }}
            >
              {task.status === "COMPLETED" ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
            <div className="flex-1">
              <CardTitle
                className={`text-lg ${
                  task.status === "COMPLETED"
                    ? "line-through text-muted-foreground"
                    : ""
                }`}
              >
                {edit ? (
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-primary pb-1"
                  />
                ) : (
                  task.title
                )}
              </CardTitle>
              <Badge
                variant={task.status === "COMPLETED" ? "secondary" : "default"}
                className="mt-2"
              >
                {task.status}
              </Badge>
            </div>
          </div>
          {edit ? (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={disabled}
                onClick={async () => {
                  setEditLoading(true);
                  setDisabled(true);
                  await dispatch(
                    updateTask({
                      id: task.id,
                      title: newTitle,
                      description: newDescription,
                      status: task.status,
                    })
                  );
                  setDisabled(false);
                  setEditLoading(false);
                  setEdit(false);
                }}
              >
                {editLoading ? (
                  <MoonLoader
                    size={20}
                    speedMultiplier={1}
                    color="white"
                  />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={disabled}
                onClick={() => {
                  setNewTitle(task.title);
                  setNewDescription(task.description || "");
                  setEdit(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={disabled}
                onClick={() => setEdit(true)}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                disabled={disabled}
                onClick={async () => {
                  setDisabled(true);
                  setDeleteLoading(true);
                  await dispatch(removeTask(task.id));
                  setDisabled(false);
                  setDeleteLoading(false);
                }}
              >
                {deleteLoading ? (
                  <MoonLoader
                    size={20}
                    speedMultiplier={1}
                    color="white"
                  />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      {
        <CardContent className="pt-0 pb-3">
          {edit ? (
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full text-sm border-b border-gray-300 focus:outline-none focus:border-primary"
            />
          ) : (
            task.description && (
              <p className="text-sm text-muted-foreground">
                {task.description}
              </p>
            )
          )}
        </CardContent>
      }
    </Card>
  );
};

export default TaskCard;
