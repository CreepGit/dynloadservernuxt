import { z } from 'zod';

export const UserValid = z.object({
    username: z.string().min(4, "Username too short").max(20, "Username too long"),
    password: z.string().min(4, "Password too short").max(20, "Password too long"),
})
