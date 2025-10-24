import {createFormHook} from "@tanstack/react-form";
import {
    fieldContext,
    formContext
} from "../context";
import {
    SubscribeButton,
    TextField,
} from "@shared/lib/form/component";

const { useAppForm } = createFormHook({
    fieldComponents: {
        TextField,
    },
    formComponents: {
        SubscribeButton
    },
    fieldContext,
    formContext
})

export { useAppForm }