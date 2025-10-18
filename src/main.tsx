import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from '@tanstack/react-router'
import {router} from "@app/routes";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {TanStackRouterDevtools} from "@tanstack/react-router-devtools";

const queryClient = new QueryClient()
const rootElement = document.getElementById('root')

if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)

    root.render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools buttonPosition={'bottom-right'}/>
                <RouterProvider router={router}/>
                <TanStackRouterDevtools router={router}/>
            </QueryClientProvider>
        </StrictMode>,
    )
}
