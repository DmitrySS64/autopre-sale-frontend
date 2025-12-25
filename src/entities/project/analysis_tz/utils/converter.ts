import type {
    ITableFieldPropsDto,
    ITableRowPropsDto,
    IWorkDto,
    IWorkImportItem
} from "@entities/project/analysis_tz/interface";

const DEFAULT_COLUMNS = ['№ работы', 'Тип работы', 'Критерии приемки'];

// Конвертация из WorkDto (API) в ITableRowPropsDto (клиент)
const workDtoToTableRowDto = (work: IWorkDto): ITableRowPropsDto => {
    const levelMap: Record<number, '1' | '2' | '3'> = {
        1: '1',
        2: '2',
        3: '3'
    };

    // Преобразуем данные работы в значения ячеек таблицы
    const rowValues: ITableFieldPropsDto[] = [
        { value: work.workType || '' },
        { value: work.acceptanceCriteria || '' }
    ];

    return {
        id: work.id, // Сохраняем ID для последующего обновления
        workNumber: work.workNumber,
        level: levelMap[work.level] || '1',
        rowValues,
        children: work.childWorks?.map(child => workDtoToTableRowDto(child))
    };
};

// Проверка валидности ID
const isValidId = (id?: string): boolean => {
    return !!id && id.trim() !== '' && id !== '00000000-0000-0000-0000-000000000000';
};

// Конвертация из ITableRowPropsDto (клиент) в WorkDto (API)
const tableRowDtoToWorkDto = (row: ITableRowPropsDto, parentLevel: number = 0): IWorkDto | null => {
    const levelMap: Record<string, number> = {
        '1': 1,
        '2': 2,
        '3': 3
    };

    // Если ID невалидный, это новая запись - не конвертируем её
    if (!isValidId(row.id)) {
        return null;
    }

    // Извлекаем данные из ячеек таблицы
    const workNumber = row.workNumber || '';
    const workType = row.rowValues?.[0]?.value || '';
    const acceptanceCriteria = row.rowValues?.[1]?.value || '';
    
    // Рекурсивно обрабатываем дочерние работы, фильтруя невалидные
    const validChildren = row.children
        ?.map(child => tableRowDtoToWorkDto(child, levelMap[row.level || '1']))
        .filter((child): child is IWorkDto => child !== null); // Убираем null значения

    return {
        id: row.id!,
        workNumber,
        level: levelMap[row.level || '1'] || parentLevel + 1,
        workType,
        acceptanceCriteria,
        childWorks: validChildren && validChildren.length > 0 ? validChildren : undefined
    };
};

// Конвертация для импорта (специфичный формат для ImportBacklogDto)
const tableRowDtoToWorkImportItem = (row: ITableRowPropsDto): IWorkImportItem => {
    const type = row.rowValues?.[0]?.value || '';
    const acceptanceCriteria = row.rowValues?.[1]?.value || '';

    return {
        work_number: row.workNumber,
        work_type: type,
        acceptance_criteria: acceptanceCriteria
    };
};

// Массовые преобразования
const workDtosToTableRowDtos = (works: IWorkDto[]): ITableRowPropsDto[] => {
    return works.map(workDtoToTableRowDto);
};

const tableRowDtosToWorkDtos = (rows: ITableRowPropsDto[]): IWorkDto[] => {
    // Конвертируем и фильтруем только записи с валидными ID
    return rows
        .map(row => tableRowDtoToWorkDto(row))
        .filter((work): work is IWorkDto => work !== null); // Убираем null значения
};

const tableRowDtosToWorkImportItems = (rows: ITableRowPropsDto[]): IWorkImportItem[] => {
    return rows.map(tableRowDtoToWorkImportItem);
};

// Вспомогательная функция для получения конфигурации таблицы
const getTableColumnsConfig = () => {
    return {
        columnCount: DEFAULT_COLUMNS.length,
        headers: DEFAULT_COLUMNS,
        columnWidths: ['150px', '200px', '400px'] // Настройте по необходимости
    };
};

export {
    workDtoToTableRowDto,
    tableRowDtoToWorkDto,
    tableRowDtoToWorkImportItem,
    workDtosToTableRowDtos,
    tableRowDtosToWorkDtos,
    tableRowDtosToWorkImportItems,
    getTableColumnsConfig
}