import clsx from "clsx";
import { forwardRef, HTMLAttributes, PropsWithChildren } from "react";

export interface HelperTextProps extends HTMLAttributes<HTMLDivElement> {
  error?: boolean;
  componentClassName?: {
    error?: string;
  };
}

export const HelperText = forwardRef<HTMLDivElement, PropsWithChildren<HelperTextProps>>(
  function HelperText(props, ref) {
    const { children, error, componentClassName, ...rest } = props;
    return (
      <div
        {...rest}
        ref={ref}
        className={clsx(
          "text-xs mt-1",
          error ? "text-red-400" : "text-slate-700",
          error && componentClassName?.error
        )}
      >
        {children}
      </div>
    );
  }
);
