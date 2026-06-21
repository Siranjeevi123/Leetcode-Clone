import Editor from "@monaco-editor/react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getErrorMessage } from "../api/client";
import { getProblem } from "../api/problems";
import { getSubmissions, runCode, submitCode } from "../api/submissions";
import DifficultyBadge from "../components/DifficultyBadge";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/authStore";
import { toast } from "../store/toastStore";
import type {
  JudgeResult,
  Language,
  ProblemDetail,
  Submission,
  SubmissionStatus,
} from "../types";
import { LANGUAGE_LABELS, LANGUAGES, MONACO_LANGUAGE, TAG_LABELS } from "../types";

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

function statusColor(status: SubmissionStatus) {
  if (status === "accepted") return "text-success";
  if (status === "pending") return "text-warning";
  return "text-error";
}

export default function ProblemEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchProfile } = useAuthStore();

  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState("");
  const [leftTab, setLeftTab] = useState<LeftTab>("description");
  const [bottomTab, setBottomTab] = useState<BottomTab>("cases");
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResults, setRunResults] = useState<JudgeResult[] | null>(null);
  const [submitResult, setSubmitResult] = useState<Submission | null>(null);
  const [statusBanner, setStatusBanner] = useState<{
    type: "success" | "error";
    title: string;
    detail?: string;
  } | null>(null);

  const loadSubmissions = useCallback(async () => {
    if (!id) return;
    try {
      const { submissions: s } = await getSubmissions(id);
      setSubmissions(s);
    } catch {
      /* ignore */
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    getProblem(id)
      .then(({ problem: p }) => {
        setProblem(p);
        const starter =
          p.startCode.find((s) => s.language === "javascript") ?? p.startCode[0];
        if (starter) {
          setLanguage(starter.language);
          setCode(starter.initialCode);
        }
      })
      .catch((err) => {
        toast.error(getErrorMessage(err));
        navigate("/problems");
      });
    loadSubmissions();
  }, [id, navigate, loadSubmissions]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    const starter = problem?.startCode.find((s) => s.language === lang);
    if (starter) setCode(starter.initialCode);
  };

  const handleRun = async () => {
    if (!id || running) return;
    setRunning(true);
    setBottomTab("results");
    setTerminalOpen(true);
    setRunResults(null);
    setSubmitResult(null);
    setStatusBanner(null);
    try {
      const { results } = await runCode(id, { code, language });
      setRunResults(results);
      const allPass = results.every(isAccepted);
      if (allPass) {
        setStatusBanner({
          type: "success",
          title: "All test cases passed",
          detail: "Visible test cases completed successfully",
        });
      } else {
        const failed = results.findIndex((r) => !isAccepted(r));
        setStatusBanner({
          type: "error",
          title: "Test case failed",
          detail: `Case ${failed + 1}: ${results[failed].status.description}`,
        });
      }
    } catch (err) {
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
    setStatusBanner(null);
    try {
      const { submission } = await submitCode(id, { code, language });
      setSubmitResult(submission);
      await loadSubmissions();
      await fetchProfile();

      if (submission.status === "accepted") {
        setStatusBanner({
          type: "success",
          title: "Accepted",
          detail: `Runtime: ${(submission.runtime * 1000).toFixed(0)}ms | Memory: ${submission.memory}KB`,
        });
        toast.success("Solution accepted!");
      } else {
        setStatusBanner({
          type: "error",
          title: statusLabel(submission.status),
          detail: submission.errorMessage || `${submission.testCasesPassed}/${submission.testCasesTotal} passed`,
        });
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <span className="material-symbols-outlined animate-spin-custom text-primary text-3xl">
          sync
        </span>
      </div>
    );
  }

  return (
    <div className="bg-app-bg text-on-surface min-h-screen">
      <Navbar />

      <main className="pt-14 flex h-[calc(100vh-56px)] overflow-hidden flex-col lg:flex-row">
        {/* Left panel */}
        <aside className="w-full lg:w-[40%] flex flex-col bg-sidebar border-r border-border-subtle overflow-hidden min-h-[300px] lg:min-h-0">
          <div className="flex bg-surface-container-lowest border-b border-border-subtle">
            <button
              onClick={() => setLeftTab("description")}
              className={`flex items-center gap-1 px-4 py-2 text-xs font-semibold uppercase tracking-wider border-r border-border-subtle ${
                leftTab === "description"
                  ? "bg-surface-container-high text-primary"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">description</span>
              Description
            </button>
            <button
              onClick={() => setLeftTab("submissions")}
              className={`flex items-center gap-1 px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
                leftTab === "submissions"
                  ? "bg-surface-container-high text-primary"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">list_alt</span>
              Submissions
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {leftTab === "description" ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-4 mb-2 flex-wrap">
                    <h1 className="text-2xl font-semibold text-on-surface">{problem.title}</h1>
                    <DifficultyBadge difficulty={problem.difficulty} />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {problem.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-surface-container-highest px-2 py-0.5 rounded text-on-surface-variant"
                      >
                        {TAG_LABELS[t]}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-on-surface leading-relaxed whitespace-pre-wrap">
                  {problem.description}
                </div>
                {problem.visibleTestCases.map((tc, i) => (
                  <div key={i} className="space-y-2">
                    <h3 className="text-lg font-semibold">Example {i + 1}:</h3>
                    <div className="bg-surface-container-high border border-border-subtle rounded-lg p-4 space-y-1 font-mono text-sm">
                      <div>
                        <span className="font-semibold">Input:</span> {tc.input}
                      </div>
                      <div>
                        <span className="font-semibold">Output:</span> {tc.output}
                      </div>
                      <div>
                        <span className="font-semibold">Explanation:</span> {tc.explanation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {submissions.length === 0 ? (
                  <p className="text-sm text-on-surface-variant">No submissions yet.</p>
                ) : (
                  submissions.map((s) => (
                    <div
                      key={s._id}
                      className="p-3 border border-border-subtle rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className={`font-semibold text-sm ${statusColor(s.status)}`}>
                          {statusLabel(s.status)}
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          {new Date(s.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-on-surface-variant mt-1 flex gap-4">
                        <span>{LANGUAGE_LABELS[s.language]}</span>
                        <span>
                          {s.testCasesPassed}/{s.testCasesTotal} passed
                        </span>
                        {s.status === "accepted" && (
                          <span>
                            {(s.runtime * 1000).toFixed(0)}ms · {s.memory}KB
                          </span>
                        )}
                      </div>
                      {s.errorMessage && (
                        <pre className="mt-2 text-xs text-error font-mono whitespace-pre-wrap">
                          {s.errorMessage}
                        </pre>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Right panel */}
        <section className="w-full lg:w-[60%] flex flex-col bg-editor-bg relative flex-1 min-h-0">
          <div className="h-11 flex items-center justify-between px-4 bg-surface-container-low border-b border-border-subtle shrink-0">
            <div className="flex items-center gap-4">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as Language)}
                className="bg-surface-container-high border border-border-subtle rounded px-3 py-1 text-sm hover:border-primary-container"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {LANGUAGE_LABELS[l]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRun}
                disabled={running || submitting}
                className="px-4 py-1.5 border border-border-subtle text-on-surface hover:bg-surface-container rounded-lg text-xs font-semibold uppercase min-w-[80px] flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {running ? (
                  <>
                    <span className="material-symbols-outlined animate-spin-custom text-[18px]">
                      sync
                    </span>
                    Running...
                  </>
                ) : (
                  "Run"
                )}
              </button>
              <button
                onClick={handleSubmit}
                disabled={running || submitting}
                className="px-4 py-1.5 bg-primary-container text-on-primary-container hover:brightness-110 rounded-lg text-xs font-semibold uppercase font-bold disabled:opacity-70 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin-custom text-[18px]">
                      sync
                    </span>
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>

          {statusBanner && (
            <div
              className={`absolute top-14 right-4 z-20 flex items-center gap-2 px-4 py-2 rounded-lg border ${
                statusBanner.type === "success"
                  ? "bg-success/10 border-success/30 text-success"
                  : "bg-error/10 border-error/30 text-error"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {statusBanner.type === "success" ? "check_circle" : "cancel"}
              </span>
              <div>
                <div className="font-bold text-sm">{statusBanner.title}</div>
                {statusBanner.detail && (
                  <div className="text-[10px] opacity-80">{statusBanner.detail}</div>
                )}
              </div>
              <button onClick={() => setStatusBanner(null)} className="ml-2 opacity-50 hover:opacity-100">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          )}

          <div className={`flex-1 min-h-[200px] relative ${running ? "opacity-70 pointer-events-none" : ""}`}>
            <Editor
              height="100%"
              language={MONACO_LANGUAGE[language]}
              value={code}
              onChange={(v) => setCode(v ?? "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "JetBrains Mono, monospace",
                scrollBeyondLastLine: false,
                padding: { top: 12 },
              }}
            />
          </div>

          {/* Bottom terminal */}
          <div
            className={`bg-background border-t border-border-subtle flex flex-col transition-all shrink-0 ${
              terminalOpen ? "h-1/3 min-h-[160px]" : "h-9"
            }`}
          >
            <div className="h-9 flex items-center justify-between px-4 bg-surface-container-lowest border-b border-border-subtle shrink-0">
              <div className="flex gap-4 h-full">
                <button
                  onClick={() => setBottomTab("cases")}
                  className={`h-full px-2 text-xs font-bold uppercase ${
                    bottomTab === "cases"
                      ? "border-b-2 border-primary text-primary"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Test Cases
                </button>
                <button
                  onClick={() => setBottomTab("results")}
                  className={`h-full px-2 text-xs font-bold uppercase ${
                    bottomTab === "results"
                      ? "border-b-2 border-primary text-primary"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Test Results
                </button>
              </div>
              <button
                onClick={() => setTerminalOpen(!terminalOpen)}
                className="p-1 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {terminalOpen ? "expand_more" : "expand_less"}
                </span>
              </button>
            </div>

            {terminalOpen && (
              <div className="flex-1 p-4 font-mono text-sm overflow-auto">
                {bottomTab === "cases" ? (
                  <div className="space-y-4">
                    {problem.visibleTestCases.map((tc, i) => (
                      <div key={i} className="space-y-1">
                        <div className="text-[11px] uppercase tracking-widest font-bold text-on-surface-variant">
                          Case {i + 1}
                        </div>
                        <div className="bg-surface-container-high rounded p-2 border border-border-subtle space-y-1">
                          <div>
                            <span className="text-on-surface-variant">Input: </span>
                            {tc.input}
                          </div>
                          <div>
                            <span className="text-on-surface-variant">Output: </span>
                            {tc.output}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : running || submitting ? (
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined animate-spin-custom">sync</span>
                    {running ? "Running test cases..." : "Submitting solution..."}
                  </div>
                ) : submitResult ? (
                  <div className="space-y-3">
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                        submitResult.status === "accepted"
                          ? "bg-success/10 border-success/30 text-success"
                          : "bg-error/10 border-error/30 text-error"
                      }`}
                    >
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {submitResult.status === "accepted" ? "check_circle" : "cancel"}
                      </span>
                      <div>
                        <div className="font-bold">{statusLabel(submitResult.status)}</div>
                        <div className="text-xs opacity-80">
                          {submitResult.testCasesPassed}/{submitResult.testCasesTotal} test cases passed
                        </div>
                      </div>
                    </div>
                    {submitResult.errorMessage && (
                      <pre className="text-error whitespace-pre-wrap">{submitResult.errorMessage}</pre>
                    )}
                  </div>
                ) : runResults ? (
                  <div className="space-y-3">
                    {runResults.map((r, i) => (
                      <div key={i} className="space-y-1">
                        <div
                          className={`text-[11px] uppercase tracking-widest font-bold ${
                            isAccepted(r) ? "text-success" : "text-error"
                          }`}
                        >
                          Case {i + 1}: {isAccepted(r) ? "Passed" : "Failed"} — {r.status.description}
                        </div>
                        {r.stdout && (
                          <pre className="bg-surface-container-high rounded p-2 border border-border-subtle text-on-surface whitespace-pre-wrap">
                            {r.stdout}
                          </pre>
                        )}
                        {(r.stderr || r.compile_output) && (
                          <pre className="bg-surface-container-high rounded p-2 border border-border-subtle text-error whitespace-pre-wrap">
                            {r.stderr || r.compile_output}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-on-surface-variant">Run or submit to see results.</p>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
