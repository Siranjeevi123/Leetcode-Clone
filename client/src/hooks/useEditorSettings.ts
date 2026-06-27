import { useCallback, useEffect, useState } from "react";

const THEME_KEY = "codeforge-editor-theme";
const FONT_SIZE_KEY = "codeforge-editor-font-size";
const MINIMAP_KEY = "codeforge-editor-minimap";
const AUTOSAVE_PREFIX = "codeforge-autosave-";

export type EditorTheme = "vs-dark" | "vs-light" | "hc-black";

export function useEditorSettings(problemId: string) {
  const [theme, setThemeState] = useState<EditorTheme>(
    () => (localStorage.getItem(THEME_KEY) as EditorTheme) || "vs-dark"
  );
  const [fontSize, setFontSizeState] = useState(() => {
    const stored = localStorage.getItem(FONT_SIZE_KEY);
    return stored ? Number(stored) : 14;
  });
  const [minimap, setMinimapState] = useState(
    () => localStorage.getItem(MINIMAP_KEY) !== "false"
  );

  const setTheme = useCallback((t: EditorTheme) => {
    setThemeState(t);
    localStorage.setItem(THEME_KEY, t);
  }, []);

  const setFontSize = useCallback((size: number) => {
    setFontSizeState(size);
    localStorage.setItem(FONT_SIZE_KEY, String(size));
  }, []);

  const setMinimap = useCallback((enabled: boolean) => {
    setMinimapState(enabled);
    localStorage.setItem(MINIMAP_KEY, String(enabled));
  }, []);

  const getAutoSavedCode = useCallback(
    (lang: string) => localStorage.getItem(`${AUTOSAVE_PREFIX}${problemId}-${lang}`),
    [problemId]
  );

  const saveCode = useCallback(
    (lang: string, codeValue: string) => {
      localStorage.setItem(`${AUTOSAVE_PREFIX}${problemId}-${lang}`, codeValue);
    },
    [problemId]
  );

  return {
    theme,
    fontSize,
    minimap,
    setTheme,
    setFontSize,
    setMinimap,
    getAutoSavedCode,
    saveCode,
  };
}

export function useDebouncedEffect(effect: () => void, deps: unknown[], delay = 500) {
  useEffect(() => {
    const id = setTimeout(effect, delay);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function usePanelSizes(key: string, defaults: number[]) {
  const storageKey = `codeforge-panels-${key}`;

  const [sizes, setSizes] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw) as number[];
    } catch {
      /* ignore */
    }
    return defaults;
  });

  const saveSizes = useCallback(
    (next: number[]) => {
      setSizes(next);
      localStorage.setItem(storageKey, JSON.stringify(next));
    },
    [storageKey]
  );

  return { sizes, saveSizes };
}
