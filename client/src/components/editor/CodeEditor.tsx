import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import type { EditorTheme } from "../../hooks/useEditorSettings";
import { MONACO_LANGUAGE, type Language } from "../../types";

interface CodeEditorProps {
  language: Language;
  code: string;
  onChange: (code: string) => void;
  theme: EditorTheme;
  fontSize: number;
  minimap: boolean;
  readOnly?: boolean;
  layoutTrigger?: any;
}

export default function CodeEditor({
  language,
  code,
  onChange,
  theme,
  fontSize,
  minimap,
  readOnly = false,
  layoutTrigger,
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.layout();
      const timer = setTimeout(() => {
        editorRef.current?.layout();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [layoutTrigger]);

  return (
    <div className="w-full h-full min-w-0 relative">
      <Editor
        width="100%"
        height="100%"
        language={MONACO_LANGUAGE[language]}
        value={code}
        onChange={(v) => onChange(v ?? "")}
        theme={theme}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: minimap },
          fontSize,
          fontFamily: "JetBrains Mono, monospace",
          scrollBeyondLastLine: false,
          padding: { top: 12 },
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          quickSuggestions: true,
          suggestOnTriggerCharacters: true,
          formatOnPaste: true,
          formatOnType: true,
          find: { addExtraSpaceOnTop: false },
          readOnly,
        }}
      />
    </div>
  );
}
