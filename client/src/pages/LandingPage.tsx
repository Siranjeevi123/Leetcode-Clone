import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
    <div className="antialiased overflow-x-hidden min-h-screen bg-app-bg">
      <Navbar variant="minimal" />

      <section className="relative pt-[120px] pb-8 px-10 min-h-[870px] flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 grid-pattern pointer-events-none" />
        <div className="absolute inset-0 radial-glow pointer-events-none" />
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-1 px-4 py-1 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              New Problems Released Weekly
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4 leading-[1.1]">
            Master coding, one <span className="text-primary-container">problem</span> at a time
          </h1>
          <p className="text-base text-on-surface-variant max-w-2xl mx-auto mb-8">
            The ultimate technical interview preparation platform. Hone your skills with
            industry-standard problems, real-time execution, and advanced progress tracking.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="bg-primary-container text-on-primary-container font-semibold py-3 px-8 rounded-lg hover:scale-[1.02] active:opacity-80 transition-all"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-transparent border border-border-subtle text-on-surface font-semibold py-3 px-8 rounded-lg hover:bg-surface-elevated transition-all"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8 border-y border-border-subtle bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-around items-center gap-6">
          {[
            ["500+", "Practice Problems"],
            ["10k+", "Active Users"],
            ["98%", "Interview Success"],
          ].map(([num, label], i) => (
            <div key={label} className="flex items-center gap-6">
              {i > 0 && <div className="w-px h-12 bg-border-subtle hidden md:block" />}
              <div className="text-center">
                <div className="text-3xl text-primary-container font-bold mb-1">{num}</div>
                <div className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-8 px-10 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-on-surface mb-2">Engineered for Performance</h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            Everything you need to level up your engineering career in one focused ecosystem.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "description", title: "Practice Problems", desc: "A curated library of data structures and algorithm challenges ranging from beginner to expert level." },
            { icon: "play_arrow", title: "Run & Submit Code", desc: "Execute your solutions in real-time. Get instant feedback on performance, memory usage, and test cases." },
            { icon: "analytics", title: "Track Progress", desc: "Visualise your growth with completion rates and solved problem history." },
          ].map((f) => (
            <div
              key={f.title}
              className="group p-6 rounded-xl border border-border-subtle bg-surface hover:bg-surface-elevated hover:border-primary-container/30 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary-container text-[28px]">{f.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-on-surface mb-2">{f.title}</h3>
              <p className="text-sm text-on-surface-variant">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-8 px-10 max-w-7xl mx-auto">
        <div className="relative rounded-2xl p-8 overflow-hidden border border-border-subtle bg-gradient-to-br from-surface to-surface-container-high text-center">
          <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl font-semibold text-on-surface mb-4">Ready to forge your future?</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto mb-8">
              Join thousands of developers worldwide who are sharpening their skills on CodeForge.
            </p>
            <Link
              to="/signup"
              className="inline-block bg-primary-container text-on-primary-container font-bold py-4 px-10 rounded-lg shadow-lg hover:shadow-primary-container/20 transition-all"
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
