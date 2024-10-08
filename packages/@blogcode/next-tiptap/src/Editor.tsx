import React, { FocusEvent, FormEvent } from "react";
import { Editor as TipTapEditorClass } from "@tiptap/react";

export interface EditorProps {
  value?: string;
  className?: string;
  contentHeight?: number;
  ssr?: boolean;
  onFocus?(e: FocusEvent<HTMLDivElement>): void;
  onBlur?(e: FocusEvent<HTMLDivElement>): void;
  onChange?(e: FormEvent<HTMLDivElement>): void;
}

export interface EditorRef extends TipTapEditorClass {
  getValue(): string;
  value: string;
}


