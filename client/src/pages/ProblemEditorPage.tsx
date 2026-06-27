import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getErrorMessage } from "../api/client";
import { deleteProblem, getProblem } from "../api/problems";
import { getSubmissions, runCode, submitCode } from "../api/submissions";
import AiAssistantPanel from "../components/ai/AiAssistantPanel";
import ConfirmModal from "../components/ConfirmModal";
import CodeEditor from "../components/editor/CodeEditor";
import EditorToolbar from "../components/editor/EditorToolbar";
import ProblemDescriptionPanel from "../components/editor/ProblemDescriptionPanel";
import ResultCard from "../components/editor/ResultCard";
import SubmissionHistoryTable from "../components/editor/SubmissionHistoryTable";
import WorkspaceLayout from "../components/editor/WorkspaceLayout";
import Navbar from "../components/Navbar";
import TestCaseText from "../components/TestCaseText";
import LoadingScreen from "../components/ui/LoadingScreen";
import { useDebouncedEffect, useEditorSettings } from "../hooks/useEditorSettings";
import { useAuthStore } from "../store/authStore";
import { toast } from "../store/toastStore";
import type {
  JudgeResult,
  Language,
  ProblemDetail,
  Submission,
  SubmissionStatus,
} from "../types";
import {
  extractJudgeError,
  getApiErrorDetail,
  judgeErrorTitle,
} from "../utils/judgeErrors";

type LeftTab = "description" | "submissions";
type BottomTab = "cases" | "results";

function isAccepted(result: JudgeResult) {
  return result.status.id === 3;
}

function statusLabel(status: SubmissionStatus) {
  const map: Record<SubmissionStatus, string> = {
    accepted: "Accepted",
    wrong_answer: "Wrong Answer",
    runtime_error: "Runtime Error",
    compilation_error: "Compilation Error",
    time_limit_exceeded: "Time Limit Exceeded",
    pending: "Pending",
  };
  return map[status];
}

