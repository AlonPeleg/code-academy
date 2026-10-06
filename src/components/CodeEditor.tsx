import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { monaco, setReactMode } from '../monaco/setup';

interface Props {
  /** Unique path so every file keeps its own undo history and model */
  path: string;
  language: string;
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  reactMode?: boolean;
}

const FOUR_SPACE = new Set(['python', 'c', 'cpp', 'csharp', 'java', 'rust', 'go', 'sql']);

export default function CodeEditor({ path, language, value, onChange, onRun, reactMode }: Props) {
  const runRef = useRef(onRun);
  runRef.current = onRun;

  useEffect(() => {
    setReactMode(!!reactMode);
    return () => setReactMode(false);
  }, [reactMode]);

  return (
    <Editor
      height="100%"
      path={path}
      language={language}
      value={value}
      theme="academy-dark"
      loading={<div className="editor-loading">Loading editor...</div>}
      onChange={(v) => onChange(v ?? '')}
      onMount={(editor) => {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runRef.current?.());
      }}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        tabSize: FOUR_SPACE.has(language) ? 4 : 2,
        insertSpaces: true,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        padding: { top: 12, bottom: 12 },
        // IntelliSense: suggestions as you type, parameter hints, snippets, hover docs
        quickSuggestions: { other: true, comments: false, strings: true },
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'smart',
        tabCompletion: 'on',
        snippetSuggestions: 'top',
        wordBasedSuggestions: 'currentDocument',
        parameterHints: { enabled: true },
        hover: { enabled: true, delay: 250 },
        suggest: { showIcons: true, showStatusBar: true, preview: true, showInlineDetails: true },
        bracketPairColorization: { enabled: true },
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        autoSurround: 'languageDefined',
        linkedEditing: true,
        formatOnPaste: true,
        renderLineHighlight: 'line',
        smoothScrolling: true,
        cursorSmoothCaretAnimation: 'on',
        'semanticHighlighting.enabled': true,
      }}
    />
  );
}
