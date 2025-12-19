import {AuthRepository} from "@entities/user/auth/api/repository/AuthRepository.ts";
import {HTTP_APP_SERVICE} from "@shared/services/http/HttpAppService.ts";
import {useQuery, type UseQueryResult} from "@tanstack/react-query";
import {EQueryKeys} from "@shared/enum/query";
import type {IGetMeDto} from "@entities/user/auth/interface/dto";
import {CookieService} from "@shared/services/cookie/CookieService.ts";
import {ECookieKey} from "@shared/services/cookie/ECookieKey.ts";
import ERouterPath from "@shared/routes";


type IGetMeRequestResult = UseQueryResult<IGetMeDto, Error>

interface IGetMeRequestOptions {
    enabled?: boolean
}

const repository = new AuthRepository(HTTP_APP_SERVICE);
const cookieService = new CookieService();

function useGetMeRequest({
    enabled = false,
}: IGetMeRequestOptions = {}) : IGetMeRequestResult {
    const callback = async () => {
        try {
            return repository.getMe()
        } catch (error) {
            if (error?.status === 401 || error?.message?.includes('accessToken')) {
                cookieService.remove(ECookieKey.ACCESS_TOKEN);
                cookieService.remove(ECookieKey.REFRESH_TOKEN);
                window.location.href = ERouterPath.AUTHORIZATION_PAGE;
            }
            throw error;
        }

    }
    return useQuery({
        queryKey: [EQueryKeys.GET_ME],
        queryFn: callback,
        enabled,
        //staleTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: 1,
    })
}

export { useGetMeRequest };