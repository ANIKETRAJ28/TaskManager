export type ITaskStatus = "PENDING" | "COMPLETED";

export interface ITask {
  id: string;
  title: string;
  description?: string;
  status: ITaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskCreate
  extends Omit<ITask, "id" | "status" | "createdAt" | "updatedAt"> {
  userId: string;
}
