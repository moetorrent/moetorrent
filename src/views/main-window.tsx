import { useState, useEffect } from "react";
import { Selection } from "@heroui/react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";
import Header from "../components/layout/header";
import Sidebar from "../components/layout/sidebar";
import TorrentTable from "../components/torrent/torrent-table";
import {
  getAllTorrents,
  removeTorrent,
  startTorrent,
  stopTorrent,
} from "../lib/transmission";
import { formatBytes } from "../lib/utils";
import { Torrent } from "../types";

const formatEta = (seconds: number) => {
  if (seconds < 0) return "∞";
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400)
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  return `${Math.floor(seconds / 86400)}d ${Math.floor((seconds % 86400) / 3600)}h`;
};

const mapTransmissionStatus = (status: number) => {
  switch (status) {
    case 0:
      return "Stopped";
    case 1:
      return "Check wait";
    case 2:
      return "Checking";
    case 3:
      return "Download wait";
    case 4:
      return "Downloading";
    case 5:
      return "Seed wait";
    case 6:
      return "Seeding";
    default:
      return "Unknown";
  }
};

const getTorrentCounts = (rows: Torrent[]): Record<string, number> => ({
  all: rows.length,
  downloading: rows.filter((r) => r.status === "Downloading").length,
  seeding: rows.filter((r) => r.status === "Seeding").length,
  completed: rows.filter((r) => r.progress === 100).length,
  running: rows.filter((r) => ["Downloading", "Seeding"].includes(r.status))
    .length,
  stopped: rows.filter((r) => ["Paused", "Stopped"].includes(r.status)).length,
});

export default function MainWindow() {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [statusFilter, setStatusFilter] = useState("all");
  const [torrents, setTorrents] = useState<Torrent[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchTorrents = async () => {
      try {
        const data = await getAllTorrents();
        if (!mounted) return;
        const mapped: Torrent[] = data.map((t: any) => ({
          id: String(t.id),
          name: t.name,
          size: formatBytes(t.totalSize),
          progress: Math.round(t.percentDone * 100),
          status: mapTransmissionStatus(t.status),
          seeds: t.peersSendingToUs || 0,
          totalSeeds: t.peersConnected || 0,
          peers: t.peersGettingFromUs || 0,
          totalPeers: t.peersConnected || 0,
          downSpeed:
            t.rateDownload > 0 ? `${formatBytes(t.rateDownload)}/s` : "0 B/s",
          upSpeed:
            t.rateUpload > 0 ? `${formatBytes(t.rateUpload)}/s` : "0 B/s",
          eta: formatEta(t.eta),
        }));
        setTorrents(mapped);
      } catch (err) {
        console.error("Failed to fetch torrents:", err);
      }
    };

    fetchTorrents();
    const interval = setInterval(fetchTorrents, 1000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const counts = getTorrentCounts(torrents);

  const getSelectedIds = () => {
    if (selectedKeys === "all")
      return filteredTorrents.map((t) => parseInt(t.id));
    return Array.from(selectedKeys).map((k) => parseInt(String(k)));
  };

  const handleDelete = async () => {
    const ids = getSelectedIds();
    for (const id of ids) {
      try {
        await removeTorrent(id, true);
      } catch (err) {
        console.error(`Failed to remove torrent ${id}:`, err);
      }
    }
    setSelectedKeys(new Set([]));
  };

  const handleStart = async () => {
    const ids = getSelectedIds();
    for (const id of ids) {
      try {
        await startTorrent(id);
      } catch (err) {
        console.error(`Failed to start torrent ${id}:`, err);
      }
    }
  };

  const handleStop = async () => {
    const ids = getSelectedIds();
    for (const id of ids) {
      try {
        await stopTorrent(id);
      } catch (err) {
        console.error(`Failed to stop torrent ${id}:`, err);
      }
    }
  };

  const handleOpenTorrentFile = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: "Torrent",
            extensions: ["torrent"],
          },
        ],
      });

      if (selected && typeof selected === "string") {
        const bytes = await readFile(selected);
        let binaryString = "";
        for (let i = 0; i < bytes.length; i++) {
          binaryString += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binaryString);
        const fileName = selected.split(/[/\\]/).pop() || "unknown.torrent";
        localStorage.setItem("torrent_file_data", base64);
        localStorage.setItem("torrent_file_name", fileName);
        try {
          await invoke("open_torrent_window");
        } catch (err) {
          console.error("Failed to open torrent window:", err);
        }
      }
    } catch (err) {
      console.error("Failed to open or read torrent:", err);
    }
  };

  const filteredTorrents = torrents.filter((r) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "downloading") return r.status === "Downloading";
    if (statusFilter === "seeding") return r.status === "Seeding";
    if (statusFilter === "completed")
      return r.progress === 100 && r.status !== "Seeding";
    if (statusFilter === "running")
      return ["Downloading", "Seeding"].includes(r.status);
    if (statusFilter === "stopped")
      return ["Paused", "Stopped"].includes(r.status);
    return true;
  });

  return (
    <main className="p-2 min-h-dvh flex flex-col gap-2">
      <Header
        onOpenTorrent={handleOpenTorrentFile}
        onDelete={handleDelete}
        onStart={handleStart}
        onStop={handleStop}
        hasSelection={selectedKeys === "all" || selectedKeys.size > 0}
      />
      <div className="flex flex-1 gap-2 min-h-0">
        <Sidebar
          counts={counts}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <TorrentTable
          torrents={filteredTorrents}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
        />
      </div>
    </main>
  );
}
