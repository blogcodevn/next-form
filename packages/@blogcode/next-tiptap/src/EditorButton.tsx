import React, { FC } from "react";
import { withPrefix } from "./withPrefix";
import { IconType } from "./icons/Icon";
import clsx from "clsx";

export interface EditorButtonProps {
  icon: IconType;
  action(): void;
  label: string;
  className?: string;
  iconSize?: number;
}

export const editorButtonClasses = {
  root: withPrefix("EditorButton-root"),
  icon: withPrefix("EditorButton-icon"),
};

export const EditorButton: FC<EditorButtonProps> = (props) => {
  const { className, icon: Icon, iconSize } = props;

  return (
    <button type="button" className={clsx(editorButtonClasses.root, className)}>
      <Icon size={iconSize} className={clsx(editorButtonClasses.icon)} />
    </button>
  );
};

EditorButton.displayName = "@blogcode/next-tiptap/EditorButton";
