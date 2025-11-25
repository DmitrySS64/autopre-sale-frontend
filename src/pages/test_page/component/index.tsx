import {Button} from "@shared/components/form/button";
import {Input} from "@shared/components/form/input/component";
import {useTestPagePresenter} from "@pages/test_page/case/presenter";
import {BacklogTable, StaticTable} from "@shared/components/table";
import type {FormEvent} from "react";

const TestPage = () => {
    const {
        form,
        showModalHandle,
        stateTableData,
        showContextMenuHandel
    } = useTestPagePresenter()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        await form.handleSubmit()
    }

    return (
        <div className={'flex flex-col gap-2'}>
            <div className={'flex gap-2'}>
                <Button onClick={showModalHandle}>
                    Кнопка
                </Button>
                <Button onClick={showContextMenuHandel} outline>
                    Кнопка
                </Button>
                <Button disabled>
                    Кнопка
                </Button>
                <Button outline disabled>
                    Кнопка
                </Button>
            </div>

            <div className={'flex gap-2'}>
                <form className={'flex flex-col gap-2'} onSubmit={handleSubmit}>
                    <form.AppField name={'input'}>
                        {(field) => (
                            <field.TextField
                                label={'Заголовок'}
                                className={'w-[300px]'}
                                placeholder={'Введите значение'}
                            />
                        )}
                    </form.AppField>
                    <form.AppForm>
                        <form.SubscribeButton>
                            Кнопка
                        </form.SubscribeButton>
                    </form.AppForm>
                </form>
                <Input placeholder={'Введите значение'}/>

                <Input placeholder={'Введите значение'} disabled/>
            </div>
            <StaticTable {...stateTableData}/>
            <BacklogTable/>
        </div>

    )
}
export default TestPage;