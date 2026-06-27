export const AI_SUGGESTIONS = [
  { id: "explain", label: "Explain Problem", prompt: "Explain this problem in simple terms with an approach to solve it." },
  { id: "hint", label: "Give Hint", prompt: "Give me a hint without revealing the full solution." },
  { id: "debug", label: "Debug My Code", prompt: "Debug my current code and explain what is wrong." },
  { id: "optimize", label: "Optimize Code", prompt: "How can I optimize my current solution for better time and space complexity?" },
  { id: "dryrun", label: "Dry Run", prompt: "Do a dry run of my code on the first example test case step by step." },
  { id: "complexity", label: "Explain Complexity", prompt: "Analyze the time and space complexity of my current approach." },
  { id: "linebyline", label: "Explain Line by Line", prompt: "Explain my code line by line." },
  { id: "testcases", label: "Generate Test Cases", prompt: "Generate additional edge case test cases I should consider." },
  { id: "better", label: "Generate Better Solution", prompt: "Suggest a better approach or alternative solution for this problem." },
] as const;

interface SuggestedActionsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export default function SuggestedActions({ onSelect, disabled }: SuggestedActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 p-3 border-b border-border-subtle">
      {AI_SUGGESTIONS.map((action) => (
        <button
          key={action.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(action.prompt)}
          className="text-left px-3 py-2 rounded-lg border border-border-subtle bg-surface-container-low text-xs text-on-surface-variant hover:bg-surface-container hover:text-primary hover:border-primary-container/30 transition-all disabled:opacity-50"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
