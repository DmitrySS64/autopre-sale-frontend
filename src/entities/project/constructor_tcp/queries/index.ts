import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {ConstructorTcpRepository} from "@entities/project/constructor_tcp/api";
import {HTTP_APP_SERVICE} from "@shared/services/http/HttpAppService.ts";
import type {
    ICreateSlidePort,
    IModifySlidePort,
    IUpdateBlockPort
} from "@entities/project/constructor_tcp/interface/port.ts";


const useConstructorTcpQueries = (presentationId?: string) => {
    const repository = new ConstructorTcpRepository(HTTP_APP_SERVICE);
    const queryClient = useQueryClient();

    // Получение слайдов
    const { data: slides, isLoading: isLoadingSlides } = useQuery({
        queryKey: ['presentation-slides', presentationId],
        queryFn: () => repository.getSlides(presentationId!),
        enabled: !!presentationId,
    });

    // Редактирование блока
    const { mutate: updateBlock } = useMutation({
        mutationKey: ['constructor-tcp:', 'updateBlock'],
        mutationFn: ({
                         slideId,
                         blockId,
                         updates
                     }: {
            slideId: string;
            blockId: string;
            updates: IUpdateBlockPort;
        }) => repository.updateBlock(presentationId!, slideId, blockId, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['presentation-slides', presentationId] });
        }
    });

    // Модификация слайда (добавление/удаление блоков)
    const { mutateAsync: modifySlide } = useMutation({
        mutationKey: ['constructor-tcp:', 'modifySlide'],
        mutationFn: ({
                         slideId,
                         request
                     }: {
            slideId: string;
            request: IModifySlidePort;
        }) => repository.modifySlide(presentationId!, slideId, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['presentation-slides', presentationId] });
        }
    });

    // Создание слайда
    const { mutate: createSlide } = useMutation({
        mutationKey: ['constructor-tcp:', 'createSlide'],
        mutationFn: (port: ICreateSlidePort) => repository.createSlide(presentationId!, port),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['presentation-slides', presentationId] });
        }
    });

    // Генерация ТКП
    const { mutate: generatePresentation,  isPending: isGenerating } = useMutation({
        mutationKey: ['constructor-tcp:', 'generatePresentation'],
        mutationFn: () => repository.generatePresentation(presentationId!)
    });

    // Добавление блока
    const { mutate: addBlock } = useMutation({
        mutationKey: ['constructor-tcp:', 'addBlock'],
        mutationFn: ({
                         slideId,
                         blockData
                     }: {
            slideId: string;
            blockData: IModifySlidePort['block'];
        }) => repository.modifySlide(presentationId!, slideId, {
            action: 'add_block',
            block: blockData
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['presentation-slides', presentationId] });
        }
    });

    return {
        slides,
        isLoadingSlides,
        updateBlock,
        createSlide,
        addBlock,
        modifySlide,
        generatePresentation,
        isGenerating
    };
};

export {useConstructorTcpQueries}