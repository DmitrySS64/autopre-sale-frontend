import {useSidebarLayout} from "@widgets/sidebar/case/context";
import React, {type ChangeEvent, useCallback, useEffect, useState} from "react";
import {useAnalysisPageMutation, useAnalysisPageRequest} from "@pages/project_page/analysis-tz_page/request";
import type {ITableRowProps} from "@shared/components/table/interface";
import {useContextMenu} from "@widgets/context_menu/use-case";
import {useModal} from "@widgets/modal/use-case";
import {BacklogDeleteRowModal} from "@pages/project_page/analysis-tz_page/modal";
import {timeout} from "es-toolkit";

const useAnalysisTZPagePresenter = () => {
    const {setTitle} = useSidebarLayout()
    const {data} = useAnalysisPageRequest()
    const {mutate} = useAnalysisPageMutation()
    const {showContextMenu} = useContextMenu()
    const {showModal, closeModal} = useModal()
    const [selectedFile, setSelectedFile] = useState<File|null>(null);

    useEffect(() => {
        setTitle('Анализ ТЗ')
    }, [setTitle]);

    const haveDoc = false;

    const tableData: ITableRowProps[] = [
        {
            workNumber: '1',
            rowValues: [
                {value: "Значение 1"},{value: "Значение 2"},
            ]
        }
    ]

    const downloadHandle = useCallback((e: React.MouseEvent) => {
        showContextMenu({
            items: [
                {
                    id: "xlsx",
                    label: "XLSX",
                    onClick: () => {}
                },{
                    id: "CSV",
                    label: "csv",
                    onClick: () => {}
                }
            ],
            position: {
                x: e.clientX,
                y: e.clientY
            }
        })
    }, [showContextMenu])

    
    const deleteRowHandle = useCallback(() => {
        showModal(BacklogDeleteRowModal())
    }, [showModal])
    
    const downloadModal = useCallback(() => {
        return showModal({
            canClose: false,
            content: <>
                Загрузка...
            </>
        })
    }, [showModal])

    const handleUpload = useCallback(async (e: ChangeEvent<HTMLInputElement>)=>{
        e.preventDefault()
        setSelectedFile(e.target.files?.[0] ?? null)

        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile); // 'file' is the field name expected by your server

        const modalId = downloadModal()

        try {
            await timeout(1000 * 60);
            const response = await fetch('/api/upload', { // Replace with your server endpoint
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('File uploaded successfully!');
                // Handle success (e.g., clear selected file, show success message)
            } else {
                console.error('File upload failed.');
                // Handle error
            }
        } catch (error) {
            console.error('Error during file upload:', error);
        }

        closeModal(modalId)
    }, [closeModal, downloadModal, selectedFile])

    return {
        haveDoc,
        tableData,
        downloadHandle,
        deleteRowHandle,
        handleUpload
    }
}

export { useAnalysisTZPagePresenter }