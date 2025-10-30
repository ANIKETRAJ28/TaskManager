import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCircle2, Circle } from "lucide-react";
import type { ITask } from "@/Interface/task";
import { useAppDispatch } from "@/hook";
import { removeTask, updateTask } from "@/Store/taskSlice";

const TaskCard = ({ task }: { task: ITask }) => {
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
              onClick={async () => {
                const status =
                  task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
                await dispatch(updateTask({ status, taskId: task.id }));
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
                {task.title}
              </CardTitle>
              <Badge
                variant={task.status === "COMPLETED" ? "secondary" : "default"}
                className="mt-2"
              >
                {task.status}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={async () => await dispatch(removeTask(task.id))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {task.description && (
        <CardContent className="pt-0 pb-3">
          <p className="text-sm text-muted-foreground">{task.description}</p>
        </CardContent>
      )}
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground text-right">
          {new Date(task.createdAt).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
