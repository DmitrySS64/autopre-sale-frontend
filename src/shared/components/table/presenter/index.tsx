import React from "react";
import type {ITableRowProps} from "@shared/components/table/interface";
import {useContextMenu} from "@widgets/context_menu/use-case";
import {ICON_PATH} from "@shared/components/images/icons";
import {useTableData} from "@shared/components/table/hooks/useTableData.tsx";
import {useTableEditing} from "@shared/components/table/hooks/useTableEditing.tsx";
import {useTableSearch} from "@shared/components/table/hooks/useTableSearch.tsx";
import {useTableDnD} from "@shared/components/table/hooks/useTableDnD.tsx";

const useTablePresenter = (
    values: ITableRowProps[] | undefined,
) => {
    const {
        tableData,
        setTableData,
        updateTableData,
        addRow,
        deleteRow,
        findRow,
        handleToggle,
        renumberTable,
    } = useTableData(values)

    const {
        editingCell, editingValue,
        handleCellDoubleClick,
        handleCellEdit,
        handleCellEditComplete,
        handleRowClick
    } = useTableEditing(tableData, updateTableData, findRow);

    const {
        searchValues,
        filteredData,
        handleSearchChange
    } = useTableSearch(tableData)

    const {
        draggedRow, dragOverRow, dropPosition,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop,
    } = useTableDnD(setTableData, renumberTable)

    const {showContextMenu} = useContextMenu()

    const showContextMenuHandle = (e: React.MouseEvent, rowId: string) => {
        e.preventDefault();
        const result = findRow(tableData, rowId);
        if (!result) return;
        const {row} = result;
        const currentLevel = row.level || '1';
        const canAddChild = currentLevel != '3';

        showContextMenu({
            items: [
                {
                    id: "add",
                    icon: ICON_PATH.ADD,
                    label: 'Добавить работу',
                    onClick: () => addRow(rowId, false),
                },{
                    id: "add-child",
                    icon: ICON_PATH.ADD_MULTIPLE,
                    label: 'Добавить подзадачу',
                    onClick: () => addRow(rowId, true),
                    disabled: !canAddChild,
                }, {
                    id: "delete",
                    icon: ICON_PATH.REMOVE,
                    label: "Удалить работу",
                    onClick: () => deleteRow(rowId)
                }
            ],
            position: { x: e.clientX, y: e.clientY }
        });
    };

    return {
        //данные
        filteredData,
        searchValues,
        //редактирование
        editingCell,
        editingValue,
        handleRowClick,
        handleCellDoubleClick,
        handleCellEdit,
        handleCellEditComplete,
        //поиск
        handleSearchChange,
        //контекст
        handleToggle,
        showContextMenuHandle,
        //Drag and drop
        draggedRow, dragOverRow, dropPosition,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop
    }
}

export default useTablePresenter