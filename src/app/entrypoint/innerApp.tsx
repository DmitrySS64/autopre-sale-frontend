import {useAuth} from "@entities/user/auth/context/useAuth.ts";
import {RouterProvider} from "@tanstack/react-router";
import {router} from "@app/routes";

function InnerApp(){
    const auth = useAuth()
    return <RouterProvider router={router} context={{auth}}/>
}

export {InnerApp}