import { Torrent } from "../types";

export const mockTorrents: Torrent[] = [
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

export const getTorrentCounts = (rows: Torrent[]): Record<string, number> => ({
  all: rows.length,
  downloading: rows.filter((r) => r.status === "Downloading").length,
  seeding: rows.filter((r) => r.status === "Seeding").length,
  completed: rows.filter((r) => r.progress === 100).length,
  running: rows.filter((r) => ["Downloading", "Seeding"].includes(r.status))
    .length,
  stopped: rows.filter((r) => ["Paused", "Stopped"].includes(r.status)).length,
});
