import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Card from "../components/ui/Card";
import { useAuthStore } from "../store/authStore";

const features = [
  {
    icon: "description",
    title: "Curated Problems",
    desc: "Master data structures and algorithms with problems from easy to hard, tagged by topic.",
  },
  {
    icon: "play_circle",
    title: "Instant Execution",
    desc: "Run and submit code with real-time feedback on test cases, runtime, and memory.",
  },
  {
    icon: "auto_awesome",
    title: "AI Assistant",
    desc: "Get hints, debug help, and explanations powered by context-aware AI chat.",
  },
  {
    icon: "analytics",
    title: "Track Progress",
    desc: "Monitor solved problems, acceptance rate, and submission history in one place.",
  },
];

const stats = [
  { value: "5", label: "Languages Supported" },
  { value: "3", label: "Difficulty Levels" },
  { value: "95%", label: "Success Rate" },
  { value: "24/7", label: "Code Execution" },
];

export default function LandingPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="antialiased overflow-x-hidden min-h-screen bg-app-bg">
      <Navbar variant="minimal" />

      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-6 md:px-10 overflow-hidden">
        <div className="absolute inset-0 grid-pattern pointer-events-none opacity-60" />
        <div className="absolute inset-0 radial-glow pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center animate-[slide-in_0.5s_ease-out]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-container/30 bg-primary-container/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Built for serious engineers
            </span>
          </div>
          <h1 className="text-display-lg-mobile md:text-[3rem] md:leading-[1.1] font-extrabold text-on-surface tracking-tight mb-6">
            Master coding, one{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">
              problem
            </span>{" "}
            at a time
          </h1>
          <p className="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
            CodeForge is your technical interview preparation platform — practice problems,
            real-time execution, AI-powered assistance, and progress tracking in one focused workspace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <>
                <Link
                  to="/problems"
                  className="w-full sm:w-auto bg-primary-container text-on-primary-container font-bold py-3.5 px-10 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary-container/10"
                >
                  Continue to Problems
                </Link>
                <Link
                  to="/profile"
                  className="w-full sm:w-auto bg-transparent border border-border-subtle text-on-surface font-semibold py-3.5 px-10 rounded-lg hover:bg-surface-elevated transition-all"
                >
                  View Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto bg-primary-container text-on-primary-container font-bold py-3.5 px-10 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary-container/10"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto bg-transparent border border-border-subtle text-on-surface font-semibold py-3.5 px-10 rounded-lg hover:bg-surface-elevated transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border-subtle bg-surface-container-lowest">
        <div className="max-w-6xl mx-auto px-6 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center animate-[slide-in_0.4s_ease-out]">
              <div className="text-2xl md:text-3xl text-primary-container font-bold mb-1">{s.value}</div>
              <div className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 px-6 md:px-10 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-on-surface mb-3">
            Engineered for performance
          </h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            Everything you need to level up your engineering career in one polished ecosystem.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <Card key={f.title} hover padding="md" className="animate-[slide-in_0.3s_ease-out]">
              <div className="w-11 h-11 rounded-lg bg-primary-container/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary-container text-2xl">{f.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-on-surface mb-2">{f.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 md:px-10 max-w-6xl mx-auto">
        <div className="relative rounded-2xl p-10 md:p-14 overflow-hidden border border-border-subtle bg-gradient-to-br from-surface via-surface-container to-surface-container-high text-center">
          <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-on-surface mb-4">
              Ready to forge your future?
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto mb-8">
              Join developers worldwide sharpening their skills on CodeForge. Start solving today — it&apos;s free.
            </p>
            <Link
              to="/signup"
              className="inline-block bg-primary-container text-on-primary-container font-bold py-4 px-12 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
