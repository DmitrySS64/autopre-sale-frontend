import {z} from "zod";

const authPageSchema = z.object({
    email: z
        .string()
        .email(),
    password: z
        .string()
        .min(6)
        .max(10)
})

export {authPageSchema};