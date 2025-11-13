import {useMemo, useState} from "react";
import type {ITableRowProps} from "@shared/components/table/interface";

const useTableSearch = (tableData: ITableRowProps[]) => {
    const [searchValues, setSearchValues] = useState({
        workNumber: '',
        workType: '',
        acceptanceCriteria: ''
    });
    const filteredData = useMemo(() => {
        const match = (value = "", filter = "") =>
            !filter || value.toLowerCase().includes(filter.toLowerCase());

        const filterRecursive = (items: ITableRowProps[]): ITableRowProps[] =>
            items
                .map((item) => {
                    const matches =
                        match(item.workNumber, searchValues.workNumber) &&
                        match(item.rowValues?.[0]?.value ?? '', searchValues.workType) &&
                        match(item.rowValues?.[1]?.value ?? '', searchValues.acceptanceCriteria);

                    const children = item.children ? filterRecursive(item.children) : [];
                    if (matches || children.length) {
                        return { ...item, children };
                    }
                    return null;
                })
                .filter(Boolean) as ITableRowProps[];

        return filterRecursive(tableData);
    }, [tableData, searchValues]);

    const handleSearchChange = (field: keyof typeof searchValues, value: string) => {
        setSearchValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return {
        searchValues,
        filteredData,
        handleSearchChange
    }
}

export {useTableSearch}