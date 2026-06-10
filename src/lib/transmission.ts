import { fetch } from "@tauri-apps/plugin-http";

const RPC_URL = "http://127.0.0.1:9091/transmission/rpc";
let sessionId: string | null = null;

async function rpcRequest(method: string, args?: any): Promise<any> {
  const payload = { method, arguments: args };
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (sessionId) {
    headers["X-Transmission-Session-Id"] = sessionId;
  }

  let response;
  try {
    response = await fetch(RPC_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
  } catch (err) {
    throw new Error(
      `Failed to connect to Transmission daemon at ${RPC_URL}: ${err}`,
    );
  }

  if (response.status === 409) {
    sessionId = response.headers.get("X-Transmission-Session-Id");
    if (!sessionId) {
      throw new Error("Failed to get session ID from Transmission daemon");
    }
    // Retry with the new session ID
    headers["X-Transmission-Session-Id"] = sessionId;
    response = await fetch(RPC_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
  }

  if (!response.ok) {
    throw new Error(
      `Transmission RPC Error: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  if (data.result !== "success") {
    throw new Error(`Transmission RPC Error: ${data.result}`);
  }

  return data.arguments;
}

export async function addMagnet(
  uri: string,
  paused: boolean = true,
): Promise<number> {
  const result = await rpcRequest("torrent-add", {
    filename: uri,
    paused,
  });

  const torrentAdded = result["torrent-added"] || result["torrent-duplicate"];
  if (!torrentAdded) {
    throw new Error("Failed to add magnet URI to Transmission");
  }

  if (result["torrent-duplicate"] && !paused) {
    await startTorrent(torrentAdded.id);
  }

  return torrentAdded.id;
}

export async function addTorrentBase64(
  metainfo: string,
  paused: boolean = true,
): Promise<number> {
  const result = await rpcRequest("torrent-add", {
    metainfo,
    paused,
  });

  const torrentAdded = result["torrent-added"] || result["torrent-duplicate"];
  if (!torrentAdded) {
    throw new Error("Failed to add torrent file to Transmission");
  }

  if (result["torrent-duplicate"] && !paused) {
    await startTorrent(torrentAdded.id);
  }

  return torrentAdded.id;
}

export async function getTorrentInfo(id: number): Promise<any> {
  const result = await rpcRequest("torrent-get", {
    fields: ["id", "name", "files", "metadataPercentComplete", "totalSize"],
    ids: [id],
  });

  if (!result.torrents || result.torrents.length === 0) {
    throw new Error("Torrent not found");
  }
  return result.torrents[0];
}

export async function getAllTorrents(): Promise<any[]> {
  const result = await rpcRequest("torrent-get", {
    fields: [
      "id",
      "name",
      "totalSize",
      "percentDone",
      "status",
      "peersConnected",
      "peersGettingFromUs",
      "peersSendingToUs",
      "rateDownload",
      "rateUpload",
      "eta",
    ],
  });

  return result.torrents || [];
}

export async function removeTorrent(
  id: number,
  deleteLocalData: boolean = false,
): Promise<void> {
  await rpcRequest("torrent-remove", {
    ids: [id],
    "delete-local-data": deleteLocalData,
  });
}

export async function setTorrentLocation(
  id: number,
  location: string,
  move: boolean = false,
): Promise<void> {
  await rpcRequest("torrent-set-location", {
    ids: [id],
    location,
    move,
  });
}

export async function stopTorrent(id: number): Promise<void> {
  await rpcRequest("torrent-stop", {
    ids: [id],
  });
}

export async function startTorrent(id: number): Promise<void> {
  await rpcRequest("torrent-start", {
    ids: [id],
  });
}
