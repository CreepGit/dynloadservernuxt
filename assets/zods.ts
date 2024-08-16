import { z } from "zod"

export const userValid = z.object({
    username: z.string().min(5, "Too short username").max(20, "Too long username"),
    password: z.string().min(5, "Too short password").max(32, "Too long password"),
})
