import {router} from "./routes.tsx";

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}
