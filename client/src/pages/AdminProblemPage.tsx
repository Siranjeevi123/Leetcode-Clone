import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getErrorMessage } from "../api/client";
import { createProblem, getProblem, updateProblem } from "../api/problems";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { toast } from "../store/toastStore";
import type {
  CreateProblemPayload,
  Difficulty,
  Language,
  Tag,
} from "../types";
import { LANGUAGE_LABELS, LANGUAGES, TAG_LABELS, TAGS } from "../types";

const emptyCase = () => ({ input: "", output: "", explanation: "" });
const emptyHidden = () => ({ input: "", output: "" });
const defaultStarter = (lang: Language) => {
  if (lang === "javascript") return "// Write your solution here\n";
  if (lang === "java") return "class Solution {\n    \n}\n";
  return "// Write your solution here\n";
};

export default function AdminProblemPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [tags, setTags] = useState<Tag[]>(["array"]);
  const [visibleTestCases, setVisibleTestCases] = useState([emptyCase()]);
  const [hiddenTestCases, setHiddenTestCases] = useState([emptyHidden()]);
  const [activeLang, setActiveLang] = useState<Language>("javascript");
  const [startCodes, setStartCodes] = useState<Record<Language, string>>({
    javascript: defaultStarter("javascript"),
    java: defaultStarter("java"),
    "c++": defaultStarter("c++"),
  });
  const [solutions, setSolutions] = useState<Record<Language, string>>({
    javascript: defaultStarter("javascript"),
    java: defaultStarter("java"),
    "c++": defaultStarter("c++"),
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  useEffect(() => {
    if (!id) return;
    getProblem(id)
      .then(({ problem: p }) => {
        setTitle(p.title);
        setDescription(p.description);
        setDifficulty(p.difficulty);
        setTags(p.tags);
        setVisibleTestCases(
          p.visibleTestCases.length
            ? p.visibleTestCases.map((tc) => ({
                input: tc.input,
                output: tc.output,
                explanation: tc.explanation ?? "",
              }))
            : [emptyCase()]
        );
        const starters = { ...startCodes };
        p.startCode.forEach((s) => {
          starters[s.language] = s.initialCode;
        });
        setStartCodes(starters);
      })
      .catch((err) => {
        toast.error(getErrorMessage(err));
        navigate("/problems");
      })
      .finally(() => setInitialLoading(false));
  }, [id, navigate]);

  const toggleTag = (tag: Tag) => {
    setTags((prev) =>
      prev.includes(tag) ? (prev.length > 1 ? prev.filter((t) => t !== tag) : prev) : [...prev, tag]
    );
  };

  const buildPayload = (): CreateProblemPayload => ({
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode: LANGUAGES.map((language) => ({
      language,
      initialCode: startCodes[language],
    })),
    referenceSolution: LANGUAGES.map((language) => ({
      language,
      completeCode: solutions[language],
    })),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = buildPayload();
      if (isEdit && id) {
        await updateProblem(id, payload);
        toast.success("Problem updated");
      } else {
        await createProblem(payload);
        toast.success("Problem created");
      }
      navigate("/problems");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <span className="material-symbols-outlined animate-spin-custom text-primary text-3xl">
          sync
        </span>
      </div>
    );
  }

  return (
    <div className="bg-app-bg min-h-screen">
      <Navbar />

      <main className="pt-14 pb-8 px-4 md:px-10 flex flex-col items-center">
        <div className="w-full max-w-[800px] py-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-on-surface mb-1">
                {isEdit ? "Edit Problem" : "Create New Problem"}
              </h1>
              <p className="text-sm text-on-surface-variant">
                Define technical challenges for the developer community.
              </p>
            </div>
            <Link
              to="/admin/signup"
              className="text-sm text-primary hover:underline flex items-center gap-1 shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              New Admin
            </Link>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <section className="bg-surface border border-border-subtle rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-[20px]">info</span>
                <h2 className="text-xl font-semibold">Basic Information</h2>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                  Problem Title
                </label>
                <input
                  required
                  minLength={3}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Two Sum"
                  className="w-full bg-app-bg border border-border-subtle rounded px-4 py-2 text-on-surface input-focus-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                  Description
                </label>
                <textarea
                  required
                  minLength={10}
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Problem description..."
                  className="w-full bg-app-bg border border-border-subtle rounded px-4 py-2 text-on-surface input-focus-ring"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
                    Difficulty
                  </label>
                  <div className="flex gap-2">
                    {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                      <label key={d} className="flex-1 cursor-pointer">
                        <input
                          type="radio"
                          name="difficulty"
                          checked={difficulty === d}
                          onChange={() => setDifficulty(d)}
                          className="hidden peer"
                        />
                        <div
                          className={`text-center py-1 border border-border-subtle rounded capitalize text-xs font-semibold uppercase peer-checked:border-primary peer-checked:text-primary hover:bg-surface-container-high ${
                            difficulty === d ? "border-primary text-primary bg-primary/5" : "text-on-surface-variant"
                          }`}
                        >
                          {d}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TAGS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTag(t)}
                        className={`px-2 py-1 rounded text-xs border ${
                          tags.includes(t)
                            ? "bg-primary/10 border-primary text-primary"
                            : "border-border-subtle text-on-surface-variant"
                        }`}
                      >
                        {TAG_LABELS[t]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-surface border border-border-subtle rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">data_object</span>
                  <h2 className="text-xl font-semibold">Visible Test Cases</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setVisibleTestCases([...visibleTestCases, emptyCase()])}
                  className="text-primary text-xs font-semibold uppercase flex items-center gap-1 hover:bg-primary/10 px-2 py-1 rounded"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span> Add Case
                </button>
              </div>
              <div className="space-y-4">
                {visibleTestCases.map((tc, i) => (
                  <div key={i} className="p-4 border border-border-subtle rounded bg-surface-container-low relative group">
                    {visibleTestCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setVisibleTestCases(visibleTestCases.filter((_, j) => j !== i))}
                        className="absolute top-2 right-2 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-on-surface-variant mb-1">Input</label>
                        <textarea
                          required
                          rows={2}
                          value={tc.input}
                          onChange={(e) => {
                            const next = [...visibleTestCases];
                            next[i] = { ...next[i], input: e.target.value };
                            setVisibleTestCases(next);
                          }}
                          className="w-full bg-app-bg border border-border-subtle rounded px-2 py-1 font-mono text-sm input-focus-ring"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-on-surface-variant mb-1">Output</label>
                        <textarea
                          required
                          rows={2}
                          value={tc.output}
                          onChange={(e) => {
                            const next = [...visibleTestCases];
                            next[i] = { ...next[i], output: e.target.value };
                            setVisibleTestCases(next);
                          }}
                          className="w-full bg-app-bg border border-border-subtle rounded px-2 py-1 font-mono text-sm input-focus-ring"
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <label className="block text-xs font-semibold uppercase text-on-surface-variant mb-1">Explanation</label>
                      <input
                        required
                        value={tc.explanation}
                        onChange={(e) => {
                          const next = [...visibleTestCases];
                          next[i] = { ...next[i], explanation: e.target.value };
                          setVisibleTestCases(next);
                        }}
                        className="w-full bg-app-bg border border-border-subtle rounded px-2 py-1 text-sm input-focus-ring"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-surface border border-border-subtle rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">lock</span>
                  <h2 className="text-xl font-semibold">Hidden Test Cases</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setHiddenTestCases([...hiddenTestCases, emptyHidden()])}
                  className="text-primary text-xs font-semibold uppercase flex items-center gap-1 hover:bg-primary/10 px-2 py-1 rounded"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span> Add Case
                </button>
              </div>
              <div className="space-y-4">
                {hiddenTestCases.map((tc, i) => (
                  <div key={i} className="p-4 border border-border-subtle rounded bg-surface-container-low relative group">
                    {hiddenTestCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setHiddenTestCases(hiddenTestCases.filter((_, j) => j !== i))}
                        className="absolute top-2 right-2 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-on-surface-variant mb-1">Input</label>
                        <textarea
                          required
                          rows={2}
                          value={tc.input}
                          onChange={(e) => {
                            const next = [...hiddenTestCases];
                            next[i] = { ...next[i], input: e.target.value };
                            setHiddenTestCases(next);
                          }}
                          className="w-full bg-app-bg border border-border-subtle rounded px-2 py-1 font-mono text-sm input-focus-ring"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-on-surface-variant mb-1">Output</label>
                        <textarea
                          required
                          rows={2}
                          value={tc.output}
                          onChange={(e) => {
                            const next = [...hiddenTestCases];
                            next[i] = { ...next[i], output: e.target.value };
                            setHiddenTestCases(next);
                          }}
                          className="w-full bg-app-bg border border-border-subtle rounded px-2 py-1 font-mono text-sm input-focus-ring"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {(["startCode", "referenceSolution"] as const).map((section) => (
              <section key={section} className="bg-surface border border-border-subtle rounded-lg overflow-hidden">
                <div className="p-6 pb-0">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary text-[20px]">terminal</span>
                    <h2 className="text-xl font-semibold">
                      {section === "startCode" ? "Starter Code" : "Reference Solution"}
                    </h2>
                  </div>
                  <div className="flex gap-1 border-b border-border-subtle">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setActiveLang(lang)}
                        className={`px-4 py-2 text-xs font-semibold uppercase ${
                          activeLang === lang
                            ? "border-b-2 border-primary bg-editor-bg text-primary"
                            : "text-on-surface-variant hover:bg-surface-container"
                        }`}
                      >
                        {LANGUAGE_LABELS[lang]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-editor-bg p-6">
                  <textarea
                    required
                    rows={10}
                    spellCheck={false}
                    value={section === "startCode" ? startCodes[activeLang] : solutions[activeLang]}
                    onChange={(e) => {
                      if (section === "startCode") {
                        setStartCodes({ ...startCodes, [activeLang]: e.target.value });
                      } else {
                        setSolutions({ ...solutions, [activeLang]: e.target.value });
                      }
                    }}
                    className="w-full bg-transparent border-none focus:outline-none text-on-surface font-mono text-sm resize-none"
                  />
                </div>
              </section>
            ))}

            <div className="flex flex-col md:flex-row-reverse gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="h-11 px-8 bg-primary-container text-on-primary-container font-bold rounded hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin-custom">sync</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined">publish</span>
                    {isEdit ? "Update Problem" : "Create Problem"}
                  </>
                )}
              </button>
              <Link
                to="/problems"
                className="h-11 px-8 border border-border-subtle text-on-surface font-semibold rounded hover:bg-surface-elevated flex items-center justify-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
