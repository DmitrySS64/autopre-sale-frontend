import {useAppForm} from "@shared/lib/form";
import {useRegistrationRequest} from "@entities/user/auth/use-case/registration/request";
import {registrationSchema} from "@pages/sign-in/registration_form/schema";

interface IRegisterFormValues {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
}

interface IRegisterFormSubmitProps {
    value: IRegisterFormValues
}

const useRegistrationPresenter = () => {
    //const router = useRouter();
    //const navigate = useNavigate();
    const { mutateAsync } = useRegistrationRequest()

    const handleSubmit = async ({value}: IRegisterFormSubmitProps) => {
        await mutateAsync(value, {
            onSuccess: () => {

            },
            onError: () => {

            }
        })
    }

    const form = useAppForm({
        validators: {onBlur: registrationSchema},
        onSubmit: handleSubmit
    })

    return {
        form
    }
}

export { useRegistrationPresenter }