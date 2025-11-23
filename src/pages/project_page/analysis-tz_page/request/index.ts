import {useMutation, useQuery} from "@tanstack/react-query";
import {EMutationKeys} from "@shared/enum/query";

//отслеживание загрузки тз при выгрузке (ждем успешной выгрузки на сервер)
//отслеживание обработки бэклога (ждем данных таблицы)
//получение данных таблицы (бэклог, состояние файла)
//выгрузка тз
//скачивание файла в соответствующем формате (xlsm, csv)
//редактирование таблицы (сохранение изменений) (можно через кнопку)

const useAnalysisPageRequest = () => {
    const callback = async () => {
        return Promise.resolve({})
    }

    return useQuery({
        queryKey: ['analysis'],
        queryFn: callback,
    })
}

const useAnalysisPageMutation = () => {

    return useMutation({
        mutationKey: ['mutationKey: analysis-file-upload'],
        mutationFn: () => Promise.resolve({}),
    })
}

export { useAnalysisPageRequest, useAnalysisPageMutation }