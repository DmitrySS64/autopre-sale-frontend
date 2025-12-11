import { ICON_PATH } from "@/shared/components/images/icons";
import Icon from "@mdi/react";
import {useRegistrationFormPresenter} from "@pages/sign-in/registration_form/presenter";
import {useState, type FormEvent} from "react";

const RegistrationForm = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordRepeat, setShowPasswordRepeat] = useState(false)


    const {
        form
    } = useRegistrationFormPresenter()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        await form.handleSubmit()
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }
    
    const togglePasswordRepeatVisibility = () => {
        setShowPasswordRepeat(!showPasswordRepeat)
    }

    return (
        <form onSubmit={handleSubmit} className={'flex flex-col gap-[60px]'}>
            <div className={'w-full flex flex-col gap-[20px]'}>
                <form.AppField name={'firstName'}>
                    {(field) => (
                        <field.TextField
                            type={'text'}
                            placeholder={'Имя'}
                        />
                    )}
                </form.AppField>
                <form.AppField name={'lastName'}>
                    {(field) => (
                        <field.TextField
                            type={'text'}
                            placeholder={'Фамилия'}
                        />
                    )}
                </form.AppField>
                <form.AppField name={'middleName'}>
                    {(field) => (
                        <field.TextField
                            type={'text'}
                            placeholder={'Отчество'}
                        />
                    )}
                </form.AppField>
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
                            placeholder={'Пароль'}
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
                <form.AppField name={'confirmPassword'}>
                    {(field) => (
                        <div className="relative">
                            <field.TextField
                            type={showPasswordRepeat ? 'text' : 'password'}
                            placeholder={'Подтвердить пароль'}
                            />
                        <div
                            onClick={togglePasswordRepeatVisibility}
                            className="absolute right-5 top-1/2 transform -translate-y-1/2"
                            tabIndex={-1}
                        >
                            <Icon 
                                path={showPasswordRepeat ? ICON_PATH.EYE_OFF : ICON_PATH.EYE} 
                                size={1}
                            />
                        </div>
                        </div>
                    )}
                </form.AppField>
            </div>

            <form.AppForm>
                <form.SubscribeButton>
                    Зарегистрироваться
                </form.SubscribeButton>
            </form.AppForm>
        </form>
    )
}

export {RegistrationForm}