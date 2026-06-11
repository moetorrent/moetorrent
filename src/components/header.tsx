import { Button, SearchField } from "@heroui/react";
import TrashBin from "../assets/icons/trash-bin.svg?react";
import PlayFill from "../assets/icons/play-fill.svg?react";
import StopFill from "../assets/icons/stop-fill.svg?react";
import Gear from "../assets/icons/gear.svg?react";
import CirclePlusFill from "../assets/icons/circle-plus-fill.svg?react";
import MagnetDialogBtn from "./magnet-modal-btn";

interface HeaderProps {
  onOpenTorrent: () => void;
  onDelete: () => void;
  onStart: () => void;
  onStop: () => void;
  hasSelection: boolean;
}

export default function Header({
  onOpenTorrent,
  onDelete,
  onStart,
  onStop,
  hasSelection,
}: HeaderProps) {
  return (
    <header className="flex gap-2">
      <Button size="sm" variant="secondary" isIconOnly onPress={onOpenTorrent}>
        <CirclePlusFill />
      </Button>
      <MagnetDialogBtn />
      <span className="h-7 border-r my-auto"></span>
      <Button
        size="sm"
        variant="danger-soft"
        isIconOnly
        onPress={onDelete}
        isDisabled={!hasSelection}
      >
        <TrashBin />
      </Button>
      <Button
        size="sm"
        variant="secondary"
        isIconOnly
        onPress={onStart}
        isDisabled={!hasSelection}
      >
        <PlayFill className="text-success" />
      </Button>
      <Button
        size="sm"
        variant="secondary"
        isIconOnly
        onPress={onStop}
        isDisabled={!hasSelection}
      >
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
  );
}
