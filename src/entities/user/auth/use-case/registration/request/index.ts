import {AuthRepository} from "@entities/user/auth/api/repository/AuthRepository.ts";
import {HTTP_APP_SERVICE} from "@shared/services/http/HttpAppService.ts";
import {useMutation} from "@tanstack/react-query";
import {EMutationKeys} from "@shared/enum/query";
import type {IUseRegisterRequestResult} from "@entities/user/auth/interface/requestResult";
import {useAuth} from "@entities/user/auth/context/useAuth";
import type {IRegisterPort} from "@entities/user/auth/interface/port";
import {isEmpty} from "es-toolkit/compat";
import {useGetMePresenter} from "@entities/user/auth/use-case/get-me/presenter";


const repository = new AuthRepository(HTTP_APP_SERVICE);

const useRegistrationRequest = (): IUseRegisterRequestResult => {
    const { setUser, setIsAuthenticated } = useAuth()
    const { refetch: getMeRequest } = useGetMePresenter()

    const callback = async (port: IRegisterPort) => {
        return repository.register(port)
    }

    const handleOnSuccess = async () => {
        try{
            setIsAuthenticated(true)
            const { data } = await getMeRequest()

            if (data && !isEmpty(data)){
                setUser(data)
            }
            else {
                setIsAuthenticated(false)
            }
        } catch {
            setIsAuthenticated(false)
        }
    }

    const handleOnError = () => {

    }

    return useMutation({
        mutationKey: [EMutationKeys.REGISTER],
        mutationFn: callback,
        onSuccess: handleOnSuccess,
        onError: handleOnError
    })
}

export { useRegistrationRequest };