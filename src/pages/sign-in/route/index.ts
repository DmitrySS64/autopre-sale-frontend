import {type AnyRoute, createRoute, lazyRouteComponent, redirect} from "@tanstack/react-router";
import ERouterPath from "@shared/routes";

const createAuthorizationPageRoute = (parentRoute: AnyRoute) =>
    createRoute({
        validateSearch: (search) => ({
            redirect: (search.redirect as string) || '/',
        }),
        path: ERouterPath.AUTHORIZATION_PAGE,
        component: lazyRouteComponent(() => import('@pages/sign-in/component')),
        getParentRoute: () => parentRoute,
        beforeLoad: ({ context, search }) => {
            if (context.auth.isAuthenticated) {
                throw redirect({ to: search.redirect })
            }
        },
    })

export { createAuthorizationPageRoute }