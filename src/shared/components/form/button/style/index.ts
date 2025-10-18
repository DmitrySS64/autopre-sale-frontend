import {cva} from "class-variance-authority";

export const buttonVariants = cva(
    '',
    {
        variants: {
            variant: {
                primary: {

                },
                secondary: {

                },
            },
        },
        defaultVariants:{
            variant: 'primary',
        }
    }
)