import { useState } from "react";
import "./App.css";
import {
  Button,
  SearchField,
  Table,
  Selection,
  ProgressBar,
} from "@heroui/react";
import CirclePlusFill from "./assets/icons/circle-plus-fill.svg?react";
import Magnet from "./assets/icons/magnet.svg?react";
import TrashBin from "./assets/icons/trash-bin.svg?react";
import PlayFill from "./assets/icons/play-fill.svg?react";
import StopFill from "./assets/icons/stop-fill.svg?react";
import Gear from "./assets/icons/gear.svg?react";

function App() {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(["1"]));

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

  return (
    <main
      data-theme="dark"
      className="p-2 bg-background text-foreground min-h-dvh flex flex-col gap-2"
    >
      <header className="flex gap-2">
        <Button size="sm" variant="secondary" isIconOnly>
          <CirclePlusFill />
        </Button>
        <Button size="sm" variant="secondary" isIconOnly>
          <Magnet />
        </Button>
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
                  <Table.Cell className="py-1 pl-2.5 text-xs rounded-l-xl truncate max-w-[200px] !text-left">
                    {row.name}
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
                    {row.seeds} ({row.totalSeeds})
                  </Table.Cell>
                  <Table.Cell className="py-1 text-xs">
                    {row.peers} ({row.totalPeers})
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
    </main>
  );
}

export default App;
