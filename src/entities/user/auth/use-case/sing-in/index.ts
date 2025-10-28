import {useMutation, type UseMutationResult} from "@tanstack/react-query";
import type {ISignInDto} from "@entities/user/auth/interface/dto";
import type {ISignInPort} from "@entities/user/auth/interface/port";
import {AuthRepository} from "@entities/user/auth/api/repository/AuthRepository.ts";
import {HTTP_APP_SERVICE} from "@shared/services/http/HttpAppService.ts";
import {useAuth} from "@entities/user/auth/context/useAuth";
import {useGetMePresenter} from "@entities/user/auth/use-case/get-me/presenter";
import {EMutationKeys} from "@shared/enum/query";
import {isEmpty} from "es-toolkit/compat";
import {router} from "@app/routes";
import ERouterPath from "@shared/routes";

type IUseSignInRequestResult = UseMutationResult<
    ISignInDto,           // Успешный ответ
    Error,                  // Ошибка
    ISignInPort,          // Входные данные
    unknown                 // Контекст (не используем)
>

const repository = new AuthRepository(HTTP_APP_SERVICE);

const useSignInRequest = (): IUseSignInRequestResult => {
    const { setUser, setIsAuthenticated } = useAuth()
    const { refetch: getMeRequest } = useGetMePresenter()

    const callback = async (port: ISignInPort) => {
        return repository.signIn(port);
    }

    const handleOnSuccess = async () => {
        try {
            setIsAuthenticated(true);
            const { data } = await getMeRequest();

            if (data && !isEmpty(data)) {
                setUser(data);
                await router.invalidate();
                await router.navigate({
                    to: ERouterPath.PROJECTS_PAGE as string
                })
            } else {
                setIsAuthenticated(false);
            }
        } catch {
            setIsAuthenticated(false);
        }
    };

    const handleOnError = () => {
        setIsAuthenticated(false);
    };

    return useMutation({
        mutationKey: [EMutationKeys.SIGN_IN],
        mutationFn: callback,
        onSuccess: handleOnSuccess,
        onError: handleOnError,
    });
}

export { useSignInRequest }