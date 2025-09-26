"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ToolbarAction =
  | "bold"
  | "italic"
  | "underline"
  | "strikeThrough"
  | "h1"
  | "h2"
  | "paragraph"
  | "unorderedList"
  | "orderedList"
  | "blockquote"
  | "code"
  | "link"
  | "clear";

export interface DescriptionEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
  toolbarActions?: ToolbarAction[];
}

/**
 * Basic rich-text editor using a contentEditable div and execCommand
 * - Outputs sanitized-looking HTML (no external dependency). Note: consider sanitizing before saving.
 */
const DescriptionEditor: React.FC<DescriptionEditorProps> = ({
  value = "",
  onChange,
  placeholder = "Nhập mô tả...",
  className,
  toolbarActions,
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [html, setHtml] = useState<string>(value || "");

  useEffect(() => {
    setHtml(value || "");
    if (editorRef.current) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const actions: ToolbarAction[] = useMemo(
    () =>
      toolbarActions || [
        "bold",
        "italic",
        "underline",
        "strikeThrough",
        "h1",
        "h2",
        "paragraph",
        "unorderedList",
        "orderedList",
        "blockquote",
        "code",
        "link",
        "clear",
      ],
    [toolbarActions]
  );

  const focusEditor = () => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    // Place caret at end if empty
    const selection = window.getSelection();
    if (selection && selection.rangeCount === 0) {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const exec = (command: string, value?: string) => {
    focusEditor();
    try {
      document.execCommand(command, false, value);
    } catch (e) {
      // execCommand is deprecated but broadly supported; ignore errors silently
    }
    // Sync state after command
    if (editorRef.current) {
      const current = editorRef.current.innerHTML;
      setHtml(current);
      onChange?.(current);
    }
  };

  const handleAction = (action: ToolbarAction) => {
    switch (action) {
      case "bold":
      case "italic":
      case "underline":
      case "strikeThrough":
        exec(action);
        break;
      case "h1":
        exec("formatBlock", "h1");
        break;
      case "h2":
        exec("formatBlock", "h2");
        break;
      case "paragraph":
        exec("formatBlock", "p");
        break;
      case "unorderedList":
        exec("insertUnorderedList");
        break;
      case "orderedList":
        exec("insertOrderedList");
        break;
      case "blockquote":
        exec("formatBlock", "blockquote");
        break;
      case "code":
        exec("formatBlock", "pre");
        break;
      case "link": {
        const url = window.prompt("Nhập URL liên kết:");
        if (url) exec("createLink", url);
        break;
      }
      case "clear":
        exec("removeFormat");
        break;
      default:
        break;
    }
  };

  const onInput = (e: React.FormEvent<HTMLDivElement>) => {
    const current = (e.target as HTMLDivElement).innerHTML;
    setHtml(current);
    onChange?.(current);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-wrap gap-2 rounded-t-lg border border-b-0 border-gray-200 bg-gray-50 p-2">
        {actions.includes("bold") && (
          <Button size="sm" variant="outline" onClick={() => handleAction("bold")}>B</Button>
        )}
        {actions.includes("italic") && (
          <Button size="sm" variant="outline" onClick={() => handleAction("italic")}>
            <span className="italic">I</span>
          </Button>
        )}
        {actions.includes("underline") && (
          <Button size="sm" variant="outline" onClick={() => handleAction("underline")}>
            <span className="underline">U</span>
          </Button>
        )}
        {actions.includes("strikeThrough") && (
          <Button size="sm" variant="outline" onClick={() => handleAction("strikeThrough")}>
            <span className="line-through">S</span>
          </Button>
        )}

        <span className="mx-1 h-6 w-px bg-gray-300" />

        {actions.includes("h1") && (
          <Button size="sm" variant="outline" onClick={() => handleAction("h1")}>H1</Button>
        )}
        {actions.includes("h2") && (
          <Button size="sm" variant="outline" onClick={() => handleAction("h2")}>H2</Button>
        )}
        {actions.includes("paragraph") && (
          <Button size="sm" variant="outline" onClick={() => handleAction("paragraph")}>P</Button>
        )}

        <span className="mx-1 h-6 w-px bg-gray-300" />

        {actions.includes("unorderedList") && (
          <Button size="sm" variant="outline" onClick={() => handleAction("unorderedList")}>
            • List
          </Button>
        )}
        {actions.includes("orderedList") && (
          <Button size="sm" variant="outline" onClick={() => handleAction("orderedList")}>
            1. List
          </Button>
        )}
        {actions.includes("blockquote") && (
          <Button size="sm" variant="outline" onClick={() => handleAction("blockquote")}>
            “Quote”
          </Button>
        )}
        {actions.includes("code") && (
          <Button size="sm" variant="outline" onClick={() => handleAction("code")}>
            {'</>'}
          </Button>
        )}

        <span className="mx-1 h-6 w-px bg-gray-300" />

        {actions.includes("link") && (
          <Button size="sm" variant="outline" onClick={() => handleAction("link")}>
            Link
          </Button>
        )}
        {actions.includes("clear") && (
          <Button size="sm" variant="outline" onClick={() => handleAction("clear")}>
            Xóa định dạng
          </Button>
        )}
      </div>

      <div className="relative">
        <div
          ref={editorRef}
          className={cn(
            "prose prose-sm max-w-none rounded-b-lg border border-gray-200 p-3 focus:outline-none min-h-[180px]",
            "focus:ring-2 focus:ring-blue-200",
            "bg-white"
          )}
          contentEditable
          role="textbox"
          aria-multiline
          onInput={onInput}
          onBlur={onInput}
          suppressContentEditableWarning
        />

        {!html && (
          <div className="pointer-events-none absolute left-3 top-3 select-none text-gray-400">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

export default DescriptionEditor;
