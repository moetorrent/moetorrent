import { useState, useEffect } from "react";
import { Button, TextArea } from "@heroui/react";
import { invoke } from "@tauri-apps/api/core";

export default function MagnetWindow() {
  const [magnetLink, setMagnetLink] = useState("");

  useEffect(() => {
    invoke("show_magnet_window").catch((err) =>
      console.error("Failed to show magnet window:", err),
    );
  }, []);

  const handleCancel = async () => {
    await invoke("close_window");
  };

  const handleDownload = async () => {
    if (!magnetLink.trim()) return;

    localStorage.removeItem("torrent_file_data");
    localStorage.removeItem("torrent_file_name");
    localStorage.setItem("torrent_magnet_uri", magnetLink.trim());

    try {
      await invoke("open_torrent_window");
      await invoke("close_window");
    } catch (err) {
      console.error("Failed to transition to torrent window:", err);
    }
  };

  return (
    <div className="flex flex-col gap-2 h-screen p-2 justify-between bg-background text-foreground select-none">
      <div className="flex flex-col gap-2 flex-1">
        <span className="text-xs text-muted">
          Only magnet links are supported as of now.
        </span>
        <TextArea
          autoFocus
          placeholder="magnet:?xt=urn:btih:..."
          className="flex flex-1 text-xs resize-none"
          value={magnetLink}
          onChange={(e) => setMagnetLink(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
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
  );
}
