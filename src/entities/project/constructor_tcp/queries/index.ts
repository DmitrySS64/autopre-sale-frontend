import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {ConstructorTcpRepository} from "@entities/project/constructor_tcp/api";
import {HTTP_APP_SERVICE} from "@shared/services/http/HttpAppService.ts";
import type {
    ICreateSlidePort,
    IModifySlidePort,
    IUpdateBlockPort,
    ICreatePresentationPort
} from "@entities/project/constructor_tcp/interface/port.ts";


const useConstructorTcpQueries = (presentationId?: string, _projectId?: string) => {
    const repository = new ConstructorTcpRepository(HTTP_APP_SERVICE);
    const queryClient = useQueryClient();

    // Получение слайдов
    const { data: slides, isLoading: isLoadingSlides } = useQuery({
        queryKey: ['presentation-slides', presentationId],
        queryFn: () => {
            console.log('Fetching slides for presentation:', presentationId);
            return repository.getSlides(presentationId!);
        },
        enabled: !!presentationId,
        staleTime: 0, // Всегда перезагружать данные
        refetchOnMount: true,
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
        mutationFn: (port: ICreateSlidePort) => {
            console.log('Creating slide for presentation:', presentationId, port);
            return repository.createSlide(presentationId!, port);
        },
        onSuccess: (data) => {
            console.log('Slide created successfully:', data);
            queryClient.invalidateQueries({ queryKey: ['presentation-slides', presentationId] });
        },
        onError: (error) => {
            console.error('Error creating slide:', error);
        }
    });

    // Генерация ТКП
    const { mutate: generatePresentation,  isPending: isGenerating } = useMutation({
        mutationKey: ['constructor-tcp:', 'generatePresentation'],
        mutationFn: () => repository.generatePresentation(presentationId!)
    });

    // Скачивание презентации
    const { mutate: downloadPresentation, isPending: isDownloading } = useMutation({
        mutationKey: ['constructor-tcp:', 'downloadPresentation'],
        mutationFn: () => repository.downloadPresentation(presentationId!)
    });

    // Добавление блока
    const { mutate: addBlock } = useMutation({
        mutationKey: ['constructor-tcp:', 'addBlock'],
        mutationFn: ({
                         slideId,
                         templateBlockId
                     }: {
            slideId: string;
            templateBlockId: string;
        }) => repository.modifySlide(presentationId!, slideId, {
            addBlocks: [{ templateBlockId }]
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['presentation-slides', presentationId] });
        }
    });

    // Создание презентации
    const { mutateAsync: createPresentation, isPending: isCreatingPresentation } = useMutation({
        mutationKey: ['constructor-tcp:', 'createPresentation'],
        mutationFn: (request: ICreatePresentationPort) => repository.createPresentation(request)
    });

    // Удаление слайда
    const { mutate: deleteSlide } = useMutation({
        mutationKey: ['constructor-tcp:', 'deleteSlide'],
        mutationFn: ({ slideId }: { slideId: string }) => repository.deleteSlide(presentationId!, slideId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['presentation-slides', presentationId] });
        }
    });

    // Удаление блока
    const { mutate: deleteBlock } = useMutation({
        mutationKey: ['constructor-tcp:', 'deleteBlock'],
        mutationFn: ({ slideId, blockId }: { slideId: string; blockId: string }) => 
            repository.deleteBlock(presentationId!, slideId, blockId),
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
        isGenerating,
        downloadPresentation,
        isDownloading,
        createPresentation,
        isCreatingPresentation,
        deleteSlide,
        deleteBlock
    };
};

export {useConstructorTcpQueries}