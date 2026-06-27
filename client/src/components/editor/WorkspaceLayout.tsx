import type { ReactNode } from "react";

interface WorkspaceLayoutProps {
  left: ReactNode;
  center: ReactNode;
  right?: ReactNode;
  showRight?: boolean;
  descriptionOpen?: boolean;
}

/**
 * Three-panel workspace: problem (30%) | editor (50%) | AI (20%) on desktop.
 * Side panels collapse via CSS width transitions — children stay mounted.
 */
export default function WorkspaceLayout({
  left,
  center,
  right,
  showRight = false,
  descriptionOpen = true,
}: WorkspaceLayoutProps) {
  return (
    <div className="ws-root">
      <div className={`ws-left${descriptionOpen ? "" : " ws-left--closed"}`}>
        <div className="ws-fill" style={{ background: "var(--color-sidebar)" }}>
          {left}
        </div>
      </div>

      <div className="ws-center">{center}</div>

      <div className={`ws-right${showRight && right ? "" : " ws-right--closed"}`}>
        <div className="ws-fill">{right}</div>
      </div>
    </div>
  );
}
