import {Button} from "@shared/components/form/button";
import {BacklogTable, StaticTable} from "@shared/components/table";
import style from '../style/analysis_page.module.css'
import {Link} from "@tanstack/react-router";
import type {IStaticTableProps} from "@shared/components/table/interface";
import {useAnalysisTZPagePresenter} from "@pages/project_page/analysis-tz_page/presenter";
import Icon from "@mdi/react";
import {ICON_PATH} from "@shared/components/images/icons";
import {InputFile} from "@shared/components/form/input_file/component";

const STATIC_TABLE_PROPS : IStaticTableProps = {
    columnWidths:[
        "300px", "300px"
    ],
    headers: [
        "Файл", "Проанализирован"
    ],
}

const AnalysisPage = () => {

    const {
        haveDoc,
        tableData,
        downloadHandle,
        handleUpload
    } = useAnalysisTZPagePresenter()

    if (!haveDoc)
        return <div className={style.row}>
            <h2>В проекте нет документа для анализа</h2>
            <InputFile onChange={handleUpload}>
                <Icon path={ICON_PATH.UPLOAD} size={1}/>
                Загрузить
            </InputFile>
        </div>
    
    return (
        <div className={style.main}>
            <StaticTable
                {...STATIC_TABLE_PROPS}
                data={[
                    {
                        id: 'row',
                        cells: [
                            <Link>
                                Какой-то файл.pdf
                            </Link>,
                            "Да"
                        ]
                    }
                ]}
            />
            <div className={style.backlog}>
                <div className={style.row}>
                    <h2>Сформированный бэклог:</h2>
                    <Button
                        onClick={downloadHandle}
                    >
                        <Icon path={ICON_PATH.DOWNLOAD} size={1}/>
                        Скачать
                    </Button>
                </div>
                <BacklogTable
                    values={tableData}
                />
            </div>
        </div>
    )
}

export default AnalysisPage;