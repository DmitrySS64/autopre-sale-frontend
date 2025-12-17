import {
    type IBlockItem,
    type IBlockListProps, type IFieldProps,
    type ISlideItem,
    type ISlideListProps
} from "@shared/components/constructor_tcp/block_list";
import {useBlockList} from "@pages/project_page/constructor-tcp_page/presenter/useBlockList.tsx";
import React, {useCallback, useMemo, useState} from "react";
import {ICON_PATH} from "@shared/components/images/icons";
import {useContextMenu} from "@widgets/context_menu/use-case";
import {useGetAllTemplates} from "@entities/block_template/query";
import type {ITemplateDto} from "@entities/block_template/interface/index.dto.ts";
import type {IBlockEditorProps} from "@pages/project_page/constructor-tcp_page/component/blockEditor.tsx";
import type {IAccordionTKP} from "@shared/components/modal_tkp/component/AccordionTKP.tsx";
import {useAlert} from "@widgets/alert/use-case";
import {useConstructorTcpQueries} from "@entities/project/constructor_tcp/queries";
import {useProjectContext} from "@entities/project/api/useContext";
import type {IBlockDto, ISlideDto} from "@entities/project/constructor_tcp/interface/dto.ts";
import type {IModifySlidePort, IUpdateBlockPort} from "@entities/project/constructor_tcp/interface/port.ts";
import {EAlertType} from "@shared/enum/alert";


// Вспомогательная функция для конвертации ISlideDto в ISlideItem
const convertSlideDtoToItem = (slideDto: ISlideDto): ISlideItem => {
    return {
        id: slideDto.id,
        title: `Слайд ${slideDto.order}`,
        order: slideDto.order,
        blocks: slideDto.blocks.map(block => convertBlockDtoToItem(block))
    };
};

// Вспомогательная функция для конвертации IBlockDto в IBlockItem
const convertBlockDtoToItem = (blockDto: IBlockDto): IBlockItem => {
    // Преобразуем value в fields
    const fields: IFieldProps[] = Object.entries(blockDto.value || {}).map(([key, value], index) => ({
        id: `${blockDto.id}-${key}-${index}`,
        name: key,
        label: key.charAt(0).toUpperCase() + key.slice(1), // Делаем первую букву заглавной
        value: typeof value === 'string' ? value : JSON.stringify(value),
        type: 'text', // По умолчанию text, можно определить по типу данных
        required: false
    }));

    return {
        id: blockDto.id,
        title: blockDto.key || 'Блок',
        templateId: blockDto.type,
        templateCode: blockDto.type,
        fields
    };
};

// Обратное преобразование - для отправки на сервер
const convertBlockItemToUpdateRequest = (block: IBlockItem): IUpdateBlockPort => {
    const value: Record<string, unknown> = {};

    if (block.fields) {
        block.fields.forEach(field => {
            value[field.name] = field.value;
        });
    }

    return {
        value,
        position: { x: 0, y: 0 }, // Можно добавить логику для позиции
        size: { w: 100, h: 100 } // Можно добавить логику для размера
    };
};


// Функция для создания блока из шаблона
const createBlockFromTemplateForApi = (template: ITemplateDto): IModifySlidePort['block'] => {
    // Создаем начальные значения из полей шаблона
    const initialValues: Record<string, unknown> = {};
    Object.entries(template.fields).forEach(([fieldName, fieldConfig]) => {
        initialValues[fieldName] = fieldConfig.defaultValue || '';
    });

    return {
        type: template.code,
        key: template.name,
        value: initialValues,
        position: { x: 0, y: 0 },
        size: { w: 300, h: 200 }
    };
};


