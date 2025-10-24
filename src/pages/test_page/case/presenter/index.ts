import {useAppForm} from "@shared/lib/form";
import {testPageSchema} from "@pages/test_page/schema";
import type {FormEvent} from "react";

const useTestPagePresenter = () => {
    const form = useAppForm({
        validators: {onBlur: testPageSchema}
    })
    const buttonOnClick = (e: FormEvent) => {
        e.preventDefault()
    }
    return {
        form,
        buttonOnClick

    }
}

export {useTestPagePresenter}