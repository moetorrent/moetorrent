import { Button } from "@heroui/react";
import { invoke } from "@tauri-apps/api/core";
import Magnet from "../assets/icons/magnet.svg?react";

export default function MagnetDialogBtn() {
  const handlePress = async () => {
    try {
      await invoke("open_magnet_window");
    } catch (error) {
      console.error("Failed to open magnet window:", error);
    }
  };

  return (
    <Button size="sm" variant="secondary" isIconOnly onPress={handlePress}>
      <Magnet />
    </Button>
  );
}
