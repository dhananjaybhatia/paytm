import { z } from "zod";

const emailSchema = z
  .string()
  .email({ message: "Please provide a valid email address" })
  .trim()
  .toLowerCase();

const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long" });

const userSignupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z
    .string()
    .min(3, { message: "Firstname must be at least 3 characters long" })
    .max(30, { message: "Firstname cannot exceed 30 characters" }),
  lastName: z
    .string()
    .min(3, { message: "Lastname must be at least 3 characters long" })
    .max(30, { message: "Lastname cannot exceed 30 characters" }),
});

const userSigninSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const changePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
});

export { userSignupSchema, userSigninSchema, changePasswordSchema };
