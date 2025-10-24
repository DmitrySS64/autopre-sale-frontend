import {createRouter, createRootRoute, createRoute, Outlet} from "@tanstack/react-router";
import {
    createMainPageRoute
} from "@pages/main_page";
import {Sidebar} from "@widgets/sidebar/component";
import {createTestPageRoute} from "@pages/test_page/route";

const rootRoute = createRootRoute({
    component: () => <Outlet/>
});

const sidebarRoute = createRoute({
    id: 'app',
    getParentRoute: () => rootRoute,
    component: () => (
        <div className={'w-full h-full flex'}>
            <Sidebar/>
            <Outlet/>
        </div>
    )
});

const routeTree = rootRoute.addChildren([
    createMainPageRoute(rootRoute),
    sidebarRoute.addChildren([
        createTestPageRoute(sidebarRoute)
    ])
])

const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
});

export {router}