import { ReactElement } from 'react';

export interface ButtonRenderProps {
  pressed: boolean;
}

export interface ButtonChildrenProps {
  children: ((props: ButtonRenderProps) => ReactElement) | ReactElement;
}
