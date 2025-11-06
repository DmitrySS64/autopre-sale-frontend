import {
    createRouter,
    createRoute,
    createRootRouteWithContext, Link, redirect,
} from "@tanstack/react-router";
//import {
//    createMainPageRoute
//} from "@pages/main_page";
import {createTestPageRoute} from "@pages/test_page/route";
import {SidebarLayout} from "@widgets/sidebar";
import {createProjectsPageRoute} from "@pages/projects_page/route";
import {createAnalysisPageRoute} from "@pages/project_page/analysis-tz_page/route";
import {createConstructorPageRoute} from "@pages/project_page/constructor-tcp_page/route";
import {createAuthorizationPageRoute} from "@pages/sign-in/route";
import type {IAuthState} from "@entities/user/auth/interface";
import ERouterPath from "@shared/routes";

interface RouterContext {
    auth: IAuthState;
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
    notFoundComponent: () => {
        return (
            <div>
                <p>This is the notFoundComponent configured on root route</p>
                <Link to="/">Start Over</Link>
            </div>
        )
    },
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    beforeLoad: ({ context }) => {
        if (context.auth.isAuthenticated) {
            throw redirect({
                to: ERouterPath.PROJECTS_PAGE as string,
                replace: true
            });
        } else {
            throw redirect({
                to: ERouterPath.AUTHORIZATION_PAGE as string,
                replace: true
            });
        }
    }
});


const sidebarRoute = createRoute({
    id: 'app',
    getParentRoute: () => rootRoute,
    component: SidebarLayout,
});

const AuthRoute = createAuthorizationPageRoute(rootRoute);

const routeTree = rootRoute.addChildren([
    indexRoute,
    AuthRoute,
    sidebarRoute.addChildren([
        createTestPageRoute(sidebarRoute),
        createProjectsPageRoute(sidebarRoute),
        createAnalysisPageRoute(sidebarRoute),
        createConstructorPageRoute(sidebarRoute),
    ])
])

const router = createRouter({
    routeTree,
    context: undefined!,
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
});

export {router}