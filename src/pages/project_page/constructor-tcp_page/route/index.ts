import { type AnyRoute, createRoute, lazyRouteComponent} from "@tanstack/react-router";
import ERouterPath from "@shared/routes";

const createConstructorPageRoute = (parentRoute: AnyRoute) =>
    createRoute({
        path: ERouterPath.CONSTRUCTOR_PAGE,
        component: lazyRouteComponent(() => import('@pages/project_page/constructor-tcp_page/component')),
        getParentRoute: () => parentRoute,
    })

export { createConstructorPageRoute }