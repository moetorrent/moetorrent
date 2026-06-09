import { useState, useEffect } from "react";
import {
  Button,
  Skeleton,
  Input,
  Checkbox,
  ProgressBar,
  Label,
} from "@heroui/react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import parseTorrent from "parse-torrent";
import {
  addMagnet,
  getTorrentInfo,
  removeTorrent,
  setTorrentLocation,
  startTorrent,
  stopTorrent,
} from "../lib/transmission";
import FolderFill from "../assets/icons/folder-fill.svg?react";
import FolderOpenFill from "../assets/icons/folder-open-fill.svg?react";
import FileIcon from "../assets/icons/file.svg?react";

interface FileNode {
  name: string;
  isDir: boolean;
  size: number;
  children?: Record<string, FileNode>;
  selected?: boolean;
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const getSelectionState = (
  node: FileNode,
): { selected: boolean; indeterminate: boolean } => {
  if (!node.isDir) {
    return { selected: !!node.selected, indeterminate: false };
  }
  if (!node.children || Object.keys(node.children).length === 0) {
    return { selected: !!node.selected, indeterminate: false };
  }
  let allSelected = true;
  let anySelected = false;
  let anyIndeterminate = false;

  for (const child of Object.values(node.children)) {
    const state = getSelectionState(child);
    if (state.selected) anySelected = true;
    else allSelected = false;
    if (state.indeterminate) anyIndeterminate = true;
  }

  return {
    selected: allSelected,
    indeterminate: !allSelected && (anySelected || anyIndeterminate),
  };
};

const toggleNode = (node: FileNode, selected: boolean) => {
  node.selected = selected;
  if (node.children) {
    Object.values(node.children).forEach((child) =>
      toggleNode(child, selected),
    );
  }
};

const getSelectedSize = (node: FileNode): number => {
  if (!node.children) {
    return node.selected ? node.size : 0;
  }
  return Object.values(node.children).reduce(
    (sum, child) => sum + getSelectedSize(child),
    0,
  );
};

const FileTreeNode = ({
  node,
  onToggle,
  depth = 0,
}: {
  node: FileNode;
  onToggle: () => void;
  depth?: number;
}) => {
  const [isOpen, setIsOpen] = useState(depth === 0);
  const { selected, indeterminate } = getSelectionState(node);

  const handleToggle = () => {
    toggleNode(node, !selected);
    onToggle();
  };

  if (!node.isDir) {
    return (
      <div className="flex justify-between items-center py-1 text-xs hover:bg-default rounded px-1.5 cursor-default">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <Checkbox isSelected={selected} onChange={handleToggle}>
            <Checkbox.Control className="size-3.5 rounded-2xl">
              <Checkbox.Indicator />
            </Checkbox.Control>
          </Checkbox>
          <FileIcon className="w-3.5 h-3.5 text-muted shrink-0" />
          <span className="truncate" title={node.name}>
            {node.name}
          </span>
        </div>
        <span className="text-muted shrink-0 ml-4">
          {formatBytes(node.size)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col text-xs">
      <div className="flex justify-between items-center py-1 hover:bg-default rounded px-1.5 cursor-pointer">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <Checkbox
            isSelected={selected}
            isIndeterminate={indeterminate}
            onChange={handleToggle}
          >
            <Checkbox.Control className="size-3.5 rounded-2xl">
              <Checkbox.Indicator />
            </Checkbox.Control>
          </Checkbox>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer shrink-0"
          >
            {isOpen ? (
              <FolderOpenFill className="w-3.5 h-3.5 text-accent" />
            ) : (
              <FolderFill className="w-3.5 h-3.5 text-accent" />
            )}
          </div>
          <span
            className="truncate font-medium"
            title={node.name}
            onClick={() => setIsOpen(!isOpen)}
          >
            {node.name}
          </span>
        </div>
        <span className="text-muted shrink-0 ml-4">
          {formatBytes(node.size)}
        </span>
      </div>
      {isOpen && node.children && (
        <div className="pl-3 ml-3 border-l my-0.5 border-default-200 flex flex-col gap-0.5">
          {Object.values(node.children).map((child) => (
            <FileTreeNode
              key={child.name}
              node={child}
              onToggle={onToggle}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function TorrentWindowContent() {
  const [parsed, setParsed] = useState<parseTorrent.Instance | null>(null);
  const [tree, setTree] = useState<FileNode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savePath, setSavePath] = useState("");
  const [freeSpace, setFreeSpace] = useState<number | null>(null);

  const [isRetrievingMetadata, setIsRetrievingMetadata] = useState(false);
  const [torrentId, setTorrentId] = useState<number | null>(null);

  useEffect(() => {
    invoke<string>("get_download_dir")
      .then(setSavePath)
      .catch((err) => {
        console.error("Failed to get download dir:", err);
        setSavePath("C:\\Users\\<user>\\Downloads"); // fallback
      });
  }, []);

  useEffect(() => {
    invoke<number>("get_free_disk_space")
      .then(setFreeSpace)
      .catch((err) => {
        console.error("Failed to get free disk space:", err);
        setFreeSpace(null);
      });
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const buildTree = (filesArray: any[], name: string) => {
      const root: FileNode = {
        name: name || "Torrent",
        isDir: true,
        size: 0,
        children: {},
      };

      filesArray.forEach((f) => {
        const pathStr = Array.isArray(f.path) ? f.path.join("/") : f.path;
        const segments = pathStr.split(/[/\\]/);
        let current = root;
        root.size += f.length;

        for (let i = 0; i < segments.length; i++) {
          const segment = segments[i];
          if (!current.children) current.children = {};

          if (i === segments.length - 1) {
            current.children[segment] = {
              name: segment,
              isDir: false,
              size: f.length,
              selected: true,
            };
          } else {
            if (!current.children[segment]) {
              current.children[segment] = {
                name: segment,
                isDir: true,
                size: 0,
                children: {},
              };
            }
            current = current.children[segment];
            current.size += f.length;
          }
        }
      });
      setTree(root);
    };

    const loadAndParse = async () => {
      try {
        const base64 = localStorage.getItem("torrent_file_data");
        const magnetUri = localStorage.getItem("torrent_magnet_uri");

        let parsedData: parseTorrent.Instance;

        if (base64) {
          const binaryString = atob(base64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          parsedData = (await parseTorrent(bytes)) as parseTorrent.Instance;

          setError(null);
          setParsed(parsedData);

          if (parsedData.name) {
            invoke("set_window_title", { title: parsedData.name }).catch(
              console.error,
            );
          }

          const filesArray =
            parsedData.files && parsedData.files.length > 0
              ? parsedData.files
              : [
                  {
                    path: parsedData.name || "Unknown",
                    length: parsedData.length || 0,
                  },
                ];

          buildTree(filesArray, parsedData.name || "Torrent");
        } else if (magnetUri) {
          parsedData = (await parseTorrent(magnetUri)) as parseTorrent.Instance;
          setError(null);
          setParsed(parsedData);

          if (parsedData.name) {
            invoke("set_window_title", { title: parsedData.name }).catch(
              console.error,
            );
          }

          setIsRetrievingMetadata(true);
          const id = await addMagnet(magnetUri, false);
          setTorrentId(id);

          intervalId = setInterval(async () => {
            try {
              const info = await getTorrentInfo(id);
              if (info.metadataPercentComplete === 1) {
                clearInterval(intervalId);
                setIsRetrievingMetadata(false);

                await stopTorrent(id);

                const filesArray = info.files.map((f: any) => ({
                  path: f.name,
                  length: f.length,
                }));

                buildTree(filesArray, info.name);
                setParsed((prev) =>
                  prev
                    ? { ...prev, length: info.totalSize, name: info.name }
                    : null,
                );
              }
            } catch (err) {
              console.error("Failed to poll torrent info:", err);
            }
          }, 1000);
        } else {
          setError("No torrent data found.");
          return;
        }
      } catch (err: any) {
        setError(err.message || "Failed to parse torrent.");
      }
    };

    loadAndParse();

    // Show the window when the component mounts
    invoke("show_magnet_window").catch((err) =>
      console.error("Failed to show torrent window:", err),
    );

    // Listen to storage changes so we update if another torrent is selected while the window is open
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "torrent_file_data" || e.key === "torrent_magnet_uri") {
        loadAndParse();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const handleBrowse = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        defaultPath: savePath,
        title: "Select Download Directory",
      });
      if (selected && typeof selected === "string") {
        setSavePath(selected);
      }
    } catch (err) {
      console.error("Failed to open dialog:", err);
    }
  };

  const handleCancel = async () => {
    if (torrentId !== null) {
      try {
        await removeTorrent(torrentId, true);
      } catch (err) {
        console.error("Failed to remove torrent on cancel:", err);
      }
    }
    await invoke("close_window");
  };

  const handleDownload = async () => {
    if (torrentId !== null) {
      try {
        await setTorrentLocation(torrentId, savePath, true);
        await startTorrent(torrentId);
      } catch (err) {
        console.error("Failed to start magnet torrent:", err);
      }
    }
    console.log("Start downloading to", savePath);
    await invoke("close_window");
  };

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center p-2 bg-background text-danger text-xs">
        {error}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground select-none">
      {/* Left Column */}
      <div className="w-[45%] flex flex-col gap-3 p-2 border-r border-default-200">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Save at
          </label>
          <div className="flex gap-2">
            <Input
              value={savePath}
              onChange={(e) => setSavePath(e.target.value)}
              className="flex-1 text-xs"
            />
            <Button
              size="sm"
              isIconOnly
              variant="tertiary"
              onPress={handleBrowse}
            >
              <FolderFill className="w-4 h-4 text-muted" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Torrent information
          </label>
          <div className="border border-default-200 rounded-3xl p-3 flex flex-col gap-2 text-xs">
            {!parsed ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
                <Skeleton className="h-4 w-full rounded" />
              </div>
            ) : (
              <>
                <div className="flex">
                  <span className="w-18 text-muted-foreground shrink-0">
                    Size:
                  </span>
                  <span className="truncate">
                    {tree
                      ? formatBytes(getSelectedSize(tree))
                      : formatBytes(parsed.length || 0)}
                    <span className="text-muted-foreground mx-1">
                      / {formatBytes(parsed.length || 0)}
                    </span>
                    {freeSpace !== null && (
                      <span className="text-muted-foreground">
                        (Free space: {formatBytes(freeSpace)})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-18 text-muted-foreground shrink-0">
                    Date:
                  </span>
                  <span className="truncate">
                    {parsed.created
                      ? new Date(parsed.created).toLocaleString()
                      : "Unknown"}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-18 text-muted-foreground shrink-0">
                    Info hash v1:
                  </span>
                  <span className="text-xs my-auto truncate">
                    {parsed.infoHash || "N/A"}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-18 text-muted-foreground shrink-0">
                    Info hash v2:
                  </span>
                  <span className="text-xs my-auto truncate">
                    {/* @ts-ignore - parse-torrent might not strongly type v2 hashes yet */}
                    {parsed.infoHashV2 || "N/A"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
        {isRetrievingMetadata && (
          <div className="mt-auto px-2">
            <ProgressBar
              isIndeterminate
              aria-label="Retrieving metadata"
              className="w-full"
              size="sm"
            >
              <Label className="text-xs text-muted-foreground font-normal">
                Retrieving metadata...
              </Label>
              <ProgressBar.Track className="h-1 bg-default-200 rounded-full">
                <ProgressBar.Fill className="bg-accent" />
              </ProgressBar.Track>
            </ProgressBar>
          </div>
        )}
      </div>

      {/* Right Column */}
      <div className="w-[55%] flex flex-col p-2">
        <label className="text-xs font-medium text-muted-foreground mb-1.5">
          Files
        </label>
        <div className="flex-1 overflow-y-auto scrollbar-thin border border-default-200 rounded-3xl p-2 bg-default-50/50">
          <div className="flex flex-col gap-0.5">
            {Object.values(tree?.children || {}).map((child) => (
              <FileTreeNode
                key={child.name}
                node={child}
                onToggle={() => setTree({ ...tree } as FileNode)}
                depth={0}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <Button
            size="sm"
            variant="secondary"
            onPress={handleCancel}
            className="text-xs h-7"
          >
            Cancel
          </Button>
          <Button size="sm" className="text-xs h-7" onPress={handleDownload}>
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
