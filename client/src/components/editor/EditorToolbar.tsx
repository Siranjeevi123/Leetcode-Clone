import type { EditorTheme } from "../../hooks/useEditorSettings";
import Button from "../ui/Button";
import { LANGUAGE_LABELS, LANGUAGES, type Language } from "../../types";

interface EditorToolbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onRun: () => void;
  onSubmit: () => void;
  running: boolean;
  submitting: boolean;
  theme: EditorTheme;
  onThemeChange: (theme: EditorTheme) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  aiOpen: boolean;
  onToggleAi: () => void;
  descriptionOpen?: boolean;
  onToggleDescription?: () => void;
}

export default function EditorToolbar({
  language,
  onLanguageChange,
  onRun,
  onSubmit,
  running,
  submitting,
  theme,
  onThemeChange,
  fontSize,
  onFontSizeChange,
  aiOpen,
  onToggleAi,
  descriptionOpen = true,
  onToggleDescription,
}: EditorToolbarProps) {
  return (
    <div className="sticky top-0 z-10 h-12 flex items-center justify-between px-3 bg-sidebar border-b border-border-subtle shrink-0">
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as Language)}
          className="bg-surface-container-high border border-border-subtle rounded-lg px-3 py-1.5 text-xs font-semibold hover:border-primary-container input-focus-ring"
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {LANGUAGE_LABELS[l]}
            </option>
          ))}
        </select>

        <select
          value={theme}
          onChange={(e) => onThemeChange(e.target.value as EditorTheme)}
          className="hidden sm:block bg-surface-container-high border border-border-subtle rounded-lg px-2 py-1.5 text-xs input-focus-ring"
          aria-label="Editor theme"
        >
          <option value="vs-dark">Dark</option>
          <option value="vs-light">Light</option>
          <option value="hc-black">High Contrast</option>
        </select>

        <select
          value={fontSize}
          onChange={(e) => onFontSizeChange(Number(e.target.value))}
          className="hidden md:block bg-surface-container-high border border-border-subtle rounded-lg px-2 py-1.5 text-xs input-focus-ring"
          aria-label="Font size"
        >
          {[12, 13, 14, 15, 16, 18, 20].map((s) => (
            <option key={s} value={s}>
              {s}px
            </option>
          ))}
        </select>

      </div>

      <div className="flex items-center gap-2">
        {onToggleDescription && (
          <button
            type="button"
            onClick={onToggleDescription}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              descriptionOpen
                ? "bg-primary-container/20 text-primary border border-primary-container/40"
                : "bg-surface-elevated text-on-surface-variant border border-border-subtle hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-sm">description</span>
            <span className="hidden sm:inline">Description</span>
          </button>
        )}

        <button
          type="button"
          onClick={onToggleAi}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            aiOpen
              ? "bg-primary-container/20 text-primary border border-primary-container/40"
              : "bg-surface-elevated text-on-surface-variant border border-border-subtle hover:text-primary"
          }`}
        >
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          AI
        </button>

        <Button variant="secondary" size="sm" onClick={onRun} loading={running} disabled={submitting}>
          Run
        </Button>
        <Button size="sm" onClick={onSubmit} loading={submitting} disabled={running}>
          Submit
        </Button>
      </div>
    </div>
  );
}
