import type {ICreatePresentationPort, ICreateSlidePort, IModifySlidePort, IUpdateBlockPort} from "./port.ts";
import type {IBlockDto, IGenerateResultDto, IPresentationDto, ISlideDto} from "./dto.ts";

interface IConstructorTcpRepository {
    // Презентации
    createPresentation(request: ICreatePresentationPort): Promise<IPresentationDto>;
    generatePresentation(presentationId: string): Promise<IGenerateResultDto>;
    downloadPresentation(presentationId: string): Promise<Blob>;

    // Слайды
    createSlide(presentationId: string, port: ICreateSlidePort): Promise<ISlideDto>;
    getSlides(presentationId: string): Promise<ISlideDto[]>;
    getSlideById(presentationId: string, slideId: string): Promise<ISlideDto>;
    deleteSlide(presentationId: string, slideId: string): Promise<void>;
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
    deleteBlock(presentationId: string, slideId: string, blockId: string): Promise<void>;
}


export type {
    IConstructorTcpRepository
}