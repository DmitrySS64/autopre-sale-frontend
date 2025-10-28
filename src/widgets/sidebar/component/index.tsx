import style from '../style/sidebar.module.css'
import {SmallLogo} from "@shared/components/images/smallLogo.tsx";
import Icon from "@mdi/react";
import {EIconPath} from "@shared/components/images/icons";
import {cn} from "@shared/lib/cn";
import {Link, useParams} from "@tanstack/react-router";
import ERouterPath from "@shared/routes";
import {Button} from "@shared/components/form/button";
import {useSignOutRequest} from "@entities/user/auth/use-case/sing-out";

interface ISidebarItemProps {
    icon?: string;
    name?: string;
    active?: boolean;
    path?: string
}

const SidebarItem = ({
    icon = EIconPath.FOLDER_COPY,
    name = "Проекты",
    active,
    path = ERouterPath.PROJECTS_PAGE
 }:ISidebarItemProps) => {
    return (
        <Link to={path} className={cn(style.sidebarOption, active ? style.active : '')}>
            <Icon path={icon} size={1} className={style.icon}/>
            {name}
        </Link>
    )
}

const Sidebar = () => {
    const {projectId} = useParams({
        strict: false,
    })

    const { mutate: signOut, isPending } = useSignOutRequest();

    const handleSignOut = () => {
        signOut();
    };

    return (
        <div className={style.sidebar}>
            <nav className={style.content}>
                <SmallLogo/>
                <div className={'flex flex-col gap-[5px] w-full h-fit '}>
                    <SidebarItem
                        path={ERouterPath.PROJECTS_PAGE}
                        icon={EIconPath.FOLDER_COPY}
                        name={'Проекты'}/>
                    {projectId && (
                        <>
                            <div className={'h-[2px] w-[250px] bg-gray-400 mx-auto mt-[5px] mb-[12px] select-none'}/>
                            <SidebarItem
                                path={ERouterPath.PROJECT + '/' + projectId + ERouterPath.ANALYSIS}
                                icon={EIconPath.ANALYSIS}
                                name={'Анализ ТЗ'}/>
                            <SidebarItem
                                path={ERouterPath.PROJECT + '/' + projectId + ERouterPath.CONSTRUCTOR}
                                icon={EIconPath.DESCRIPTION}
                                name={'Конструктор ТКП'}/>
                        </>
                    )}
                </div>
            </nav>
            <div>
                <Button
                    onClick={handleSignOut}
                    disabled={isPending}
                >
                    Выход
                </Button>
                Вход
            </div>
        </div>
    )
}

export {Sidebar}