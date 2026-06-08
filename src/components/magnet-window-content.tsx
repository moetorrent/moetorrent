import { useState, useEffect } from "react";
import { Button, TextArea } from "@heroui/react";
import { invoke } from "@tauri-apps/api/core";

export default function MagnetWindowContent() {
  const [magnetLink, setMagnetLink] = useState("");

  useEffect(() => {
    invoke("show_magnet_window").catch((err) =>
      console.error("Failed to show magnet window:", err),
    );
  }, []);

  const handleDownload = async () => {
    console.log("Downloading magnet link:", magnetLink);
    // Add custom logic if needed to add to transmission daemon
    invoke("close_window").catch((err) =>
      console.error("Failed to close magnet window:", err),
    );
  };

  return (
    <div className="flex flex-col gap-2 h-screen p-2 justify-between bg-background text-foreground select-none">
      <div className="flex flex-col gap-3 flex-1">
        <span className="text-xs text-muted">
          Only magnet links are supported as of now.
        </span>
        <TextArea
          autoFocus
          placeholder="magnet:?xt=urn:btih:..."
          className="rounded-3xl flex flex-1 text-sm"
          value={magnetLink}
          onChange={(e) => setMagnetLink(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <Button
          size="sm"
          className="bg-accent text-white rounded-3xl font-medium hover:bg-accent/80"
          onPress={handleDownload}
        >
          Download
        </Button>
      </div>
    </div>
  );
}
