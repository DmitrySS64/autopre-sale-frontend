import {useQuery, type UseQueryResult} from "@tanstack/react-query";
import type {IBacklogDTO} from "@entities/project/analysis_tz/interface";
import {AnalysisRepository} from "@entities/project/analysis_tz/api/AnalysisRepository.ts";
import {HTTP_APP_SERVICE} from "@shared/services/http/HttpAppService.ts";
import {EQueryKeys} from "@shared/enum/query";

type IAnalysisPageRequestResult = UseQueryResult<IBacklogDTO, Error>

interface IAnalysisPageRequestOptions {
    enabled?: boolean;
    projectId: string;
}

const repository = new AnalysisRepository(HTTP_APP_SERVICE);

function useAnalysisPageRequest({
                                    enabled = true,
                                    projectId,
                                }: IAnalysisPageRequestOptions): IAnalysisPageRequestResult {

    const callback = async () => {
        try {
            return await repository.getBacklogData(projectId);
        } catch (error) {
            console.error('Error fetching backlog data:', error);
            throw error;
        }
    };

    return useQuery({
        queryKey: [EQueryKeys.ANALYSIS_TZ, projectId],
        queryFn: callback,
        enabled: enabled && !!projectId,
        staleTime: 5 * 60 * 1000, // 5 минут
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: 1,
    });
}

export {useAnalysisPageRequest}