/** Returns true when viewport >= 768px (md). Uses JS so it's unaffected by Tailwind v4 CSS layer ordering. */
function useIsDesktop() {
  const [v, setV] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : true
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const h = (e: MediaQueryListEvent) => setV(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return v;
}

/** Returns true when viewport >= 1024px (lg). Used to inline-render the AI side panel vs overlay. */
function useIsLargeScreen() {
  const [v, setV] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 1024px)").matches : true
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const h = (e: MediaQueryListEvent) => setV(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return v;
}

export default function ProblemEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, fetchProfile } = useAuthStore();
  const isAdmin = user?.role === "admin";

  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState("");
  const [leftTab, setLeftTab] = useState<LeftTab>("description");
  const [bottomTab, setBottomTab] = useState<BottomTab>("results");
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [runResults, setRunResults] = useState<JudgeResult[] | null>(null);
  const [submitResult, setSubmitResult] = useState<Submission | null>(null);
  const [panelError, setPanelError] = useState<{ title: string; message: string } | null>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [descriptionOpen, setDescriptionOpen] = useState(true);
  const [mobileTab, setMobileTab] = useState<"description" | "code" | "submissions">("description");
  const [pendingAiPrompt, setPendingAiPrompt] = useState<string | null>(null);
  const [viewCodeSubmission, setViewCodeSubmission] = useState<Submission | null>(null);
  const isDesktop = useIsDesktop();
  const isLargeScreen = useIsLargeScreen();

  const {
    theme,
    fontSize,
    setTheme,
    setFontSize,
    getAutoSavedCode,
    saveCode,
  } = useEditorSettings(id ?? "default");

  const loadSubmissions = useCallback(async () => {
    if (!id) return;
    try {
      const { submissions: s } = await getSubmissions(id);
      setSubmissions(
        [...s].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      );
    } catch {
      /* ignore */
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    getProblem(id)
      .then(({ problem: p }) => {
        setProblem(p);
        const starter = p.startCode.find((s) => s.language === "javascript") ?? p.startCode[0];
        if (starter) {
          setLanguage(starter.language);
          const saved = getAutoSavedCode(starter.language);
          setCode(saved ?? starter.initialCode);
        }
      })
      .catch((err) => {
        toast.error(getErrorMessage(err));
        navigate("/problems");
      });
    loadSubmissions();
  }, [id, navigate, loadSubmissions, getAutoSavedCode]);

  useEffect(() => {
    if (leftTab === "description" && mobileTab === "submissions") {
      setMobileTab("description");
    } else if (leftTab === "submissions" && mobileTab === "description") {
      setMobileTab("submissions");
    }
  }, [leftTab, mobileTab]);

  useDebouncedEffect(() => {
    if (id && code) saveCode(language, code);
  }, [code, language, id, saveCode]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    const starter = problem?.startCode.find((s) => s.language === lang);
    const saved = id ? getAutoSavedCode(lang) : null;
    if (saved) setCode(saved);
    else if (starter) setCode(starter.initialCode);
  };

  const buildAskAiPrompt = (context: string) => {
    return `Help me understand this result:\n\n${context}\n\nPlease analyze what went wrong and suggest fixes.`;
  };

  const openAiWithPrompt = (prompt: string) => {
    setAiOpen(true);
    setPendingAiPrompt(prompt);
  };

  const handleAskAiFromResult = (errorText: string) => {
    openAiWithPrompt(buildAskAiPrompt(errorText));
  };

  const handleRun = async () => {
    if (!id || running) return;
    setRunning(true);
    setBottomTab("results");
    setTerminalOpen(true);
    setRunResults(null);
    setSubmitResult(null);
    setPanelError(null);
    try {
      const { results } = await runCode(id, { code, language });
      setRunResults(results);
      const allPass = results.every(isAccepted);
      if (!allPass) {
        const failedIndex = results.findIndex((r) => !isAccepted(r));
        const failed = results[failedIndex];
        const errorDetail = extractJudgeError(failed, problem?.visibleTestCases[failedIndex]);
        toast.error(errorDetail?.split("\n")[0] ?? "Test case failed");
      } else {
        toast.success("All test cases passed");
      }
    } catch (err) {
      const message = getApiErrorDetail(err);
      setPanelError({ title: "Run Failed", message });
      toast.error(getErrorMessage(err));
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!id || submitting) return;
    setSubmitting(true);
    setBottomTab("results");
    setTerminalOpen(true);
    setRunResults(null);
    setSubmitResult(null);
    setPanelError(null);
    try {
      const { submission } = await submitCode(id, { code, language });
      setSubmitResult(submission);
      setLeftTab("submissions");
      await loadSubmissions();
      await fetchProfile();

      if (submission.status === "accepted") {
        toast.success("Solution accepted!");
      } else {
        toast.error(submission.errorMessage?.split("\n")[0] || statusLabel(submission.status));
      }
    } catch (err) {
      const message = getApiErrorDetail(err);
      setPanelError({ title: "Submit Failed", message });
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoadSubmissionCode = (submission: Submission) => {
    setLanguage(submission.language);
    setCode(submission.code);
    setViewCodeSubmission(null);
    toast.info("Loaded submission into editor");
  };

  const handleDelete = async () => {
    if (!id || deleting) return;
    setDeleting(true);
    try {
      await deleteProblem(id);
      toast.success("Problem deleted successfully");
      navigate("/problems");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  if (!problem) {
    return <LoadingScreen message="Loading problem..." />;
  }

  const leftPanel = (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden', background: 'var(--color-sidebar)' }}>
      <div className="flex bg-surface-container-lowest border-b border-border-subtle shrink-0">
        {(
          [
            ["description", "description", "Description"],
            ["submissions", "history", "Submissions"],
          ] as const
        ).map(([tab, icon, label]) => (
          <button
            key={tab}
            onClick={() => setLeftTab(tab)}
            className={`flex items-center gap-1 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-r border-border-subtle ${
              leftTab === tab
                ? "bg-surface-container-high text-primary border-b-2 border-b-primary"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{icon}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-6 min-h-0">
        {leftTab === "description" ? (
          <ProblemDescriptionPanel
            problem={problem}
            isAdmin={isAdmin}
            onDelete={() => setDeleteModalOpen(true)}
          />
        ) : (
          <SubmissionHistoryTable
            submissions={submissions}
            statusLabel={statusLabel}
            onViewCode={(s) => setViewCodeSubmission(s)}
          />
        )}
      </div>
    </div>
  );

  const centerPanel = (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden', minWidth: 0, background: 'var(--color-editor-bg)' }}>
      <EditorToolbar
        language={language}
        onLanguageChange={handleLanguageChange}
        onRun={handleRun}
        onSubmit={handleSubmit}
        running={running}
        submitting={submitting}
        theme={theme}
        onThemeChange={setTheme}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        aiOpen={aiOpen}
        onToggleAi={() => setAiOpen((v) => !v)}
        descriptionOpen={descriptionOpen}
        onToggleDescription={() => setDescriptionOpen((v) => !v)}
      />

      <div
        className={`flex-1 min-w-0 min-h-0 relative ${running || submitting ? "opacity-70 pointer-events-none" : ""}`}
      >
        <CodeEditor
          language={language}
          code={code}
          onChange={setCode}
          theme={theme}
          fontSize={fontSize}
          minimap={false}
          layoutTrigger={aiOpen.toString() + descriptionOpen.toString()}
        />
      </div>

      <div
        className={`bg-background border-t border-border-subtle flex flex-col shrink-0 transition-all ${
          terminalOpen ? "h-[28%] min-h-[120px] max-h-[240px]" : "h-9"
        }`}
      >
        <div className="h-9 flex items-center justify-between px-3 bg-surface-container-lowest border-b border-border-subtle shrink-0">
          <div className="flex gap-3 h-full">
            {(
              [
                ["cases", "Test Cases"],
                ["results", "Results"],
              ] as const
            ).map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setBottomTab(tab)}
                className={`h-full px-2 text-xs font-bold uppercase ${
                  bottomTab === tab
                    ? "border-b-2 border-primary text-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setTerminalOpen(!terminalOpen)}
            className="p-1 text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">
              {terminalOpen ? "expand_more" : "expand_less"}
            </span>
          </button>
        </div>

        {terminalOpen && (
          <div className="flex-1 p-3 overflow-auto min-h-0">
            {bottomTab === "cases" ? (
              <div className="space-y-3">
                {problem.visibleTestCases.map((tc, i) => (
                  <div key={i} className="rounded-lg border border-border-subtle bg-surface p-3 space-y-2">
                    <div className="text-[11px] uppercase tracking-widest font-bold text-on-surface-variant">
                      Case {i + 1}
                    </div>
                    <TestCaseText label="Input:" value={tc.input} variant="muted" />
                    <TestCaseText label="Output:" value={tc.output} variant="muted" />
                  </div>
                ))}
              </div>
            ) : running || submitting ? (
              <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                <span className="material-symbols-outlined animate-spin-custom">sync</span>
                {running ? "Running test cases..." : "Submitting solution..."}
              </div>
            ) : panelError ? (
              <ResultCard
                status="runtime_error"
                title={panelError.title}
                errorMessage={panelError.message}
                onAskAi={() => handleAskAiFromResult(panelError.message)}
              />
            ) : submitResult ? (
              <ResultCard
                status={submitResult.status}
                title={statusLabel(submitResult.status)}
                passed={submitResult.testCasesPassed}
                total={submitResult.testCasesTotal}
                runtime={
                  submitResult.status === "accepted"
                    ? `${(submitResult.runtime * 1000).toFixed(0)}ms`
                    : undefined
                }
                memory={
                  submitResult.status === "accepted" ? `${submitResult.memory}KB` : undefined
                }
                errorMessage={submitResult.errorMessage}
                onAskAi={
                  submitResult.status !== "accepted"
                    ? () =>
                        handleAskAiFromResult(
                          submitResult.errorMessage || statusLabel(submitResult.status)
                        )
                    : undefined
                }
              />
            ) : runResults ? (
              <div className="space-y-3">
                {runResults.every(isAccepted) && (
                  <ResultCard status="accepted" title="All Test Cases Passed" />
                )}
                {runResults.map((r, i) => {
                  const testCase = problem.visibleTestCases[i];
                  const error = extractJudgeError(r, testCase);
                  const accepted = isAccepted(r);
                  if (accepted && runResults.every(isAccepted)) return null;

                  return (
                    <ResultCard
                      key={i}
                      status={accepted ? "passed" : "failed"}
                      title={`Case ${i + 1}: ${accepted ? "Passed" : r.status.description}`}
                      runtime={r.time ? `${(parseFloat(r.time) * 1000).toFixed(0)}ms` : undefined}
                      memory={r.memory ? `${r.memory}KB` : undefined}
                      errorMessage={error ?? undefined}
                      onAskAi={
                        !accepted
                          ? () =>
                              handleAskAiFromResult(
                                error ?? `${judgeErrorTitle(r)} on case ${i + 1}`
                              )
                          : undefined
                      }
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">Run or submit to see results.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const rightPanel = (
    <AiAssistantPanel
      problemId={problem._id}
      problemTitle={problem.title}
      difficulty={problem.difficulty}
      language={language}
      code={code}
      pendingPrompt={pendingAiPrompt}
      onPendingConsumed={() => setPendingAiPrompt(null)}
      onClose={() => setAiOpen(false)}
    />
  );

  const aiOverlay =
    aiOpen && (!isLargeScreen || !isDesktop) ? (
      <div
        className={isDesktop ? "ws-ai-drawer-backdrop" : "ws-ai-sheet-backdrop"}
        onClick={() => setAiOpen(false)}
      >
        <div
          className={isDesktop ? "ws-ai-drawer" : "ws-ai-sheet"}
          onClick={(e) => e.stopPropagation()}
        >
          {rightPanel}
        </div>
      </div>
    ) : null;

  return (
    <div className="bg-app-bg text-on-surface h-screen flex flex-col overflow-hidden">
      <Navbar />

      <main className="pt-14 flex-1 flex flex-col min-h-0 overflow-hidden">
        {!isDesktop && (
          <div className="flex shrink-0 border-b border-border-subtle bg-surface-container-lowest">
            {(
              [
                ["description", "description", "Description"],
                ["code", "code", "Code"],
                ["submissions", "history", "Submissions"],
              ] as const
            ).map(([tab, icon, label]) => (
              <button
                key={tab}
                onClick={() => {
                  setMobileTab(tab);
                  if (tab === "description" || tab === "submissions") {
                    setLeftTab(tab);
                  }
                }}
                className={`flex-1 flex items-center justify-center gap-1 py-3 text-xs font-semibold uppercase tracking-wider border-r border-border-subtle last:border-r-0 ${
                  mobileTab === tab
                    ? "bg-surface-container-high text-primary border-b-2 border-b-primary"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}

        {!isDesktop && (
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {mobileTab === "description" || mobileTab === "submissions" ? leftPanel : centerPanel}
          </div>
        )}

        {isDesktop && (
          <WorkspaceLayout
            left={leftPanel}
            center={centerPanel}
            right={rightPanel}
            showRight={aiOpen && isLargeScreen}
            descriptionOpen={descriptionOpen}
          />
        )}

        {aiOverlay}
      </main>

      <ConfirmModal
        open={deleteModalOpen}
        title="Delete Problem"
        message="Are you sure you want to delete this problem?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />

      {viewCodeSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/60"
            onClick={() => setViewCodeSubmission(null)}
          />
          <div className="relative w-full max-w-2xl max-h-[70vh] flex flex-col rounded-xl border border-border-subtle bg-surface shadow-2xl">
            <div className="p-4 border-b border-border-subtle flex justify-between items-center">
              <h3 className="font-semibold">Submitted Code</h3>
              <button type="button" onClick={() => setViewCodeSubmission(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <pre className="p-4 overflow-auto text-xs font-mono whitespace-pre-wrap flex-1">
              {viewCodeSubmission.code}
            </pre>
            <div className="p-4 border-t border-border-subtle flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setViewCodeSubmission(null)}
                className="px-4 py-2 rounded-lg border border-border-subtle text-sm"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleLoadSubmissionCode(viewCodeSubmission)}
                className="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container text-sm font-semibold"
              >
                Load in Editor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
