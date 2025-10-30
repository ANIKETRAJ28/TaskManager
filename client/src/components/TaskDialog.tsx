import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addTask } from "@/Store/taskSlice";
import { useAppDispatch } from "@/hook";
import { taskSchema } from "@/util/zod";
import { toast } from "sonner";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TaskDialog = ({ open, onOpenChange }: TaskDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const task_parse = taskSchema.safeParse({ title, description });
    if (!task_parse.success) {
      const messages: string[] = [];
      const errors = JSON.parse(task_parse.error.message);
      const message: string = errors
        .map((err: { message: string }) => err.message)
        .join(", ");
      messages.push(message);
      toast.error(messages.join("\n"));
      return;
    }
    if (title.trim()) {
      dispatch(
        addTask({
          title: title.trim(),
          description: description.trim() || undefined,
        })
      );
      setTitle("");
      setDescription("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>Add a new task to your list</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
          {/* <LightRays /> */}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
