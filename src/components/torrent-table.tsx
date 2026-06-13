import { Table, ProgressBar, Selection } from "@heroui/react";
import { Torrent } from "../types";
import Check from "../assets/icons/check.svg?react";
import ArrowChevronDown from "../assets/icons/arrow-chevron-down.svg?react";
import ArrowChevronUp from "../assets/icons/arrow-chevron-up.svg?react";
import StopFill from "../assets/icons/stop-fill.svg?react";
import PlayFill from "../assets/icons/play-fill.svg?react";

interface TorrentTableProps {
  torrents: Torrent[];
  selectedKeys: Selection;
  setSelectedKeys: (keys: Selection) => void;
}

const getStatusIcon = (row: Torrent) => {
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

export default function TorrentTable({
  torrents,
  selectedKeys,
  setSelectedKeys,
}: TorrentTableProps) {
  return (
    <Table variant="secondary">
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Torrents list"
          className="min-w-[800px]"
          selectionMode="single"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
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
            {torrents.map((row) => (
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
                  <span className="text-foreground/50">({row.totalSeeds})</span>
                </Table.Cell>
                <Table.Cell className="py-1 text-xs">
                  {row.peers}{" "}
                  <span className="text-foreground/50">({row.totalPeers})</span>
                </Table.Cell>
                <Table.Cell className="py-1 text-xs">
                  {row.downSpeed}
                </Table.Cell>
                <Table.Cell className="py-1 text-xs">{row.upSpeed}</Table.Cell>
                <Table.Cell className="py-1 pr-2.5 text-xs rounded-r-xl">
                  {row.eta}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
