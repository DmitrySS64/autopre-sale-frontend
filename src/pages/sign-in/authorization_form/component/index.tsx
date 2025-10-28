import {useAuthFormPresenter} from "@pages/sign-in/authorization_form/presenter";
import type {FormEvent} from "react";

const AuthForm = () => {

    const {
        form
    } = useAuthFormPresenter()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        await form.handleSubmit()
    }

    return (
        <form onSubmit={handleSubmit}>
            <form.AppField name={'email'}>
                {(field) => (
                    <field.TextField
                        type={'email'}
                        label={'Почта'}
                        placeholder={'Введите почту'}

                    />
                )}
            </form.AppField>
            <form.AppField name={'password'}>
                {(field) => (
                    <field.TextField
                        type={'password'}
                        label={"Пароль"}
                        placeholder={"Введите пароль"}
                    />
                )}
            </form.AppField>
            <form.AppForm>
                <form.SubscribeButton>
                    Войти
                </form.SubscribeButton>
            </form.AppForm>
        </form>
    )
}

export default AuthForm;