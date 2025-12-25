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
import {useGetAllTemplates, useGetTemplateById} from "@entities/block_template/query";
import type {ITemplateDto} from "@entities/block_template/interface/index.dto.ts";
import type {IBlockEditorProps} from "@pages/project_page/constructor-tcp_page/component/blockEditor.tsx";
import type {IAccordionTKP} from "@shared/components/modal_tkp/component/AccordionTKP.tsx";
import {useAlert} from "@widgets/alert/use-case";
import {useConstructorTcpQueries} from "@entities/project/constructor_tcp/queries";
import {useProjectContext} from "@entities/project/api/useContext";
import type {IBlockDto, ISlideDto} from "@entities/project/constructor_tcp/interface/dto.ts";
import type {IUpdateBlockPort} from "@entities/project/constructor_tcp/interface/port.ts";
import {EAlertType} from "@shared/enum/alert";


// Вспомогательная функция для конвертации ISlideDto в ISlideItem
const convertSlideDtoToItem = (slideDto: ISlideDto, templatesMap: Map<string, ITemplateDto>): ISlideItem => {
    // Проверяем, что slideDto существует
    if (!slideDto) {
        console.error('convertSlideDtoToItem: slideDto is undefined');
        throw new Error('Slide data is undefined');
    }

    const blocks = slideDto.blocks || [];
    return {
        id: slideDto.id,
        title: `Слайд ${slideDto.orderIndex + 1}`,
        order: slideDto.orderIndex + 1, // Начинаем с 1, а не с 0
        blocks: Array.isArray(blocks) ? blocks.map(block => {
            const template = templatesMap.get(block.templateBlockId);
            return convertBlockDtoToItem(block, template?.name);
        }) : []
    };
};

// Вспомогательная функция для конвертации IBlockDto в IBlockItem
// Временно создаем поля из values, полная информация будет загружена при выборе блока
const convertBlockDtoToItem = (blockDto: IBlockDto, templateName?: string): IBlockItem => {
    // Проверяем, что blockDto существует
    if (!blockDto) {
        console.error('convertBlockDtoToItem: blockDto is undefined');
        throw new Error('Block data is undefined');
    }

    console.log('=== CONVERTING BLOCK DTO ===');
    console.log('Block DTO:', blockDto);
    console.log('Template name:', templateName);

    // Преобразуем values в fields (временные, без типов из шаблона)
    const values = blockDto.values || [];
    console.log('Block values:', values);
    
    const fields: IFieldProps[] = Array.isArray(values) 
        ? values.map((valueDto, index) => {
            const field = {
                id: `${blockDto.id}-${valueDto.fieldKey}-${index}`,
                name: valueDto.fieldKey,
                label: valueDto.fieldKey.charAt(0).toUpperCase() + valueDto.fieldKey.slice(1),
                value: typeof valueDto.value === 'string' ? valueDto.value : JSON.stringify(valueDto.value),
                type: 'text' as const,
                required: false
            };
            console.log('Converted value to field:', field);
            return field;
        })
        : [];

    console.log('Total fields:', fields.length);

    const result = {
        id: blockDto.id,
        title: templateName || `Блок ${(blockDto.positionIndex ?? 0) + 1}`,
        templateId: blockDto.templateBlockId,
        templateCode: blockDto.templateBlockId,
        fields
    };
    
    console.log('Block item result:', result);
    return result;
};

// Обратное преобразование - для отправки на сервер
const convertBlockItemToUpdateRequest = (block: IBlockItem): IUpdateBlockPort => {
    const values: Record<string, unknown> = {};

    if (block.fields) {
        block.fields.forEach(field => {
            values[field.name] = field.value;
        });
    }

    return {
        values
    };
};

// Маппинг типов полей из шаблона в типы UI
const mapTemplateTypeToFieldType = (templateType: string): IFieldProps['type'] => {
    switch (templateType.toLowerCase()) {
        case 'title':
        case 'text':
            return 'text';
        case 'textarea':
        case 'paragraph':
            return 'textarea';
        case 'number':
            return 'number';
        case 'list':
            return 'list';
        case 'select':
            return 'select';
        case 'checkbox':
            return 'checkbox';
        default:
            return 'text';
    }
};


