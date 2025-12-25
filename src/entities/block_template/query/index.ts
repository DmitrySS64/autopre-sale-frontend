import {useQuery} from "@tanstack/react-query";
import {TemplateRepository} from "@entities/block_template/templateRepository";
import {HTTP_APP_SERVICE} from "@shared/services/http/HttpAppService.ts";
import type {IGetTemplatesResponse, IGetTemplateResponse} from "@entities/block_template/interface/index.response.ts";

const repository = new TemplateRepository(HTTP_APP_SERVICE)

const useGetAllTemplates = () => {
    return useQuery<IGetTemplatesResponse, Error>({
        queryKey: ['template:get-all'],
        queryFn: async () => {
            console.log('Fetching templates from API...');
            const result = await repository.getTemplates();
            console.log('Templates API response:', result);
            return result;
        },
        staleTime: 60 * 60 * 1000,
        retry: 1,
        retryDelay: 1000,
    })
}

const useGetTemplateById = (templateId: string | undefined) => {
    return useQuery<IGetTemplateResponse, Error>({
        queryKey: ['template:get-by-id', templateId],
        queryFn: async () => {
            if (!templateId) {
                throw new Error('Template ID is required');
            }
            console.log('Fetching template by ID:', templateId);
            const result = await repository.getTemplateById({ id: templateId });
            console.log('Template API response:', result);
            return result;
        },
        enabled: !!templateId, // Only run query if templateId is provided
        staleTime: 60 * 60 * 1000,
        retry: 1,
        retryDelay: 1000,
    })
}


export {useGetAllTemplates, useGetTemplateById}