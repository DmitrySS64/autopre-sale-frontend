import {type IButtonProps, buttonVariants} from "..";
import {cn} from "@shared/lib/cn";


const Button = ({
                    className,
                    children,
                    ...props
                }): IButtonProps => {
    return(
        <button
            className={cn(buttonVariants(), className)}
            {...props}
        >
            {children}
        </button>
    )
}

export {Button};