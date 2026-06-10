export interface Torrent {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: string;
  seeds: number;
  totalSeeds: number;
  peers: number;
  totalPeers: number;
  downSpeed: string;
  upSpeed: string;
  eta: string;
}

export interface FileNode {
  name: string;
  isDir: boolean;
  size: number;
  children?: Record<string, FileNode>;
  selected?: boolean;
}
