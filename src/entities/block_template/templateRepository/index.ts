import {BaseRepository} from "@shared/api/http/BaseRepository.ts";
import type {ITemplateRepository} from "@entities/block_template/interface/index.repository.ts";
import {STUB_TEMPLATES} from '../stub'
import { IS_STUB as isStub } from "@shared/api/const";
import type {
    ICreateTemplatePort, IGetTemplateByIdPort
} from "@entities/block_template/interface/index.port.ts";
import type {
    ICreateTemplateResponse, IGetTemplateByIdError, IGetTemplateResponse, IGetTemplatesResponse
} from "@entities/block_template/interface/index.response.ts";
import type {ITemplateDto} from "@entities/block_template/interface/index.dto.ts";


class TemplateRepository  extends BaseRepository implements ITemplateRepository {
    // Создание шаблона (загрузка PPTX)
    public async createTemplate(port: ICreateTemplatePort): Promise<ICreateTemplateResponse> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const newTemplate: ITemplateDto = {
                id: `stub-${Date.now()}`,
                code: port.code,
                name: port.name,
                description: port.description,
                category: port.category,
                pptxFileUrl: `/api/templates/files/${port.code}.pptx`,
                previewUrl: `/api/templates/previews/${port.code}.png`,
                fields: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            STUB_TEMPLATES.push(newTemplate);

            return { template: newTemplate };
        }

        // Upload PPTX file with multipart/form-data
        return await this._httpService.post<ICreateTemplateResponse>('/api/Templates', {
            body: port,
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    }

    // Получение шаблона по ID
    public async getTemplateById(port: IGetTemplateByIdPort): Promise<IGetTemplateResponse> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 500));

            const template = STUB_TEMPLATES.find(t => t.id === port.id);

            if (!template) {
                const error: IGetTemplateByIdError = {
                    code: "INVALID_ID",
                    message: `Template with id ${port.id} not found`
                };
                throw error;
            }

            return { template };
        }

        console.log('Fetching template by ID:', port.id);
        const response = await this._httpService.get<any>(`/api/Templates/${port.id}`);
        console.log('Template raw response:', response);
        
        // Если backend возвращает template напрямую (не обернутый), оборачиваем
        if (response && !response.template && response.id) {
            console.log('Response is template object directly, wrapping it');
            return { template: response };
        }
        
        return response as IGetTemplateResponse;
    }

    // Получение всех шаблонов с фильтрацией
    public async getTemplates(): Promise<IGetTemplatesResponse> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 300));

            return {
                templates: STUB_TEMPLATES,
            };
        }

        console.log('Fetching templates from /api/Templates...');
        
        try {
            const response = await this._httpService.get<IGetTemplatesResponse>('/api/Templates');
            console.log('Templates raw response:', response);
            
            // Проверяем формат ответа
            if (Array.isArray(response)) {
                console.log('Response is array, wrapping in object');
                return { templates: response as any };
            }
            
            return response;
        } catch (error) {
            console.error('Error fetching templates:', error);
            throw error;
        }
    }
}

export {TemplateRepository }