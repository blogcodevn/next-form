import clsx from "clsx";
import { FocusEvent, forwardRef, InputHTMLAttributes, PropsWithChildren, ReactNode, useState } from "react";
import { InputLabel } from "./InputLabel";
import { HelperText } from "./HelperText";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  message?: string;
  error?: string;
}

export const TextInput = forwardRef<HTMLInputElement, PropsWithChildren<TextInputProps>>(
  function TextInput(props, ref) {
    const { label, children, leftSection, rightSection, className, message, error, onFocus, onBlur, ...rest } = props;
    const [focused, setFocused] = useState(false);

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur?.(e);
    };

    console.log(rest.name, rest);
  
    return (
      <div className={clsx("w-full", className)}>
        {label && (
          <InputLabel>
            {label}
          </InputLabel>
        )}
        <div
          className={clsx(
            "w-full rounded-md h-10 min-h-[40px] overflow-hidden border border-orange-200 dark:border-slate-700",
            "bg-[#f5e3c5]/20 dark:bg-slate-700/20",
            focused ? "ring-1 ring-orange-200 dark:ring-slate-600" : ""
          )}
        >
          <div className="flex items-center w-full h-full">
            {!!leftSection && (
              <div className="inline-flex items-center px-2">
                {leftSection}
              </div>
            )}
            <input
              {...rest}
              ref={ref}
              className={clsx(
                "flex-1 w-full h-full rounded-none text-sm bg-transparent outline-0 text-slate-200",
                leftSection ? "" : "pl-2",
                rightSection ? "" : "pr-2"
              )}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {!!rightSection && (
              <div className="inline-flex items-center px-2">
                {rightSection}
              </div>
            )}
          </div>
          {children}
        </div>
        {!!message || !!error ? (
          <HelperText error={!!error}>
            {error || message}
          </HelperText>
        ) : null}
      </div>
    );
  }
);
