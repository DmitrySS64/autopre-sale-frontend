import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import '../styles/index.css'
import {router} from "@app/routes";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {TanStackRouterDevtools} from "@tanstack/react-router-devtools";
import {AuthProvider} from "@entities/user/auth/provider";
import {InnerApp} from "@app/entrypoint/innerApp.tsx";
import {ModalProvider} from "@widgets/modal/provider";
import {ContextMenuProvider} from "@widgets/context_menu/provider";

const queryClient = new QueryClient()

const rootElement = document.getElementById('root')

if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)

    root.render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools buttonPosition={'bottom-right'}/>
                <AuthProvider>
                    <ModalProvider>
                        <ContextMenuProvider>
                            <InnerApp/>
                        </ContextMenuProvider>
                    </ModalProvider>
                </AuthProvider>
                <TanStackRouterDevtools router={router}/>
            </QueryClientProvider>
        </StrictMode>,
    )
}
