import { z } from 'zod';

// Zod validation schema
export const registerSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(1, { message: "Password is required" }),
    password_confirmation: z.string().min(1, { message: "Password confirmation is required" }),
}).refine(data => data.password === data.password_confirmation, {
    message: "Passwords don't match.",
    path: ["password_confirmation"],
});

// type RegisterData = z.infer<typeof registerSchema>;
