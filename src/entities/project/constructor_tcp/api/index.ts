import type {
    IBlockDto,
    IGenerateResultDto,
    IPresentationDto,
    ISlideDto
} from "@entities/project/constructor_tcp/interface/dto.ts";
import {BaseRepository} from "@shared/api/http/BaseRepository.ts";
import type {IConstructorTcpRepository} from "@entities/project/constructor_tcp/interface/repository.ts";
import type {
    ICreatePresentationPort, ICreateSlidePort,
    IModifySlidePort,
    IUpdateBlockPort
} from "@entities/project/constructor_tcp/interface/port.ts";
import {IS_STUB as isStub} from "@shared/api/const";

//function getStubPresentation(id: string, name?: string): IPresentationDto {
//    return {
//        id,
//        name: name || `ТКП ${id}`,
//        createdAt: new Date().toISOString()
//    };
//}un

function getStubSlide(presentationId: string, slideId: string, order: number): ISlideDto {
    return {
        id: slideId,
        presentationId,
        order,
        blocks: []
    };
}

function getStubBlock(slideId: string, blockId: string): IBlockDto {
    return {
        id: blockId,
        slideId,
        type: 'text',
        key: 'default',
        value: { text: 'Текст по умолчанию' },
        position: { x: 0, y: 0 },
        size: { w: 100, h: 50 }
    };
}



class ConstructorTcpRepository extends BaseRepository implements IConstructorTcpRepository {

    // Создание презентации (ТКП)
    public async createPresentation(request: ICreatePresentationPort): Promise<IPresentationDto> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const stubPresentation: IPresentationDto = {
                id: 'pres-' + Date.now(),
                name: request.name,
                createdAt: new Date().toISOString()
            };

            return Promise.resolve(stubPresentation);
        }

        return await this._httpService.post<IPresentationDto>('/api/Presentations', {
            body: request,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    // Создание слайда в презентации
    public async createSlide(presentationId: string, port: ICreateSlidePort): Promise<ISlideDto> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 500));

            const stubSlide: ISlideDto = {
                id: 'slide-' + Date.now(),
                presentationId,
                order: 1, // В реальности сервер сам определяет order
                blocks: []
            };

            return Promise.resolve(stubSlide);
        }

        return await this._httpService.post<ISlideDto>(
            `/api/Presentations/${presentationId}/slides`,
            {
                body: port,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
    }

    // Получение всех слайдов презентации
    public async getSlides(presentationId: string): Promise<ISlideDto[]> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 500));

            const stubSlides: ISlideDto[] = [
                getStubSlide(presentationId, 'slide-1', 1),
                getStubSlide(presentationId, 'slide-2', 2),
                getStubSlide(presentationId, 'slide-3', 3)
            ];

            return Promise.resolve(stubSlides);
        }

        return await this._httpService.get<ISlideDto[]>(
            `/api/Presentations/${presentationId}/slides`
        );
    }

    // Получение конкретного слайда
    public async getSlideById(presentationId: string, slideId: string): Promise<ISlideDto> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 300));

            const stubSlide = getStubSlide(presentationId, slideId, 1);

            // Добавляем блоки для мока
            if (slideId === 'slide-1') {
                stubSlide.blocks = [
                    {
                        ...getStubBlock(slideId, 'block-1'),
                        type: 'title',
                        key: 'main_title',
                        value: { text: 'Заголовок презентации' },
                        position: { x: 50, y: 50 },
                        size: { w: 500, h: 100 }
                    },
                    {
                        ...getStubBlock(slideId, 'block-2'),
                        type: 'text',
                        key: 'description',
                        value: { text: 'Описание проекта' },
                        position: { x: 50, y: 200 },
                        size: { w: 500, h: 150 }
                    }
                ];
            }

            return Promise.resolve(stubSlide);
        }

        return await this._httpService.get<ISlideDto>(
            `/api/Presentations/${presentationId}/slides/${slideId}`
        );
    }

    // Модификация слайда (добавление/удаление блоков)
    public async modifySlide(
        presentationId: string,
        slideId: string,
        request: IModifySlidePort
    ): Promise<ISlideDto> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 500));

            const stubSlide = getStubSlide(presentationId, slideId, 1);

            // Имитация добавления/удаления блоков
            if (request.action === 'add_block' && request.block) {
                stubSlide.blocks.push({
                    ...getStubBlock(slideId, 'block-' + Date.now()),
                    type: request.block.type,
                    key: request.block.key,
                    value: request.block.value || {},
                    position: request.block.position,
                    size: request.block.size
                });
            } else if (request.action === 'remove_block' && request.blockId) {
                stubSlide.blocks = stubSlide.blocks.filter(block => block.id !== request.blockId);
            } else if (request.action === 'add_block_from_template' && request.templateBlockId) {
                // Имитация добавления блока из шаблона
                stubSlide.blocks.push({
                    ...getStubBlock(slideId, 'block-' + Date.now()),
                    type: 'template',
                    key: 'template_block',
                    value: { templateId: request.templateBlockId },
                    position: { x: 100, y: 100 },
                    size: { w: 300, h: 200 }
                });
            }

            return Promise.resolve(stubSlide);
        }

        return await this._httpService.patch<ISlideDto>(
            `/api/Presentations/${presentationId}/slides/${slideId}`,
            {
                body: request,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
    }

    // Обновление блока (редактирование)
    public async updateBlock(
        presentationId: string,
        slideId: string,
        blockId: string,
        request: IUpdateBlockPort
    ): Promise<IBlockDto> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 300));

            const stubBlock = getStubBlock(slideId, blockId);

            // Обновляем значения блока
            const updatedBlock: IBlockDto = {
                ...stubBlock,
                value: request.value || stubBlock.value,
                position: request.position || stubBlock.position,
                size: request.size || stubBlock.size
            };

            return Promise.resolve(updatedBlock);
        }

        return await this._httpService.patch<IBlockDto>(
            `/api/Presentations/${presentationId}/slides/${slideId}/blocks/${blockId}`,
            {
                body: request,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
    }

    // Генерация ТКП
    public async generatePresentation(presentationId: string): Promise<IGenerateResultDto> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const stubResult: IGenerateResultDto = {
                fileUrl: `https://example.com/presentations/${presentationId}/generated.pdf`
            };

            return Promise.resolve(stubResult);
        }

        return await this._httpService.post<IGenerateResultDto>(
            `/api/Presentations/${presentationId}/generate`,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
    }
}

export { ConstructorTcpRepository };
