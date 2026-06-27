interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-app-bg gap-4">
      <span className="material-symbols-outlined animate-spin-custom text-primary text-4xl">
        sync
      </span>
      <p className="text-sm text-on-surface-variant animate-pulse">{message}</p>
    </div>
  );
}
