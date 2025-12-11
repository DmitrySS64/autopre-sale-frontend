import {useAuthFormPresenter} from "@pages/sign-in/authorization_form/presenter";
import type {FormEvent} from "react";
import {useState} from "react";
import Icon from "@mdi/react";
import { ICON_PATH } from "@/shared/components/images/icons";

const AuthForm = () => {
    const {
        form
    } = useAuthFormPresenter()
    
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        await form.handleSubmit()
    }
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <form onSubmit={handleSubmit} className={'flex flex-col items-center gap-[60px]'}>
            <div className={'w-full flex flex-col gap-[20px]'}>
                <form.AppField name={'email'}>
                    {(field) => (
                        <field.TextField
                            type={'email'}
                            placeholder={'Почта'}
                        />
                    )}
                </form.AppField>
                <form.AppField name={'password'}>
                    {(field) => (
                        <div className="relative">
                            <field.TextField
                                type={showPassword ? 'text' : 'password'}
                                placeholder={"Пароль"}
                            />
                            <div
                                onClick={togglePasswordVisibility}
                                className="absolute right-5 top-1/2 transform -translate-y-1/2"
                                tabIndex={-1}
                            >
                                <Icon 
                                    path={showPassword ? ICON_PATH.EYE_OFF : ICON_PATH.EYE} 
                                    size={1}
                                />
                            </div>
                        </div>
                    )}
                </form.AppField>
            </div>

            <form.AppForm>
                <form.SubscribeButton>
                    Войти
                </form.SubscribeButton>
            </form.AppForm>
        </form>
    )
}

export default AuthForm;