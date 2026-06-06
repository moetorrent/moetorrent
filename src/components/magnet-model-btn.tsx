import { useState } from "react";
import { Button, Modal, TextArea } from "@heroui/react";
import Magnet from "../assets/icons/magnet.svg?react";

export default function MagnetDialogBtn() {
  const [magnetLink, setMagnetLink] = useState("");

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setMagnetLink("");
    }
  };

  return (
    <Modal onOpenChange={handleOpenChange}>
      <Button size="sm" variant="secondary" isIconOnly>
        <Magnet />
      </Button>
      <Modal.Backdrop>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-sm p-2 rounded-[0.65rem]">
            <Modal.CloseTrigger className="top-2 right-2" />
            <Modal.Header className="gap-0 pl-1.25">
              <Modal.Heading>Add magnet link</Modal.Heading>
              <span className="text-xs text-muted">
                Only magnet links are supported as of now.
              </span>
            </Modal.Header>
            <Modal.Body className="flex flex-col">
              <TextArea
                autoFocus
                rows={3}
                placeholder="magnet:?xt=urn:btih:..."
                className="rounded-3xl"
                value={magnetLink}
                onChange={(e) => setMagnetLink(e.target.value)}
              />
            </Modal.Body>
            <Modal.Footer className="mt-2">
              <Button slot="close" size="sm" className="rounded-3xl">
                Download
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
