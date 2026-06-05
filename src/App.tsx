import { useState } from "react";
import "./App.css";
import { Button, SearchField, Table, Selection } from "@heroui/react";
import CirclePlusFill from "./assets/icons/circle-plus-fill.svg?react";
import Magnet from "./assets/icons/magnet.svg?react";
import TrashBin from "./assets/icons/trash-bin.svg?react";
import PlayFill from "./assets/icons/play-fill.svg?react";
import StopFill from "./assets/icons/stop-fill.svg?react";
import Gear from "./assets/icons/gear.svg?react";

function App() {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set(["Kate Moore"]),
  );
  const rows = [
    {
      name: "Kate Moore",
      role: "CEO",
      status: "Active",
      email: "kate@acme.com",
    },
    {
      name: "John Smith",
      role: "CTO",
      status: "Active",
      email: "john@acme.com",
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
        <Button size="sm" variant="danger-soft" isIconOnly>
          <TrashBin />
        </Button>
        <Button size="sm" variant="secondary" isIconOnly>
          <PlayFill className="text-success" />
        </Button>
        <Button size="sm" variant="secondary" isIconOnly>
          <StopFill className="text-warning" />
        </Button>
        <Button size="sm" variant="secondary" isIconOnly isDisabled>
          <Gear />
        </Button>
        <SearchField className="ml-auto">
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input
              className="w-[200px] text-xs"
              placeholder="Filter torrents..."
            />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
      </header>
      <Table variant="secondary">
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Team members"
            className="min-w-[600px]"
            selectionMode="single"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            disallowEmptySelection
          >
            <Table.Header>
              <Table.Column isRowHeader className="py-1.5 pl-2.5">
                Name
              </Table.Column>
              <Table.Column className="py-1.5">Role</Table.Column>
              <Table.Column className="py-1.5">Status</Table.Column>
              <Table.Column className="py-1.5">Email</Table.Column>
            </Table.Header>
            <Table.Body>
              {rows.map((row) => (
                <Table.Row
                  id={row.name}
                  key={row.name}
                  className="[&_td]:!border-b-0 group data-[selected]:[&_td]:bg-accent data-[selected]:data-[hovered]:[&_td]:bg-accent"
                >
                  <Table.Cell className="py-1 pl-2.5 text-xs rounded-l-xl">
                    {row.name}
                  </Table.Cell>
                  <Table.Cell className="py-1 text-xs">{row.role}</Table.Cell>
                  <Table.Cell className="py-1 text-xs">{row.status}</Table.Cell>
                  <Table.Cell className="py-1 text-xs rounded-r-xl">
                    {row.email}
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
