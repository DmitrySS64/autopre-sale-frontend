declare module '@mdi/react' {
  import * as React from 'react';

  export interface IconProps {
    path: string;
    size?: number | string;
    color?: string;
    spin?: boolean;
    rotate?: number;
    className?: string;
    horizontal?: boolean;
    vertical?: boolean;
    rotate45?: boolean;
  }

  const Icon: React.FC<IconProps>;
  export default Icon;
}












