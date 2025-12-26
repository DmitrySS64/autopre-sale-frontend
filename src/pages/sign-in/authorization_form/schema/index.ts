import {z} from "zod";

const ERROR_MESSAGES = {
    EMPTY_FIELD: 'Поле не заполнено',
    INCORRECT_CHARACTERS: 'Используются некорректные символы',
    INCORRECT_EMAIL: 'На правильно заполнена почта',
    PASSWORD_LENGTH: 'Длина пароля от 8 символов',
}

const authPageSchema = z.object({
    email: z
        .string()
        .min(1, ERROR_MESSAGES.EMPTY_FIELD)
        .email(ERROR_MESSAGES.INCORRECT_EMAIL),
    password: z
        .string()
        .min(1, ERROR_MESSAGES.EMPTY_FIELD)
        .min(8, ERROR_MESSAGES.PASSWORD_LENGTH)
})

export {authPageSchema};