import type {
    IBlockDto,
    IGenerateResultDto,
    IPresentationDto,
    ISlideDto
} from "@entities/project/constructor_tcp/interface/dto.ts";
import {BaseRepository} from "@shared/api/http/BaseRepository.ts";
import type {IConstructorTcpRepository} from "@entities/project/constructor_tcp/interface/repository.ts";
import type {
    ICreatePresentationPort,
    ICreateSlidePort,
    IModifySlidePort,
    IUpdateBlockPort
} from "@entities/project/constructor_tcp/interface/port.ts";
import {IS_STUB as isStub} from "@shared/api/const";

// Stub helpers
function getStubSlide(presentationId: string, slideId: string, orderIndex: number): ISlideDto {
    return {
        id: slideId,
        presentationId,
        orderIndex,
        createdAt: new Date().toISOString(),
        blocks: []
    };
}

function getStubBlock(slideId: string, blockId: string, templateBlockId: string, positionIndex: number): IBlockDto {
    return {
        id: blockId,
        slideId,
        templateBlockId,
        positionIndex,
        createdAt: new Date().toISOString(),
        values: []
    };
}

class ConstructorTcpRepository extends BaseRepository implements IConstructorTcpRepository {

    // Создание презентации
    public async createPresentation(request: ICreatePresentationPort): Promise<IPresentationDto> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const stubPresentation: IPresentationDto = {
                id: 'pres-' + Date.now(),
                projectId: request.projectId,
                name: request.name,
                status: 'Draft',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            return Promise.resolve(stubPresentation);
        }

        return await this._httpService.post<IPresentationDto>('/api/presentations', {
            body: request,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    // Создание слайда
    public async createSlide(presentationId: string, _port: ICreateSlidePort): Promise<ISlideDto> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 500));

