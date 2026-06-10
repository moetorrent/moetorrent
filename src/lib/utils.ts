import { FileNode } from "../types";

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const getSelectionState = (
  node: FileNode,
): { selected: boolean; indeterminate: boolean } => {
  if (!node.isDir) {
    return { selected: !!node.selected, indeterminate: false };
  }
  if (!node.children || Object.keys(node.children).length === 0) {
    return { selected: !!node.selected, indeterminate: false };
  }

  let allSelected = true;
  let anySelected = false;
  let anyIndeterminate = false;

  for (const child of Object.values(node.children)) {
    const state = getSelectionState(child);
    if (state.selected) anySelected = true;
    else allSelected = false;
    if (state.indeterminate) anyIndeterminate = true;
  }

  return {
    selected: allSelected,
    indeterminate: !allSelected && (anySelected || anyIndeterminate),
  };
};

export const toggleNode = (node: FileNode, selected: boolean) => {
  node.selected = selected;
  if (node.children) {
    Object.values(node.children).forEach((child) =>
      toggleNode(child, selected),
    );
  }
};

export const getSelectedSize = (node: FileNode): number => {
  if (!node.children) {
    return node.selected ? node.size : 0;
  }

  return Object.values(node.children).reduce(
    (sum, child) => sum + getSelectedSize(child),
    0,
  );
};
