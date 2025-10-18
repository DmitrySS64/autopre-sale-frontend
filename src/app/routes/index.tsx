import {createRouter, createRootRoute, createRoute, Outlet} from "@tanstack/react-router";
import {
    createMainPageRoute
} from "@pages/main_page";

const rootRoute = createRootRoute({
    component: () => <Outlet/>
});

const sidebarRoute = createRoute({
    id: 'app',
    getParentRoute: () => rootRoute,
    component: () => (
        <>
            <Outlet/>
        </>
    )
});

const routeTree = rootRoute.addChildren([
    createMainPageRoute(rootRoute),
    sidebarRoute.addChildren([])
])

const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
});

export {router}