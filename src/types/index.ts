import { z } from "zod";

const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
    rememberMe: z.boolean().default(false),
});

// Type derivado del schema de Zod
export type LoginFormData = z.infer<typeof loginSchema>;

export type MenuItem = {
    name: string;
    path: string;
    icon: React.ReactNode;
    label: string;
};
