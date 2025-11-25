import {useSidebarLayout} from "@widgets/sidebar/case/context";
import React, {type ChangeEvent, useCallback, useEffect, useRef, useState} from "react";
import {useAnalysisPageMutation, useAnalysisPageRequest} from "@pages/project_page/analysis-tz_page/request";
import type {ITableRowProps} from "@shared/components/table/interface";
import {useContextMenu} from "@widgets/context_menu/use-case";
import {useModal} from "@widgets/modal/use-case";
import {BacklogDeleteRowModal} from "@pages/project_page/analysis-tz_page/modal";
import type {
    IBacklogDTO,
    ITableFieldPropsDto,
    ITableRowPropsDto
} from "@entities/project/analysis_tz/interface";
import {useAlert} from "@widgets/alert/use-case";
import {EAlertType} from "@shared/enum/alert";
import {useUnsavedChanges} from "@shared/routes/hooks/useUnsavedChanges";
import {useRouteBlocker} from "@shared/routes/hooks/useRouteBlocker";
import {useProjectContext} from "@pages/project_page/provider";

const ALLOWED_FILE_TYPES = ['.doc', '.docx', '.pdf'];
const ALLOWED_MIME_TYPES = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf'
];

const useAnalysisTZPagePresenter = () => {
    const {state: projectState} = useProjectContext()

    const {setTitle} = useSidebarLayout()
    const {data} = useAnalysisPageRequest({projectId: projectState.projectId, enabled: true})
    const {uploadTZ, saveBacklog, downloadBacklog} = useAnalysisPageMutation()
    const {showContextMenu} = useContextMenu()
    const {showModal, closeModal} = useModal()
    const {showAlert} = useAlert()

    const [haveDocument, setHaveDocument] = useState(false)
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [tableData, setTableData] = useState<ITableRowProps[]>([]);
    const [initialData, setInitialData] = useState<ITableRowProps[]>([]);
    const [hasChanges, setHasChanges] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const lastSavedDataRef = useRef<ITableRowProps[]>([]);

    // Проверка формата файла
    const isValidFileType = useCallback((file: File): boolean => {
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        const isExtensionValid = ALLOWED_FILE_TYPES.includes(fileExtension || '');
        const isMimeTypeValid = ALLOWED_MIME_TYPES.includes(file.type);

        return isExtensionValid || isMimeTypeValid;
    }, []);

    const tableRowToDto = useCallback((row: ITableRowProps): ITableRowPropsDto => {
        return {
            workNumber: row.workNumber,
            level: row.level,
            rowValues: row.rowValues as ITableFieldPropsDto[],
            children: row.children?.map(child => tableRowToDto(child)),
        }
    }, [])

    const dtoToTableRow = useCallback((dto: ITableRowPropsDto, index: number = 0): ITableRowProps => {
        return {
            rowIndex: index,
            workNumber: dto.workNumber,
            level: dto.level,
            rowValues: dto.rowValues,
            children: dto.children?.map((child, idx) => dtoToTableRow(child, idx)),
            canOpen: !!dto.children && dto.children.length > 0,
            isOpen: false,
            onRowClick: undefined,
            onCellDoubleClick: undefined,
            onContextMenu: undefined,
            onToggle: undefined,
            editingCell: null,
            editingValue: '',
            onCellEdit: undefined,
            onCellEditComplete: undefined,
            onDragStart: undefined,
            onDragOver: undefined,
            onDragLeave: undefined,
            onDrop: undefined,
            isDragOver: false,
            dropPosition: null
        };
    }, []);

    const tableDataToDto = useCallback((data: ITableRowProps[]): ITableRowPropsDto[] => {
        return data.map(row => tableRowToDto(row));
    }, [tableRowToDto]);

    const dtoToTableData = useCallback((dto: ITableRowPropsDto[]): ITableRowProps[] => {
        return dto.map((item, index) => dtoToTableRow(item, index));
    }, [dtoToTableRow]);

    // Обработка ответа с данными бэклога
    const processBacklogResponse = useCallback((response: IBacklogDTO) => {
        const hasDoc = !!(response.fileName && response.fileUrl);
        setHaveDocument(hasDoc);
        setFileName(response.fileName || null);
        setFileUrl(response.fileUrl || null);

        if (response.backlogData && response.backlogData.length > 0) {
            const tableDataFromDto = dtoToTableData(response.backlogData);
            setInitialData(tableDataFromDto);
            setTableData(tableDataFromDto);
            lastSavedDataRef.current = tableDataFromDto;
        }
    }, [dtoToTableData]);

    useEffect(() => {
        setTitle('Анализ ТЗ')
        if (data) {
            setTitle(data.projectName)
            processBacklogResponse(data);
        }
    }, [setTitle, data, processBacklogResponse]);

    // Сравнение данных для определения изменений
    const checkForChanges = useCallback((currentData: ITableRowProps[]) => {
        const currentDto = tableDataToDto(currentData);
        const lastSavedDto = tableDataToDto(lastSavedDataRef.current);

        const hasChanges = JSON.stringify(currentDto) !== JSON.stringify(lastSavedDto);
        setHasChanges(hasChanges);
        return hasChanges;
    }, [tableDataToDto]);

    // Обработчик изменений таблицы
    const handleTableDataChange = useCallback((newData: ITableRowProps[]) => {
        setTableData(newData);
        checkForChanges(newData);
    }, [checkForChanges]);

    useEffect(()=>{
        console.log(tableData)
    }, [tableData]);

    // Скачивание файла с использованием репозитория
    const handleDownload = useCallback(async (format: 'xlsx' | 'csv') => {
        const downloadData = {
            projectId: projectState.projectId,
            format
        };

        try {
            const blob = await downloadBacklog(downloadData);

            // Создаем ссылку для скачивания
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `backlog.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            showAlert(`Backlog downloaded successfully in ${format} format`)

        } catch (error) {

            console.error('Error during download:', error);
        }
    }, [projectState, downloadBacklog, showAlert]);


    const downloadHandle = useCallback((e: React.MouseEvent) => {
        showContextMenu({
            items: [
                {
                    id: "xlsx",
                    label: "XLSX",
                    onClick: () => handleDownload('xlsx')
                },{
                    id: "CSV",
                    label: "csv",
                    onClick: () => handleDownload('csv')
                }
            ],
            position: {
                x: e.clientX,
                y: e.clientY
            }
        })
    }, [handleDownload, showContextMenu])

    
    const deleteRowHandle = useCallback(() => {
        showModal(BacklogDeleteRowModal())
    }, [showModal])

    // Загрузка файла ТЗ с использованием репозитория
    const handleUpload = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const file = e.target.files?.[0] ?? null

        if (!file) return;

        if (!isValidFileType(file)){
            showAlert('Неподдерживаемый формат файла. Поддерживаются: PDF, DOC, DOCX', EAlertType.WARNING)
        }

        const modalId = showModal({
            canClose: false,
            content: <>Загрузка файла...</>
        });

        try {
            const uploadData = {
                projectId: projectState.projectId,
                file
            };

            const response = await uploadTZ(uploadData);

            if (response.success && response.backlogData) {
                const backlogResponse: IBacklogDTO = {

                    fileName: response.fileName,
                    fileUrl: response.fileUrl,
                    backlogData: response.backlogData
                };
                processBacklogResponse(backlogResponse);
                showAlert('File uploaded successfully!')
            } else {
                console.error('File upload failed:', response.error);
                showAlert(['File upload failed:', response.error].join('\n'), EAlertType.ERROR);
            }

        } catch (error) {
            console.error('Error during file upload:', error);
        } finally {
            closeModal(modalId);
        }
    }, [isValidFileType, showModal, showAlert, projectState, uploadTZ, processBacklogResponse, closeModal])

    // Сохранение изменений с использованием репозитория
    const saveChanges = useCallback(async () => {
        if (!hasChanges || isSaving) return;

        setIsSaving(true);

        try {
            const backlogDataDto = tableDataToDto(tableData);
            const saveData = {
                projectId: projectState.projectId,
                backlogData: backlogDataDto
            };

            const response = await saveBacklog(saveData);

            if (response.status === "OK") {
                lastSavedDataRef.current = [...tableData];
                setHasChanges(false);
                showAlert('Изменения сохранены', EAlertType.SUCCESS)
            } else {
                showAlert(['Save failed:', response.message].join('\n'), EAlertType.ERROR);
            }
        } catch (error) {
            console.error('Error during save:', error);
        } finally {
            setIsSaving(false);
        }
    }, [hasChanges, isSaving, tableDataToDto, tableData, projectState, saveBacklog, showAlert]);

    //useNavigationBlocker(hasChanges)
    useUnsavedChanges(hasChanges)
    useRouteBlocker(hasChanges)


    return {
        haveDoc: haveDocument,
        fileName,
        fileUrl,
        initialTableData: initialData,
        tableData,
        updateTableData: handleTableDataChange,
        downloadHandle,
        deleteRowHandle,
        handleUpload,
        hasChanges,
        isSaving,
        saveChanges,
        allowedFileTypes: ALLOWED_FILE_TYPES
    }
}

export { useAnalysisTZPagePresenter }