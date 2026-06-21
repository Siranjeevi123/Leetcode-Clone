import { useToastStore } from "../store/toastStore";

const borderColors = {
  success: "border-l-success",
  error: "border-l-error",
  info: "border-l-info",
};

export default function ToastContainer() {
  const { toasts, dismiss } = useToastStore();

  return (
    <div className="fixed top-16 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast-enter bg-surface border border-border-subtle border-l-4 ${borderColors[t.type]} rounded-lg px-4 py-3 shadow-xl flex justify-between gap-3`}
        >
          <span className="text-sm text-on-surface">{t.message}</span>
          <button
            onClick={() => dismiss(t.id)}
            className="text-on-surface-variant hover:text-on-surface shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
