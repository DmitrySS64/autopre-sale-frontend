import {Button} from "@shared/components/form/button";
import {Input} from "@shared/components/form/input/component";
import {useTestPagePresenter} from "@pages/test_page/case/presenter";

const TestPage = () => {

    const { form, buttonOnClick } = useTestPagePresenter()

    return (
        <div className={'flex flex-col gap-2 w-full pt-[45px] pr-[50px] pb-[30px] pl-[50px]'}>
            <div className={'flex gap-2'}>
                <Button>
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

export default TestPage