import style from '../style/sidebar.module.css'
import {SmallLogo} from "@shared/components/images/smallLogo.tsx";
import Icon from "@mdi/react";
import {EIconPath} from "@shared/components/images/icons";
import {cn} from "@shared/lib/cn";

interface ISidebarItemProps {
    icon?: string;
    name?: string;
    active?: boolean;
}

const SidebarItem = ({
    icon = EIconPath.FOLDER_COPY,
    name = "Проект",
    active = false,
 }:ISidebarItemProps) => {
    return (
        <div className={cn(style.sidebarOption, active ? style.active : '')}>
            <Icon path={icon} size={1} className={style.icon}/>
            {name}
        </div>
    )
}

const Sidebar = () => {
    return (
        <div className={style.sidebar}>
            <div className={style.content}>
                <SmallLogo/>
                <div className={'flex flex-col gap-[5px] w-full h-fit '}>
                    <SidebarItem/>
                    <div className={'h-[2px] w-[250px] bg-gray-400 mx-auto mt-[5px] mb-[12px] select-none'}/>
                    <SidebarItem icon={EIconPath.ANALYSIS} name={'Анализ ТЗ'} active/>
                    <SidebarItem icon={EIconPath.DESCRIPTION} name={'Конструктор ТКП'}/>
                </div>

            </div>
            <div>
                Вход
            </div>
        </div>
    )
}

export { Sidebar }