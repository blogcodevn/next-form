import clsx from "clsx";
import { ButtonHTMLAttributes, forwardRef, PropsWithChildren, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "ghost";
}

const sizeClasses = {
  sm: "h-8 min-h-[32px] px-1",
  md: "h-11 min-h-[44px] px-2",
  lg: "h-12 min-h-[48px] px-3",
};

const variantClasses = {
  solid: "bg-orange-200 dark:bg-slate-700 text-orange-900 dark:text-slate-200",
  ghost: "bg-transparent text-orange-200 dark:text-slate-700",
};

export const Button = forwardRef<HTMLButtonElement, PropsWithChildren<ButtonProps>>(
  function Button(props, ref) {
    const { children, leftSection, rightSection, type = "button", variant, size, className } = props;

    const sizeClass = size ? sizeClasses[size] : "";
    const variantClass = variant ? variantClasses[variant] : variantClasses.solid;

    return (
      <button
        ref={ref}
        type={type}
        className={clsx(
          "bg-orange-200 dark:bg-slate-700 text-orange-900 dark:text-slate-200",
          "flex items-center justify-center h-10 min-h-[40px] rounded-md shadow-md px-2",
          "font-medium text-sm transition-all active:translate-y-0.5",
          sizeClass,
          variantClass,
          className
        )}
      >
        {!!leftSection && (
          <span className="inline-flex items-center px-2">
            {leftSection}
          </span>
        )}
        <span className="flex flex-1 items-center justify-center h-full">
          {children}
        </span>
        {!!rightSection && (
          <span className="inline-flex items-center px-2">
            {rightSection}
          </span>
        )}
      </button>
    );
  }
);
