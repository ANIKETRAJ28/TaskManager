/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ITaskStatus } from "@/Interface/task";
import { axiosInstance } from "@/util/axios";

export async function createTask(title: string, description?: string) {
  try {
    const data = await axiosInstance.post("tasks", {
      title,
      description,
    });
    return data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        message: "An error occurred while creating the task.",
      }
    );
  }
}

export async function getTasks() {
  try {
    const data = await axiosInstance.get("tasks");
    return data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        message: "An error occurred while fetching tasks.",
      }
    );
  }
}

export async function updateTaskStatus(taskId: string, status: ITaskStatus) {
  try {
    const data = await axiosInstance.put(`tasks/${taskId}`, {
      status,
    });
    return data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        message: "An error occurred while updating the task status.",
      }
    );
  }
}

export async function deleteTask(taskId: string) {
  try {
    const data = await axiosInstance.delete(`tasks/${taskId}`);
    return data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        message: "An error occurred while deleting the task.",
      }
    );
  }
}
