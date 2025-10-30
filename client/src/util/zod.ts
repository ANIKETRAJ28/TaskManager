import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional(),
});

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(/^\S+$/, "Username cannot contain spaces");

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(30, "Password must be at most 30 characters")
  .regex(/^\S+$/, "Password cannot contain spaces");
