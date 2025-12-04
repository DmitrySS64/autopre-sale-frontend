import {z} from "zod";

const authPageSchema = z.object({
    email: z
        .string()
        .min(1, "Поле обязательно для заполнения")
        .email("Введите корректный email адрес")
        .default(''),
    password: z
        .string()
        .min(1, "Поле обязательно для заполнения")
        .min(6, "Пароль должен содержать минимум 6 символов")
        .default('')
});

export {authPageSchema};