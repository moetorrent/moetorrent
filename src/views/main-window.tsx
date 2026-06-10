import { useState } from "react";
import { Selection } from "@heroui/react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";
import Header from "../components/layout/header";
import Sidebar from "../components/layout/sidebar";
import TorrentTable from "../components/torrent/torrent-table";
import { mockTorrents, getTorrentCounts } from "../lib/mock-data";

export default function MainWindow() {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(["1"]));
  const [statusFilter, setStatusFilter] = useState("all");

  const counts = getTorrentCounts(mockTorrents);

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

  const filteredTorrents = mockTorrents.filter((r) => {
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
      <Header onOpenTorrent={handleOpenTorrentFile} />
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