            return Promise.resolve(
                getStubSlide(presentationId, 'slide-' + Date.now(), 0)
            );
        }

        console.log('Creating slide via API for presentation:', presentationId);

        try {
            const response = await this._httpService.post<{slideId: string, orderIndex: number}>(
                `/api/presentations/${presentationId}/slides`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            console.log('Create slide API response:', response);

            // Преобразуем response в ISlideDto
            // Устанавливаем blocks как пустой массив, чтобы избежать undefined
            const slide: ISlideDto = {
                id: response.slideId,
                presentationId,
                orderIndex: response.orderIndex ?? 0,
                createdAt: new Date().toISOString(),
                blocks: [] // Явно пустой массив
            };

            console.log('Created slide DTO:', slide);
            return slide;
        } catch (error) {
            console.error('Error creating slide:', error);
            throw error;
        }
    }

    // Получение всех слайдов презентации
    public async getSlides(presentationId: string): Promise<ISlideDto[]> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 500));

            return Promise.resolve([
                getStubSlide(presentationId, 'slide-1', 0),
                getStubSlide(presentationId, 'slide-2', 1),
                getStubSlide(presentationId, 'slide-3', 2)
            ]);
        }

        console.log('Getting slides for presentation:', presentationId);
        
        try {
            // Получаем полную презентацию со слайдами
            const presentation = await this._httpService.get<IPresentationDto>(
                `/api/presentations/${presentationId}`
            );

            console.log('Presentation API response:', presentation);
            console.log('Slides from API:', presentation.slides);

            // Убеждаемся, что у каждого слайда есть массив blocks
            const slides = (presentation.slides || []).map(slide => ({
                ...slide,
                blocks: slide.blocks || [] // Гарантируем, что blocks всегда массив
            }));

            return slides;
        } catch (error) {
            console.error('Error getting slides:', error);
            throw error;
        }
    }

    // Получение конкретного слайда
    public async getSlideById(presentationId: string, slideId: string): Promise<ISlideDto> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 300));
            return Promise.resolve(getStubSlide(presentationId, slideId, 0));
        }

        const slides = await this.getSlides(presentationId);
        const slide = slides.find(s => s.id === slideId);
        
        if (!slide) {
            throw new Error('Slide not found');
        }

        // Убеждаемся, что blocks всегда массив
        return {
            ...slide,
            blocks: slide.blocks || []
        };
    }

    // Модификация слайда (добавление/удаление блоков)
    public async modifySlide(
        presentationId: string,
        slideId: string,
        request: IModifySlidePort
    ): Promise<ISlideDto> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 500));

            const stubSlide = getStubSlide(presentationId, slideId, 0);

            // Имитация добавления блоков
            if (request.addBlocks && request.addBlocks.length > 0) {
                if (!stubSlide.blocks) {
                    stubSlide.blocks = [];
                }
                request.addBlocks.forEach((block, index) => {
                    stubSlide.blocks!.push(
                        getStubBlock(slideId, 'block-' + Date.now() + '-' + index, block.templateBlockId, index)
                    );
                });
            }

            // Имитация удаления блоков
            if (request.removeBlocks && request.removeBlocks.length > 0) {
                stubSlide.blocks = (stubSlide.blocks || []).filter(
                    block => !request.removeBlocks!.includes(block.id)
                );
            }

            return Promise.resolve(stubSlide);
        }

        await this._httpService.patch(
            `/api/presentations/${presentationId}/slides/${slideId}`,
            {
                body: request,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        // Получаем обновленный слайд
        return await this.getSlideById(presentationId, slideId);
    }

    // Обновление значений блока
    public async updateBlock(
        presentationId: string,
        slideId: string,
        blockId: string,
        request: IUpdateBlockPort
    ): Promise<IBlockDto> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 300));

            const stubBlock = getStubBlock(slideId, blockId, 'stub-template', 0);
            
            // Создаем значения из request.values
            if (!stubBlock.values) {
                stubBlock.values = [];
            }
            Object.entries(request.values).forEach(([fieldKey, value]) => {
                stubBlock.values!.push({
                    id: 'value-' + Date.now(),
                    slideBlockId: blockId,
                    fieldKey,
                    value,
                    updatedAt: new Date().toISOString()
                });
            });

            return Promise.resolve(stubBlock);
        }

        await this._httpService.patch(
            `/api/presentations/${presentationId}/slides/${slideId}/blocks/${blockId}`,
            {
                body: request,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        // Получаем обновленный слайд и находим блок
        const slide = await this.getSlideById(presentationId, slideId);
        const block = (slide.blocks || []).find(b => b.id === blockId);
        
        if (!block) {
            throw new Error('Block not found');
        }

        return block;
    }

    // Удаление слайда
    public async deleteSlide(presentationId: string, slideId: string): Promise<void> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 300));
            return Promise.resolve();
        }

        await this._httpService.delete(
            `/api/presentations/${presentationId}/slides/${slideId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
    }

    // Удаление блока
    public async deleteBlock(presentationId: string, slideId: string, blockId: string): Promise<void> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 300));
            return Promise.resolve();
        }

        await this._httpService.delete(
            `/api/presentations/${presentationId}/slides/${slideId}/blocks/${blockId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
    }

    // Генерация презентации
    public async generatePresentation(presentationId: string): Promise<IGenerateResultDto> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const stubResult: IGenerateResultDto = {
                presentationId,
                fileUrl: `https://example.com/presentations/${presentationId}/generated.pptx`
            };

            return Promise.resolve(stubResult);
        }

        return await this._httpService.post<IGenerateResultDto>(
            `/api/presentations/${presentationId}/generate`,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
    }

    // Скачивание презентации
    public async downloadPresentation(presentationId: string): Promise<Blob> {
        if (isStub) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Return a fake blob for stub
            return Promise.resolve(new Blob(['fake presentation data'], { 
                type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' 
            }));
        }

        // Use the HTTP service's axios instance to download with proper auth handling
        const response = await this._httpService['_instance'].get(
            `/api/presentations/${presentationId}/download`,
            {
                responseType: 'blob'
            }
        );

        // Response interceptor returns data directly, so response is already the blob
        return response as unknown as Blob;
    }
}

export { ConstructorTcpRepository };
