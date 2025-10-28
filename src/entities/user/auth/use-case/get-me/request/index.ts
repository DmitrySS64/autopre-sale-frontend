import {AuthRepository} from "@entities/user/auth/api/repository/AuthRepository.ts";
import {HTTP_APP_SERVICE} from "@shared/services/http/HttpAppService.ts";
import {useQuery, type UseQueryResult} from "@tanstack/react-query";
import {EQueryKeys} from "@shared/enum/query";
import type {IGetMeDto} from "@entities/user/auth/interface/dto";


type IGetMeRequestResult = UseQueryResult<IGetMeDto, Error>

interface IGetMeRequestOptions {
    enabled?: boolean
}

const repository = new AuthRepository(HTTP_APP_SERVICE);

function useGetMeRequest({
    enabled = false,
}: IGetMeRequestOptions = {}) : IGetMeRequestResult {
    const callback = async () => {
        return repository.getMe()
    }
    return useQuery({
        queryKey: [EQueryKeys.GET_ME],
        queryFn: callback,
        enabled
    })
}

export { useGetMeRequest };