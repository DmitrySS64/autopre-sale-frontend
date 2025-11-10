import {Button} from "@shared/components/form/button";
import {Input} from "@shared/components/form/input/component";
import {useTestPagePresenter} from "@pages/test_page/case/presenter";
import {useSidebarLayout} from "@widgets/sidebar/case/context";
import {useEffect} from "react";
import {useModal} from "@widgets/modal/use-case";


const TestPage = () => {
    const { form, buttonOnClick } = useTestPagePresenter()
    const {setTitle} = useSidebarLayout()
    const {showModal} = useModal()
    useEffect(() => {
        setTitle("Тестовая страница")
    }, [setTitle])

    const showModalHandle = () => showModal({
        title: "Вы точно хотите удалить элемент бэклога?",
        content: <>
            <div>
                <Button outline>
                    Отмена
                </Button>
                <Button>
                    Удалить
                </Button>
            </div>
        </>
    })

    return (
        <div className={'flex flex-col gap-2'}>
            <div className={'flex gap-2'}>
                <Button onClick={showModalHandle}>
                    Кнопка
                </Button>
                <Button outline>
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
                <form className={'flex flex-col gap-2'}>
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
                        <form.SubscribeButton
                            type="submit"
                            onClick={buttonOnClick}
                        >
                            Кнопка
                        </form.SubscribeButton>
                    </form.AppForm>
                </form>
                <Input placeholder={'Введите значение'}/>

                <Input placeholder={'Введите значение'} disabled/>
            </div>
        </div>

    )
}
export default TestPage;