const useConstructorPagePresenter = () => {
    const { showAlert } = useAlert()
    const { showContextMenu } = useContextMenu();
    const {data: templatesList, isLoading: isLoadingTemplates } = useGetAllTemplates()
    const {state: projectState} = useProjectContext()
    const {
        slides: apiSlides,
        updateBlock: apiUpdateBlock,
        createSlide: apiCreateSlide,
        generatePresentation: apiGeneratePresentation,
        modifySlide: apiModifySlide,
    } = useConstructorTcpQueries(projectState.projectId)

    const initialSlideList: ISlideItem[] =  useMemo(() =>[
        {
            id: '1',
            title: 'Слайд 1',
            order: 1,
            blocks: [
                {
                    id: '1',
                    title: 'Описание проекта',
                    templateId: '1',
                    templateCode: 'project_overview_v1',
                    fields: [
                        {
                            id: 'field-1',
                            name: 'title',
                            label: 'Заголовок',
                            value: '',
                            type: 'text',
                            required: true,
                            placeholderName: 'TitlePlaceholder'
                        },
                        {
                            id: 'field-2',
                            name: 'description',
                            label: 'Описание',
                            value: '',
                            type: 'textarea',
                            placeholderName: 'Body'
                        }
                    ]
                },{
                    id: '2',
                    title: 'Цель проекта',
                    templateId: '2',
                    templateCode: 'project_goals_v1',
                    fields: [
                        {
                            id: 'field-3',
                            name: 'title',
                            label: 'Заголовок',
                            value: '',
                            type: 'text',
                            placeholderName: 'Title'
                        },
                        {
                            id: 'field-4',
                            name: 'goal1',
                            label: 'Цель 1',
                            value: '',
                            type: 'text',
                            placeholderName: 'Goal1'
                        }
                    ]
                }
            ]
        },{
            id: '2',
            title: 'Слайд 2',
            order: 2,
            blocks: [
                {
                    id: '3',
                    title: 'Техническое решение',
                    templateId: '2',
                    templateCode: 'project_goals_v1',
                    fields: [
                        {
                            id: 'field-5',
                            name: 'title',
                            label: 'Заголовок',
                            value: '',
                            type: 'text',
                        },
                        {
                            id: 'field-6',
                            name: 'architecture',
                            label: 'Цель 1',
                            value: '',
                            type: 'textarea',
                        },
                        {
                            id: 'field-7',
                            name: 'technologies',
                            label: 'Цель 1',
                            value: '',
                            type: 'text',
                        },
                        {
                            id: 'field-8',
                            name: 'requirements',
                            label: 'Цель 1',
                            value: '',
                            type: 'textarea',
                        }
                    ]
                }
            ]
        }
    ], []);

    const convertedInitialList = useMemo(() => {
        if (!apiSlides || apiSlides.length === 0) {
            // Возвращаем заглушку если данных нет
            return initialSlideList;
        }

        return apiSlides.map(slide => convertSlideDtoToItem(slide));
    }, [apiSlides, initialSlideList]);

    //const [targetSlideForBlock, setTargetSlideForBlock] = useState<string | null>(null);

    const {
        list,
        moveBlock,
        selectBlock,
        selectSlide,
        handleDeleteBlock,
        handleDeleteSlide,
        handleAddSlide,
        activeSlide,
        activeBlock,
        addBlockFromTemplate: addBlockFromTemplateLocal,
        activeSlideId,
        groupedTemplates,
        updateBlock,
        setHasChanges
    } = useBlockList({
        initialList: convertedInitialList,
        availableTemplates: templatesList?.templates
    })

    const [showTemplateModal, setShowTemplateModal] = useState(false);

    const handleCreateSlide = useCallback(async (relativeSlideId?: string) => {
        apiCreateSlide({
            slideId: relativeSlideId,
        }, {
            onSuccess: () => {
                handleAddSlide(relativeSlideId);
                showAlert('Слайд создан', EAlertType.SUCCESS);
            },
            onError: (error) => {
                console.error('Ошибка при создании слайда:', error);
                showAlert('Ошибка при создании слайда', EAlertType.ERROR);
            }
        });
    }, [apiCreateSlide, handleAddSlide, showAlert]);


    const handleSlideContextMenu = useCallback((e: React.MouseEvent, slideId: string, name: string)=>{
        e.preventDefault()
        e.stopPropagation()
        showContextMenu({
            position:{ x: e.clientX, y: e.clientY },
            items: [
                {
                    id: 'addSlide',
                    label: `Создать слайд ниже`,
                    icon: ICON_PATH.ADD,
                    onClick: () => handleCreateSlide(slideId)
                }, {
                    id: 'deleteSlide',
                    label: `Удалить слайд ${name}`,
                    icon: ICON_PATH.DELETE,
                    onClick: () => handleDeleteSlide(slideId),
                    disabled: list.length <= 1 // Нельзя удалить последний слайд
                }
            ]
        })
    }, [handleCreateSlide, handleDeleteSlide, list.length, showContextMenu])

    const handleBlockContextMenu = useCallback((e: React.MouseEvent, blockId: string, slideId: string, blockName?: string) => {
        e.preventDefault();
        e.stopPropagation();

        showContextMenu({
            position: {
                x: e.clientX,
                y: e.clientY
            },
            items: [
                {
                    id: 'delete-block',
                    label: `Удалить блок "${blockName ?? blockId}"`,
                    icon: ICON_PATH.DELETE,
                    onClick: () => handleDeleteBlock(blockId, slideId)
                }
            ]
        });
    }, [handleDeleteBlock, showContextMenu]);

    // Обработчик добавления блока из шаблона через API
    const handleAddBlockFromTemplate = useCallback(async (template: ITemplateDto) => {
        try {
            const slideId = activeSlideId;

            if (!slideId) {
                showAlert('Выберите слайд для добавления блока', EAlertType.WARNING);
                return;
            }

            // Создаем блок для API
            const blockData = createBlockFromTemplateForApi(template);

            // Отправляем запрос на сервер
            const response = await apiModifySlide({
                slideId,
                request: {
                    action: 'add_block',
                    block: blockData
                }
            });

            // Находим созданный блок в ответе
            const createdBlock = response.blocks.find(b =>
                b.type === template.code && b.key === template.name
            );

            if (createdBlock) {
                // Преобразуем в формат UI и добавляем в локальное состояние
                const blockItem = convertBlockDtoToItem(createdBlock);
                addBlockFromTemplateLocal(template);

                // Выбираем созданный блок
                selectBlock(blockItem.id, slideId);

                showAlert('Блок добавлен', EAlertType.SUCCESS);
            }

            setShowTemplateModal(false);
            sessionStorage.removeItem('targetSlideForTemplate');
            //setTargetSlideForBlock(null);

        } catch (error) {
            console.error('Ошибка при добавлении блока:', error);
            showAlert('Ошибка при добавлении блока', EAlertType.ERROR);
        }
    }, [activeSlideId, apiModifySlide, addBlockFromTemplateLocal, selectBlock, showAlert]);


    const handleBlockSave = useCallback((blockId: string, slideId: string, updates: Partial<IBlockItem>) => {

        // Обновляем в локальном состоянии
        updateBlock(slideId, blockId, updates);

        // Отправляем на сервер
        const updateRequest = convertBlockItemToUpdateRequest({
            ...activeBlock!,
            ...updates
        });

        apiUpdateBlock({
            slideId,
            blockId,
            updates: updateRequest
        }, {
            onSuccess: ()=> {
                showAlert('Изменения сохранены (сервер)', EAlertType.SUCCESS);
            },
            onError: (error) => {
                console.error('Ошибка при сохранении блока:', error);
                showAlert('Ошибка при сохранении блока', EAlertType.ERROR);
            }
        });

    }, [activeBlock, apiUpdateBlock, showAlert, updateBlock]);

    // Обработчик генерации ТКП
    const handleGeneratePresentation = useCallback(async () => {
        apiGeneratePresentation(undefined, {
            onSuccess: (data) => {
                showAlert('ТКП успешно сгенерировано', EAlertType.SUCCESS);
                window.open(data.fileUrl, '_blank');
            },
            onError: (error) => {
                console.error('Ошибка при генерации ТКП:', error);
                showAlert('Ошибка при генерации ТКП', EAlertType.ERROR);
            }
        })
    }, [apiGeneratePresentation, showAlert]);

    // Обработчик перемещения блока
    const handleMoveBlock = useCallback(async (blockId: string, targetSlideId: string, targetIndex?: number) => {
        try {
            // Сначала перемещаем в локальном состоянии
            moveBlock(blockId, targetSlideId, targetIndex);

            // TODO: Добавить API для перемещения блоков, если есть в спецификации
            showAlert('Блок перемещен', EAlertType.SUCCESS);
        } catch (error) {
            console.error('Ошибка при перемещении блока:', error);
            showAlert('Ошибка при перемещении блока', EAlertType.ERROR);
        }
    }, [moveBlock, showAlert]);

    const handleUnsavedChanges = useCallback((hasChanges: boolean) => {
        setHasChanges(hasChanges);
    }, [setHasChanges]);


    const blockListProps = useMemo<IBlockListProps>(() => ({
        list,
        onSelectSlide: selectSlide,
        onSelectBlock: selectBlock,
        onDrop: handleMoveBlock,
        handleBlockContextMenu,
        handleSlideContextMenu
    }), [list, selectSlide, selectBlock, handleMoveBlock, handleBlockContextMenu, handleSlideContextMenu]);

    const slideListProps = useMemo<ISlideListProps>(()=>({
        list,
        onSelectSlide: selectSlide,
        handleSlideContextMenu: handleSlideContextMenu
    }), [handleSlideContextMenu, list, selectSlide]);

    const blockEditorProps = useMemo<IBlockEditorProps>(() => ({
        activeBlock,
        activeSlideId,
        onSave: handleBlockSave,
        onUnsavedChanges: handleUnsavedChanges
    }), [activeBlock, activeSlideId, handleBlockSave, handleUnsavedChanges])
    
    const modalTemplatesProps = useMemo<IAccordionTKP>(()=> ({
        groupedTemplates,
        addBlock: handleAddBlockFromTemplate,
        isLoading: isLoadingTemplates
    }), [groupedTemplates, handleAddBlockFromTemplate, isLoadingTemplates])
    
    return {
        blockListProps,
        slideListProps,
        blockEditorProps,
        modalTemplatesProps,
        activeSlide,
        showTemplateModal, setShowTemplateModal,
        handleGeneratePresentation,
    };
}

export {useConstructorPagePresenter};