/* eslint-disable @typescript-eslint/no-explicit-any */

import { axiosInstance } from "@/util/axios";

export async function login(username: string, password: string) {
  try {
    const data = await axiosInstance.post("auth/login", {
      username,
      password,
    });
    return data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        message: "An error occurred during login.",
      }
    );
  }
}

export async function signup(username: string, password: string) {
  try {
    const data = await axiosInstance.post("auth/register", {
      username,
      password,
    });
    return data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        message: "An error occurred during register.",
      }
    );
  }
}

export async function logout() {
  try {
    const data = await axiosInstance.post("auth/logout");
    return data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        message: "An error occurred during register.",
      }
    );
  }
}

export async function verify() {
  try {
    const data = await axiosInstance.get("auth/verify");
    return data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        message: "An error occurred during register.",
      }
    );
  }
}
