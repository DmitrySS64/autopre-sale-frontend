import type {ICreatePresentationPort, ICreateSlidePort, IModifySlidePort, IUpdateBlockPort} from "./port.ts";
import type {IBlockDto, IGenerateResultDto, IPresentationDto, ISlideDto} from "./dto.ts";

interface IConstructorTcpRepository {
    // Презентации
    createPresentation(request: ICreatePresentationPort): Promise<IPresentationDto>;
    generatePresentation(presentationId: string): Promise<IGenerateResultDto>;

    // Слайды
    createSlide(presentationId: string, port: ICreateSlidePort): Promise<ISlideDto>;
    getSlides(presentationId: string): Promise<ISlideDto[]>;
    getSlideById(presentationId: string, slideId: string): Promise<ISlideDto>;
    modifySlide(
        presentationId: string,
        slideId: string,
        request: IModifySlidePort
    ): Promise<ISlideDto>;

    // Блоки
    updateBlock(
        presentationId: string,
        slideId: string,
        blockId: string,
        request: IUpdateBlockPort
    ): Promise<IBlockDto>;
}


export type {
    IConstructorTcpRepository
}