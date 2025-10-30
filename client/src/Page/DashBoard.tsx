import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ListTodo, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskCard from "@/components/TaskCard";
import TaskDialog from "@/components/TaskDialog";
import type { ITask, ITaskStatus } from "@/Interface/task";
import type { RootState } from "@/Store/store";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hook";
import { fetchTasks } from "@/Store/taskSlice";
import { toast } from "sonner";

const Dashboard = () => {
  const [filter, setFilter] = useState<"ALL" | ITaskStatus>("ALL");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [allTasks, setAllTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const tasks = useSelector((state: RootState) => state.tasks);

  const navigate = useNavigate();

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
  };

  const filteredTasks = allTasks.filter((task) => {
    if (filter === "ALL") return true;
    return task.status === filter;
  });

  useEffect(() => {
    async function loadTasks() {
      await dispatch(fetchTasks());
      setLoading(false);
    }
    if (!auth.isAuthenticated) {
      toast.error("Please login or register to access the dashboard");
      navigate("/");
    }
    setAllTasks(tasks);
    if (loading && allTasks.length === 0) {
      loadTasks();
    }
  }, [auth.isAuthenticated, navigate, dispatch, loading, allTasks, tasks]);

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Tasks</h1>
              <p className="text-muted-foreground mt-1">
                {allTasks.length} {allTasks.length <= 1 ? "Task" : "Tasks"}
              </p>
            </div>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>

          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as ITaskStatus)}
          >
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="ALL">All</TabsTrigger>
              <TabsTrigger value="PENDING">Pending</TabsTrigger>
              <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
            </TabsList>
          </Tabs>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <ListTodo className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                {filter === "ALL"
                  ? "Get started by creating your first task."
                  : `No ${filter} tasks at the moment.`}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
      />
    </div>
  );
};

export default Dashboard;
