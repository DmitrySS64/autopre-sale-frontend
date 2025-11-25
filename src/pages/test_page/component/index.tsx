import {Button} from "@shared/components/form/button";
import {Input} from "@shared/components/form/input/component";
import {useTestPagePresenter} from "@pages/test_page/case/presenter";
import {useSidebarLayout} from "@widgets/sidebar/case/context";
import {useEffect, useState} from "react";
import {useModal} from "@widgets/modal/use-case";
import {useContextMenu} from "@widgets/context_menu/use-case";
import {ICON_PATH} from "@shared/components/images/icons";
import { ModalTkp } from "@/shared/components/modal_tkp/modal_tkp";
import ProjectModalContent from "@/shared/components/modal_tkp/component/ProjectModalContent";
import AccordionTKP from "@/shared/components/modal_tkp/component/AccordionTKP";


const TestPage = () => {
    const { form, buttonOnClick } = useTestPagePresenter()
    const {setTitle} = useSidebarLayout()
    const {showModal} = useModal()
    const {showContextMenu} = useContextMenu()
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const showContextMenuHandel = (e: React.MouseEvent) => {
        showContextMenu({
            items: [
                {
                    id: "Add",
                    icon: ICON_PATH.ADD,
                    label: 'Добавить',
                    onClick: () => {},
                },{
                    id: 'divider',
                    divider: true,
                }, {
                    id: 'delete',
                    label: "Удалить",
                    disabled: true
                }, {
                    id: 'delete',
                    label: "Удалить",
                }
            ],
            position: {
                x: e.clientX,
                y: e.clientY
            }
        })
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
            <div>
                <Button onClick={() => setIsModalOpen(true)}>
                    Показать шаблоны
                </Button>

                <ModalTkp 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)}
                >
                    <AccordionTKP />
                </ModalTkp>
            </div>
        </div>

    )
}
export default TestPage;