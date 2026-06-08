import { useState, useRef } from "react";
import "./App.css";
import {
  Button,
  SearchField,
  Table,
  Selection,
  ProgressBar,
} from "@heroui/react";
import TrashBin from "./assets/icons/trash-bin.svg?react";
import PlayFill from "./assets/icons/play-fill.svg?react";
import StopFill from "./assets/icons/stop-fill.svg?react";
import Gear from "./assets/icons/gear.svg?react";
import ArrowRightArrowLeft from "./assets/icons/arrow-right-arrow-left.svg?react";
import ArrowChevronDown from "./assets/icons/arrow-chevron-down.svg?react";
import ArrowChevronUp from "./assets/icons/arrow-chevron-up.svg?react";
import Check from "./assets/icons/check.svg?react";
import CirclePlusFill from "./assets/icons/circle-plus-fill.svg?react";
import MagnetDialogBtn from "./components/magnet-model-btn";
import MagnetWindowContent from "./components/magnet-window-content";

function App() {
  const isMagnetWindow = window.location.search.includes("window=magnet");

  if (isMagnetWindow) {
    return <MagnetWindowContent />;
  }

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(["1"]));
  const [statusFilter, setStatusFilter] = useState("all");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenTorrentFile = () => {
    fileInputRef.current?.click();
  };

  const handleTorrentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("Selected torrent file:", e.target.files[0].name);
    }
    e.target.value = "";
  };

  const rows = [
    {
      id: "1",
      name: "Ubuntu 22.04 LTS.iso",
      size: "3.4 GB",
      progress: 45,
      status: "Downloading",
      seeds: 42,
      totalSeeds: 156,
      peers: 12,
      totalPeers: 34,
      downSpeed: "2.5 MB/s",
      upSpeed: "120 KB/s",
      eta: "15m 30s",
    },
    {
      id: "2",
      name: "Big Buck Bunny 1080p.mp4",
      size: "850 MB",
      progress: 100,
      status: "Seeding",
      seeds: 5,
      totalSeeds: 5,
      peers: 32,
      totalPeers: 32,
      downSpeed: "0 B/s",
      upSpeed: "3.2 MB/s",
      eta: "Done",
    },
    {
      id: "3",
      name: "Arch Linux 2024.01.01.iso",
      size: "890 MB",
      progress: 0,
      status: "Paused",
      seeds: 0,
      totalSeeds: 0,
      peers: 0,
      totalPeers: 0,
      downSpeed: "0 B/s",
      upSpeed: "0 B/s",
      eta: "∞",
    },
  ];

  const counts: Record<string, number> = {
    all: rows.length,
    downloading: rows.filter((r) => r.status === "Downloading").length,
    seeding: rows.filter((r) => r.status === "Seeding").length,
    completed: rows.filter((r) => r.progress === 100).length,
    running: rows.filter((r) => ["Downloading", "Seeding"].includes(r.status))
      .length,
    stopped: rows.filter((r) => ["Paused", "Stopped"].includes(r.status))
      .length,
  };

  const getStatusIcon = (row: (typeof rows)[0]) => {
    if (row.progress === 100 && row.status !== "Seeding")
      return <Check className="w-4 h-4 text-accent-hover shrink-0" />;
    if (row.status === "Downloading")
      return <ArrowChevronDown className="w-4 h-4 text-success shrink-0" />;
    if (row.status === "Seeding")
      return <ArrowChevronUp className="w-4 h-4 text-accent shrink-0" />;
    if (["Paused", "Stopped"].includes(row.status))
      return <StopFill className="w-3.5 h-3.5 mx-0.25 text-warning shrink-0" />;
    return <PlayFill className="w-3.5 h-3.5 mx-0.25 text-success shrink-0" />;
  };

  return (
    <main className="p-2 min-h-dvh flex flex-col gap-2">
      <header className="flex gap-2">
        <input
          type="file"
          accept=".torrent"
          ref={fileInputRef}
          className="hidden"
          onChange={handleTorrentFileChange}
        />
        <Button
          size="sm"
          variant="secondary"
          isIconOnly
          onPress={handleOpenTorrentFile}
        >
          <CirclePlusFill />
        </Button>
        <MagnetDialogBtn />
        <span className="h-7 border-r my-auto"></span>
        <Button size="sm" variant="danger-soft" isIconOnly>
          <TrashBin />
        </Button>
        <Button size="sm" variant="secondary" isIconOnly>
          <PlayFill className="text-success" />
        </Button>
        <Button size="sm" variant="secondary" isIconOnly>
          <StopFill className="text-warning" />
        </Button>
        <span className="h-7 border-r my-auto"></span>
        <Button size="sm" variant="secondary" isIconOnly isDisabled>
          <Gear />
        </Button>
        <SearchField className="ml-auto">
          <SearchField.Group className="h-8">
            <SearchField.SearchIcon />
            <SearchField.Input
              className="w-[200px] text-xs py-0"
              placeholder="Filter torrents..."
            />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
      </header>
      <div className="flex flex-1 gap-2 min-h-0">
        <aside className="w-36 flex flex-col gap-0.25 shrink-0 overflow-y-auto">
          <div className="text-xs font-medium px-2 py-1.5 text-muted">
            Status
          </div>
          {[
            {
              id: "all",
              label: `All (${counts.all})`,
              icon: (
                <ArrowRightArrowLeft className="w-3.5 h-3.5 mx-0.25 text-muted" />
              ),
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
          ].map((status) => (
            <button
              key={status.id}
              className={`py-1 px-2 rounded text-left text-xs flex items-center gap-2 ${statusFilter === status.id ? "bg-default" : "text-muted hover:text-foreground/75"}`}
              onClick={() => setStatusFilter(status.id)}
            >
              {status.icon}
              {status.label}
            </button>
          ))}
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Table variant="secondary">
            <Table.ScrollContainer>
              <Table.Content
                aria-label="Torrents list"
                className="min-w-[800px]"
                selectionMode="single"
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
                disallowEmptySelection
              >
                <Table.Header>
                  {[
                    "Name",
                    "Size",
                    "Progress",
                    "Status",
                    "Seeds",
                    "Peers",
                    "Down Speed",
                    "Up Speed",
                    "ETA",
                  ].map((col, i, arr) => {
                    let className = "py-1.5 whitespace-nowrap text-right";
                    if (i === 0) className += " !text-left pl-2.5";
                    if (i === 1) className += " pr-2";
                    if (i === 2) className += " !text-left px-0";
                    if (i === 3) className += " !text-left pl-2";
                    if (i === arr.length - 1) className += " pr-2.5";

                    return (
                      <Table.Column
                        key={col}
                        isRowHeader={i === 0}
                        className={className}
                      >
                        {col}
                      </Table.Column>
                    );
                  })}
                </Table.Header>
                <Table.Body>
                  {rows.map((row) => (
                    <Table.Row
                      id={row.id}
                      key={row.id}
                      className="whitespace-nowrap select-none [&_td]:text-right [&_td]:!border-b-0 group data-[selected]:[&_td]:bg-accent data-[selected]:data-[hovered]:[&_td]:bg-accent"
                    >
                      <Table.Cell className="py-1 pl-2.5 text-xs rounded-l-xl !text-left">
                        <div className="flex items-center gap-1.5 max-w-[200px]">
                          {getStatusIcon(row)}
                          <span className="truncate">{row.name}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="py-1 pr-2 text-xs">
                        {row.size}
                      </Table.Cell>
                      <Table.Cell className="p-0 text-xs">
                        <ProgressBar
                          value={row.progress}
                          className="w-30 h-5 relative p-0 flex"
                          aria-label={`Progress for ${row.name}`}
                        >
                          <ProgressBar.Track className="h-full flex flex-1 relative rounded border">
                            <ProgressBar.Fill className="h-full bg-accent" />
                            <span className="absolute inset-0 flex items-center justify-center font-medium">
                              {row.progress}%
                            </span>
                          </ProgressBar.Track>
                        </ProgressBar>
                      </Table.Cell>
                      <Table.Cell className="py-1 pl-2 text-xs !text-left">
                        {row.status}
                      </Table.Cell>
                      <Table.Cell className="py-1 text-xs">
                        {row.seeds}{" "}
                        <span className="text-foreground/50">
                          ({row.totalSeeds})
                        </span>
                      </Table.Cell>
                      <Table.Cell className="py-1 text-xs">
                        {row.peers}{" "}
                        <span className="text-foreground/50">
                          ({row.totalPeers})
                        </span>
                      </Table.Cell>
                      <Table.Cell className="py-1 text-xs">
                        {row.downSpeed}
                      </Table.Cell>
                      <Table.Cell className="py-1 text-xs">
                        {row.upSpeed}
                      </Table.Cell>
                      <Table.Cell className="py-1 pr-2.5 text-xs rounded-r-xl">
                        {row.eta}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </div>
      </div>
    </main>
  );
}

export default App;
