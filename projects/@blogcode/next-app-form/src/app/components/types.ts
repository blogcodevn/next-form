/* eslint-disable @typescript-eslint/no-empty-object-type */
import { HTMLAttributes, PropsWithChildren, ReactElement, Ref } from "react";

type DetailedHTML<Element extends HTMLElement = HTMLElement> = HTMLAttributes<Element>;

export type PropsWithHTML<Props = {}, ClassNames = {}, Detailed = DetailedHTML<HTMLElement>> = Props &
  Detailed & {
    component?: keyof JSX.IntrinsicElements;
    renderRoot?(props: PropsWithChildren<HTMLAttributes<HTMLElement>>, ref?: Ref<HTMLElement>): ReactElement;
    componentClassName?: ClassNames;
  };
