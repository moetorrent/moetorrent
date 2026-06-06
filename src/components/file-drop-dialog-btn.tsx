import { useState, useRef } from "react";
import { Button, Modal } from "@heroui/react";
import CirclePlusFill from "../assets/icons/circle-plus-fill.svg?react";
import FileArrowUp from "../assets/icons/file-arrow-up.svg?react";

export default function FileDropDialogBtn() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file) return;
    console.log("Selected torrent file:", file.name);
    // Add logic here to process the torrent file (e.g., read as base64 and send to Transmission)
    setIsOpen(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
    // Reset input so the same file can be selected again if needed
    e.target.value = "";
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        size="sm"
        variant="secondary"
        isIconOnly
        onPress={() => setIsOpen(true)}
        preventFocusOnPress
      >
        <CirclePlusFill />
      </Button>
      <Modal.Backdrop>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-sm p-2 rounded-[0.65rem]">
            <Modal.CloseTrigger className="top-2 right-2" />
            <Modal.Header className="gap-0 pl-1.25">
              <Modal.Heading>Add torrent file</Modal.Heading>
              <span className="text-xs text-muted">
                Drag and drop or click to browse.
              </span>
            </Modal.Header>
            <Modal.Body className="flex flex-col pb-0">
              <input
                type="file"
                accept=".torrent"
                ref={fileInputRef}
                className="hidden"
                onChange={handleChange}
              />
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onClick={handleClick}
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-3xl cursor-pointer transition-colors ${
                  isDragging
                    ? "border-accent bg-accent/10"
                    : "border-border hover:bg-muted/5"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 mb-3 rounded-3xl transition-colors ${
                    isDragging ? "bg-accent/20" : "bg-muted/10"
                  }`}
                >
                  <FileArrowUp
                    className={`w-5 h-5 transition-colors ${
                      isDragging ? "text-accent" : "text-muted"
                    }`}
                  />
                </div>
                <span className="text-sm font-medium">
                  Click or drag file here
                </span>
                <span className="text-xs text-muted mt-1 text-center">
                  Supports .torrent files
                </span>
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
