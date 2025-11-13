import React, {type Dispatch, type SetStateAction, useState} from "react";
import type {ITableRowProps} from "@shared/components/table/interface";

const MAX_LEVEL = 3;

const useTableDnD = (
    setTableData: Dispatch<SetStateAction<ITableRowProps[]>>,
    renumberTable: (items: ITableRowProps[]) => ITableRowProps[]
) => {
    const [draggedRow, setDraggedRow] = useState<ITableRowProps | null>(null);
    const [dragOverRow, setDragOverRow] = useState<string | null>(null);
    const [dropPosition, setDropPosition] = useState<"before" | "after" | "inside" | null>(null);

    const handleDragStart = (e: React.DragEvent, row: ITableRowProps) => {
        e.dataTransfer.setData("text/plain", row.workNumber);
        e.dataTransfer.effectAllowed = "move";
        setDraggedRow(row);
    };

    const handleDragOver = (e: React.DragEvent, targetRowId: string) => {
        e.preventDefault();

        const rect = e.currentTarget.getBoundingClientRect();
        const mouseY = e.clientY - rect.top;
        const height = rect.height;

        const position: "before" | "after" | "inside" =
            mouseY < height * 0.33
                ? "before"
                : mouseY > height * 0.66
                    ? "after"
                    : "inside";

        setDragOverRow(targetRowId);
        setDropPosition(position);
    };

    const handleDragLeave = () => {
        setDragOverRow(null);
        setDropPosition(null);
    };

    const handleDrop = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData("text/plain");
        if (!draggedRow || draggedId === targetId) return;

        setTableData((prev) => {
            let data = removeRow(prev, draggedId);
            data = insertRow(data, draggedRow, targetId, dropPosition);
            return renumberTable(normalizeLevels(data));
        });

        setDraggedRow(null);
        setDragOverRow(null);
        setDropPosition(null);
    };

    const removeRow = (items: ITableRowProps[], id: string): ITableRowProps[] =>
        items
            .map((item) => ({
                ...item,
                children: item.children ? removeRow(item.children, id) : undefined,
            }))
            .filter((x) => x.workNumber !== id);

    const insertRow = (
        items: ITableRowProps[],
        row: ITableRowProps,
        targetId: string,
        pos: "before" | "after" | "inside" | null
    ): ITableRowProps[] => {
        const result: ITableRowProps[] = [];

        for (const item of items) {
            if (item.workNumber === targetId) {
                if (pos === "before") {
                    result.push({ ...row });
                    result.push(item);
                } else if (pos === "after") {
                    result.push(item);
                    result.push({ ...row });
                } else if (pos === "inside") {
                    const currentLevel = Number(item.level ?? 1);
                    const childLevel = Math.min(currentLevel + 1, MAX_LEVEL);
                    const newChild = { ...row, level: String(childLevel) as "1" | "2" | "3" };
                    result.push({
                        ...item,
                        canOpen: true,
                        isOpen: true,
                        children: [...(item.children || []), newChild],
                    });
                }
            } else {
                result.push({
                    ...item,
                    children: item.children ? insertRow(item.children, row, targetId, pos) : item.children,
                });
            }
        }
        return result;
    };

    const normalizeLevels = (items: ITableRowProps[], level = 1): ITableRowProps[] => {
        const normalized: ITableRowProps[] = [];

        for (const item of items) {
            const newLevel = Math.min(level, MAX_LEVEL);
            let newChildren: ITableRowProps[] | undefined;

            if (item.children?.length) {
                newChildren = normalizeLevels(item.children, newLevel + 1);
            }

            // если уровень > MAX_LEVEL — переносим в родителя уровня 2
            if (level > MAX_LEVEL) {
                const lastLevel2 = normalized.find((x) => x.level === "2");
                if (lastLevel2) {
                    lastLevel2.children = [...(lastLevel2.children || []), { ...item, level: "3" }];
                }
            } else {
                normalized.push({ ...item, level: String(newLevel) as "1" | "2" | "3", children: newChildren });
            }
        }
        return normalized;
    };



    return {
        draggedRow,
        dragOverRow,
        dropPosition,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop,
    };
};

export { useTableDnD };