const useConstructorPagePresenter = () => {
    const { showAlert } = useAlert()
    const { showContextMenu } = useContextMenu();
    const {data: templatesList, isLoading: isLoadingTemplates, error: templatesError } = useGetAllTemplates()
    const {state: projectState} = useProjectContext()
    
    // Создаем карту шаблонов для быстрого доступа к названиям
    const templatesMap = useMemo(() => {
        const map = new Map<string, ITemplateDto>();
        if (templatesList?.templates) {
            templatesList.templates.forEach(template => {
                map.set(template.id, template);
            });
        }
        console.log('Templates map created with', map.size, 'templates');
        return map;
    }, [templatesList]);
    
    // Логируем состояние загрузки шаблонов
    React.useEffect(() => {
        console.log('Templates loading state:', { 
            isLoading: isLoadingTemplates, 
            hasData: !!templatesList, 
            templatesCount: templatesList?.templates?.length,
            error: templatesError
        });
    }, [isLoadingTemplates, templatesList, templatesError]);
    
    // State для presentationId с сохранением в localStorage
    const [presentationId, setPresentationId] = React.useState<string | undefined>(() => {
        // Проверяем, есть ли сохраненный presentationId для текущего проекта
        if (projectState.projectId) {
            const storageKey = `presentation_${projectState.projectId}`;
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                console.log('Loaded presentationId from localStorage:', saved);
                return saved;
            }
        }
        return undefined;
    });
    const [isInitializing, setIsInitializing] = React.useState(false);
    
    const {
        slides: apiSlides,
        updateBlock: apiUpdateBlock,
        createSlide: apiCreateSlide,
        generatePresentation: apiGeneratePresentation,
        downloadPresentation: apiDownloadPresentation,
        modifySlide: apiModifySlide,
        createPresentation,
        isCreatingPresentation,
        deleteSlide: apiDeleteSlide,
        deleteBlock: apiDeleteBlock
    } = useConstructorTcpQueries(presentationId, projectState.projectId)
    
    // Сохраняем presentationId в localStorage при изменении
    React.useEffect(() => {
        if (presentationId && projectState.projectId) {
            const storageKey = `presentation_${projectState.projectId}`;
            localStorage.setItem(storageKey, presentationId);
            console.log('Saved presentationId to localStorage:', presentationId);
        }
    }, [presentationId, projectState.projectId]);
    
    // Автоматически создаем презентацию при первом входе
    React.useEffect(() => {
        console.log('Constructor useEffect check:', {
            presentationId,
            projectId: projectState.projectId,
            isInitializing,
            isCreatingPresentation,
            shouldCreate: !presentationId && projectState.projectId && !isInitializing && !isCreatingPresentation
        });
        
        if (!presentationId && projectState.projectId && !isInitializing && !isCreatingPresentation) {
            console.log('Creating new presentation for project:', projectState.projectId);
            setIsInitializing(true);
            
            createPresentation({
                projectId: projectState.projectId,
                name: `ТКП для проекта`
            }).then(async (newPresentation) => {
                console.log('Presentation created:', newPresentation);
                setPresentationId(newPresentation.id);
                
                // Создаем первый пустой слайд автоматически
                // Небольшая задержка, чтобы presentationId успел сохраниться
                setTimeout(() => {
                    apiCreateSlide({
                        slideId: undefined,
                    }, {
                        onSuccess: () => {
                            console.log('First slide created automatically');
                            showAlert('Создана новая презентация с первым слайдом', EAlertType.SUCCESS);
                        },
                        onError: (error) => {
                            console.error('Failed to create first slide:', error);
                            showAlert('Презентация создана, но не удалось создать первый слайд', EAlertType.WARNING);
                        }
                    });
                }, 100);
            }).catch((error) => {
                console.error('Failed to create presentation:', error);
                showAlert('Ошибка создания презентации', EAlertType.ERROR);
            }).finally(() => {
                setIsInitializing(false);
            });
        }
    }, [presentationId, projectState.projectId, isInitializing, isCreatingPresentation, createPresentation, apiCreateSlide, showAlert]);

    // Пустой начальный список - данные будут загружены с API
    const convertedInitialList = useMemo(() => {
        console.log('Converting slides from API:', {
            apiSlides,
            slidesCount: apiSlides?.length,
            presentationId,
            templatesMapSize: templatesMap.size
        });
        
        if (!apiSlides || !Array.isArray(apiSlides) || apiSlides.length === 0) {
            console.log('No slides from API, returning empty array');
            return [];
        }

        try {
            const converted = apiSlides
                .filter(slide => slide != null) // Фильтруем null/undefined слайды
                .map(slide => convertSlideDtoToItem(slide, templatesMap));
            console.log('Converted slides:', converted);
            return converted;
        } catch (error) {
            console.error('Error converting slides:', error, apiSlides);
            return [];
        }
    }, [apiSlides, presentationId, templatesMap]);

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
        updateBlock
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

    const handleDeleteSlideWithApi = useCallback((slideId: string) => {
        console.log('Deleting slide:', slideId);
        
        apiDeleteSlide({ slideId }, {
            onSuccess: () => {
                // Удаляем из локального состояния
                handleDeleteSlide(slideId);
                showAlert('Слайд удален', EAlertType.SUCCESS);
            },
            onError: (error) => {
                console.error('Ошибка при удалении слайда:', error);
                showAlert('Ошибка при удалении слайда', EAlertType.ERROR);
            }
        });
    }, [apiDeleteSlide, handleDeleteSlide, showAlert]);


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
                    onClick: () => handleDeleteSlideWithApi(slideId),
                    disabled: list.length <= 1 // Нельзя удалить последний слайд
                }
            ]
        })
    }, [handleCreateSlide, handleDeleteSlideWithApi, list.length, showContextMenu])

    const handleDeleteBlockWithApi = useCallback((blockId: string, slideId: string) => {
        console.log('Deleting block:', blockId, 'from slide:', slideId);
        
        apiDeleteBlock({ slideId, blockId }, {
            onSuccess: () => {
                // Удаляем из локального состояния
                handleDeleteBlock(blockId, slideId);
                showAlert('Блок удален', EAlertType.SUCCESS);
            },
            onError: (error) => {
                console.error('Ошибка при удалении блока:', error);
                showAlert('Ошибка при удалении блока', EAlertType.ERROR);
            }
        });
    }, [apiDeleteBlock, handleDeleteBlock, showAlert]);

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
                    onClick: () => handleDeleteBlockWithApi(blockId, slideId)
                }
            ]
        });
    }, [handleDeleteBlockWithApi, showContextMenu]);

    // Обработчик добавления блока из шаблона через API
    const handleAddBlockFromTemplate = useCallback(async (template: ITemplateDto) => {
        try {
            console.log('handleAddBlockFromTemplate called:', {
                template,
                activeSlideId,
                listLength: list.length,
                list
            });

            // Если нет активного слайда, выбираем первый слайд
            let slideId = activeSlideId;
            if (!slideId && list.length > 0) {
                slideId = list[0].id;
                selectSlide(slideId);
                showAlert('Блок добавлен на первый слайд', EAlertType.INFO);
            }

            if (!slideId) {
                console.error('No slide available');
                showAlert('Нет доступных слайдов для добавления блока', EAlertType.WARNING);
                return;
            }

            console.log('Sending API request to add block:', { slideId, templateId: template.id });

            // Отправляем запрос на сервер
            const response = await apiModifySlide({
                slideId,
                request: {
                    addBlocks: [{ templateBlockId: template.id }]
                }
            });

            console.log('API response received:', response);

            // Проверяем, что ответ получен
            if (!response) {
                console.error('No response from server');
                showAlert('Не удалось получить ответ от сервера', EAlertType.ERROR);
                return;
            }

            console.log('Response blocks:', response.blocks);

            // Находим созданный блок в ответе
            const createdBlock = (response.blocks || []).find(b =>
                b.templateBlockId === template.id
            );

            console.log('Created block found:', createdBlock);

            if (createdBlock) {
                // Преобразуем в формат UI и добавляем в локальное состояние
                console.log('Converting block to item...');
                const blockItem = convertBlockDtoToItem(createdBlock, template.name);
                console.log('Block item:', blockItem);
                
                console.log('Adding block to local state...');
                addBlockFromTemplateLocal(template);

                // Выбираем созданный блок
                console.log('Selecting block:', blockItem.id, slideId);
                selectBlock(blockItem.id, slideId);

                showAlert('Блок добавлен', EAlertType.SUCCESS);
            } else {
                console.warn('Block created but not found in response');
                showAlert('Блок создан, но не найден в ответе', EAlertType.WARNING);
            }

            setShowTemplateModal(false);

        } catch (error) {
            console.error('Ошибка при добавлении блока:', error);
            showAlert('Ошибка при добавлении блока', EAlertType.ERROR);
        }
    }, [activeSlideId, list, selectSlide, apiModifySlide, addBlockFromTemplateLocal, selectBlock, showAlert]);


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

    // Обработчик генерации ТКП - автоматически скачивает презентацию
    const handleGeneratePresentation = useCallback(async () => {
        apiGeneratePresentation(undefined, {
            onSuccess: () => {
                showAlert('ТКП успешно сгенерировано', EAlertType.SUCCESS);
                
                // Автоматически скачиваем презентацию после генерации
                apiDownloadPresentation(undefined, {
                    onSuccess: (blob) => {
                        // Create download link
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `presentation_${projectState.projectData?.name || 'download'}.pptx`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                        showAlert('Презентация скачана', EAlertType.SUCCESS);
                    },
                    onError: (error) => {
                        console.error('Ошибка при скачивании презентации:', error);
                        showAlert('Ошибка при скачивании презентации', EAlertType.ERROR);
                    }
                });
            },
            onError: (error) => {
                console.error('Ошибка при генерации ТКП:', error);
                showAlert('Ошибка при генерации ТКП', EAlertType.ERROR);
            }
        })
    }, [apiGeneratePresentation, apiDownloadPresentation, showAlert, projectState.projectData?.name]);

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

    // Загружаем информацию о шаблоне для активного блока
    const {data: templateData} = useGetTemplateById(activeBlock?.templateId);
    
    // Логирование для отладки
    React.useEffect(() => {
        console.log('=== BLOCK EDITOR DEBUG ===');
        console.log('1. Active block:', activeBlock);
        console.log('2. Template ID:', activeBlock?.templateId);
        console.log('3. Template data from API:', templateData);
        console.log('4. Template object:', templateData?.template);
        console.log('5. Raw template:', templateData);
        console.log('6. Template fields:', templateData?.template?.fields);
        console.log('7. Existing block fields:', activeBlock?.fields);
    }, [activeBlock, templateData]);
    
    // Создаем обогащенный activeBlock с полями из шаблона
    const enrichedActiveBlock = useMemo(() => {
        console.log('=== ENRICHING ACTIVE BLOCK ===');
        console.log('Input activeBlock:', activeBlock);
        console.log('Input templateData:', templateData);
        
        if (!activeBlock) {
            console.log('No active block, returning null');
            return activeBlock;
        }
        
        // Проверяем, есть ли template в templateData
        const template: ITemplateDto | undefined = (templateData as any)?.template || (templateData as any);
        console.log('Template object:', template);
        console.log('Template fields:', template?.fields);
        
        if (!template || !template.fields || !Array.isArray(template.fields)) {
            console.log('No template data or fields, returning original activeBlock');
            console.log('template exists?', !!template);
            console.log('template.fields exists?', !!template?.fields);
            console.log('is array?', Array.isArray(template?.fields));
            return activeBlock;
        }
        
        console.log('Template loaded:', template.name, 'with', template.fields.length, 'fields');
        
        const existingValues = activeBlock.fields || [];
        console.log('Existing values:', existingValues);
        
        // Создаем карту существующих значений
        const valuesMap = new Map(existingValues.map(f => [f.name, f.value]));
        console.log('Values map:', Array.from(valuesMap.entries()));
        
        // Создаем поля на основе шаблона, заполняя значениями если они есть
        const enrichedFields: IFieldProps[] = template.fields
            .sort((a: any, b: any) => {
                // Используем order_index (snake_case) если orderIndex (camelCase) нет
                const aIndex = a.orderIndex ?? a.order_index ?? 0;
                const bIndex = b.orderIndex ?? b.order_index ?? 0;
                return aIndex - bIndex;
            })
            .map((templateField: any) => {
                const field = {
                    id: `${activeBlock.id}-${templateField.key}`,
                    name: templateField.key,
                    label: templateField.key.charAt(0).toUpperCase() + templateField.key.slice(1).replace(/_/g, ' '),
                    value: valuesMap.get(templateField.key) || '',
                    type: mapTemplateTypeToFieldType(templateField.type),
                    required: templateField.required,
                    placeholder: templateField.placeholder || `Введите ${templateField.key}`,
                };
                console.log('Created field:', field);
                return field;
            });
        
        console.log('Total enriched fields:', enrichedFields.length);
        
        const result = {
            ...activeBlock,
            title: template.name,
            fields: enrichedFields
        };
        
        console.log('Enriched block result:', result);
        return result;
    }, [activeBlock, templateData]);
    
    const blockEditorProps = useMemo<IBlockEditorProps>(() => ({
        activeBlock: enrichedActiveBlock,
        activeSlideId,
        onSave: handleBlockSave
    }), [enrichedActiveBlock, activeSlideId, handleBlockSave])
    
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