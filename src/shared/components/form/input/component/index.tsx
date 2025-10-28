import type {IInputProps} from "@shared/components/form/input/interface";
import style from '../style/input.module.css'
import {cn} from "@shared/lib/cn";

const Input = ({
                   className,
                   type = 'text',
                   ...props
               }: IInputProps) => {
    return (
    <input
        type={type}
        data-slot="input"
        className={cn(style.input, className)}
        {...props}
    />
    )
}

Input.displayName = 'Input'
export { Input }
