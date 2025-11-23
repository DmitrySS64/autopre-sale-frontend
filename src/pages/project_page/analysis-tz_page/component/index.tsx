import {Button} from "@shared/components/form/button";
import {BacklogTable, StaticTable} from "@shared/components/table";
import style from '../style/analysis_page.module.css'
import {Link, useParams} from "@tanstack/react-router";
import type {IStaticTableProps} from "@shared/components/table/interface";
import {useAnalysisTZPagePresenter} from "@pages/project_page/analysis-tz_page/presenter";
import Icon from "@mdi/react";
import {ICON_PATH} from "@shared/components/images/icons";
import {InputFile} from "@shared/components/form/input_file/component";
import ERouterPath from "@shared/routes";

const STATIC_TABLE_PROPS : IStaticTableProps = {
    columnWidths:[
        "300px", "300px"
    ],
    headers: [
        "Файл", "Проанализирован"
    ],
}

const AnalysisPage = () => {

    const {projectId} = useParams({from: `/app${ERouterPath.ANALYSIS_PAGE}`})

    const {
        haveDoc,
        fileName,
        fileUrl,
        initialTableData,
        updateTableData,
        downloadHandle,
        handleUpload,
        hasChanges,
        isSaving,
        saveChanges
    } = useAnalysisTZPagePresenter(projectId)

    if (!haveDoc)
        return (
            <div className={style.row}>
                <h2>В проекте нет документа для анализа</h2>
                <InputFile onChange={handleUpload}>
                    <Icon path={ICON_PATH.UPLOAD} size={1}/>
                    Загрузить
                </InputFile>
            </div>
        )
    
    return (
        <div className={style.main}>
            <StaticTable
                {...STATIC_TABLE_PROPS}
                data={[
                    {
                        id: 'file-info',
                        cells: [
                            fileUrl ? (
                                <Link to={fileUrl} target="_blank" rel="noopener noreferrer">
                                    {fileName || "Файл не загружен"}
                                </Link>
                            ) : (
                                <span>{fileName || "Файл не загружен"}</span>
                            ),
                            "Да"
                        ]
                    }
                ]}
            />
            <div className={style.backlog}>
                <div className={style.row}>
                    <h2>Сформированный бэклог:</h2>
                    <div style={{display:"flex", gap: '10px'}}>
                        <Button
                            onClick={saveChanges}
                            disabled={!hasChanges || isSaving}
                        >
                            Сохранить
                        </Button>
                        <Button
                            onClick={downloadHandle}
                        >
                            <Icon path={ICON_PATH.DOWNLOAD} size={1}/>
                            Скачать
                        </Button>
                    </div>
                </div>
                <div className={style.row}>
                    {hasChanges && (
                        <span className={style.unsavedChanges}>
                            Есть несохраненные изменения
                        </span>
                    )}
                </div>
                <BacklogTable
                    values={initialTableData}
                    onDataChange={updateTableData}
                />
            </div>
        </div>
    )
}

export default AnalysisPage;