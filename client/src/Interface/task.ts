export type ITaskStatus = "PENDING" | "COMPLETED";

export interface ITaskCreate {
  title: string;
  description?: string;
}

export interface ITask extends ITaskCreate {
  id: string;
  status: ITaskStatus;
  createdAt: Date;
  updatedAt: Date;
}
