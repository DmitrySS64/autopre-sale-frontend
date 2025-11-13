import Icon from "@mdi/react";
import {ICON_PATH} from "@shared/components/images/icons";
import type {ITableProps, ITableRowProps} from "../interface";
import React from "react";
import TableRow from './tableRow'
import useTablePresenter from "@shared/components/table/presenter";


const Table = ({
    values
}: ITableProps) => {
    const {
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
        dragOverRow, dropPosition,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop
    } = useTablePresenter(values);

    const renderRows = (data: ITableRowProps[], parentLevel: string = '1') => {
        return data.map((item, index) => {
            const rowKey = `${parentLevel}-${item.workNumber}-${index}`;

            const isDragOver = dragOverRow === item.workNumber;
            const currentDropPosition = isDragOver ? dropPosition : null;
            return (
                <React.Fragment key={rowKey}>
                    <TableRow
                        rowIndex={4}
                        {...item}
                        level={parentLevel as '1' | '2' | '3'}
                        onRowClick={() => handleRowClick(item.workNumber)}
                        onCellDoubleClick={(cellIndex: number) => handleCellDoubleClick(item.workNumber, cellIndex)}
                        onContextMenu={(e: React.MouseEvent) => showContextMenuHandle(e, item.workNumber)}
                        onToggle={() => handleToggle(item.workNumber)}
                        editingCell={editingCell}
                        editingValue={editingValue}
                        onCellEdit={handleCellEdit}
                        onCellEditComplete={handleCellEditComplete}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        isDragOver={isDragOver}
                        dropPosition={currentDropPosition}
                        children={item.children}
                    />
                    {item.isOpen && item.children && renderRows(item.children, String(Number(parentLevel) + 1))}
                </React.Fragment>
            );
        });
    }


    return (
        <table>
            <thead>
                <tr>
                    <th scope={'col'}>
                        <div>
                            <input
                                placeholder={'Номер работы'}
                                tabIndex={1}
                                value={searchValues.workNumber}
                                onChange={(e)=> handleSearchChange('workNumber', e.target.value)}
                            />
                            <Icon path={ICON_PATH.SEARCH} size={1}/>
                        </div>
                    </th>
                    <th scope={'col'}>
                        <div>
                            <input
                                placeholder={'Вид работы'}
                                tabIndex={2}
                                value={searchValues.workType}
                                onChange={(e)=> handleSearchChange('workType', e.target.value)}
                            />
                            <Icon path={ICON_PATH.SEARCH} size={1}/>
                        </div>
                    </th>
                    <th scope={'col'}>
                        <div>
                            <input
                                placeholder={'Критерий приемки'}
                                tabIndex={3}
                                value={searchValues.acceptanceCriteria}
                                onChange={(e)=> handleSearchChange('acceptanceCriteria', e.target.value)}
                            />
                            <Icon path={ICON_PATH.SEARCH} size={1}/>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                {renderRows(filteredData)}
            </tbody>
        </table>
    )
}

export {Table}