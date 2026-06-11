import { useState } from "react";
import { Checkbox } from "@heroui/react";
import { FileNode } from "../types";
import { getSelectionState, toggleNode, formatBytes } from "../lib/utils";
import FolderFill from "../assets/icons/folder-fill.svg?react";
import FolderOpenFill from "../assets/icons/folder-open-fill.svg?react";
import FileIcon from "../assets/icons/file.svg?react";

export const FileTreeNode = ({
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
