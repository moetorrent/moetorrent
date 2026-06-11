import ArrowRightArrowLeft from "../assets/icons/arrow-right-arrow-left.svg?react";
import ArrowChevronDown from "../assets/icons/arrow-chevron-down.svg?react";
import ArrowChevronUp from "../assets/icons/arrow-chevron-up.svg?react";
import Check from "../assets/icons/check.svg?react";
import PlayFill from "../assets/icons/play-fill.svg?react";
import StopFill from "../assets/icons/stop-fill.svg?react";
import mascotImg from "../assets/mascot.webp";

interface SidebarProps {
  counts: Record<string, number>;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export default function Sidebar({
  counts,
  statusFilter,
  setStatusFilter,
}: SidebarProps) {
  const statuses = [
    {
      id: "all",
      label: `All (${counts.all})`,
      icon: <ArrowRightArrowLeft className="w-3.5 h-3.5 mx-0.25 text-muted" />,
    },
    {
      id: "downloading",
      label: `Downloading (${counts.downloading})`,
      icon: <ArrowChevronDown className="w-4 h-4 text-success" />,
    },
    {
      id: "seeding",
      label: `Seeding (${counts.seeding})`,
      icon: <ArrowChevronUp className="w-4 h-4 text-accent" />,
    },
    {
      id: "completed",
      label: `Completed (${counts.completed})`,
      icon: <Check className="w-4 h-4 text-accent-hover" />,
    },
    {
      id: "running",
      label: `Running (${counts.running})`,
      icon: <PlayFill className="w-3.5 h-3.5 mx-0.25 text-success" />,
    },
    {
      id: "stopped",
      label: `Stopped (${counts.stopped})`,
      icon: <StopFill className="w-3.5 h-3.5 mx-0.25 text-warning" />,
    },
  ];

  return (
    <aside className="w-36 flex flex-col gap-0.25 shrink-0 overflow-y-auto">
      <div className="text-xs font-medium px-2 py-1.5 text-muted">Status</div>
      {statuses.map((status) => (
        <button
          key={status.id}
          className={`py-1 px-2 rounded text-left text-xs flex items-center gap-2 ${
            statusFilter === status.id
              ? "bg-default"
              : "text-muted hover:text-foreground/75"
          }`}
          onClick={() => setStatusFilter(status.id)}
        >
          {status.icon}
          {status.label}
        </button>
      ))}
      <div className="mt-auto pointer-events-none select-none">
        <img src={mascotImg} alt="skin" className="w-full object-contain" />
      </div>
    </aside>
  );
}
