"use client"

import { Button } from "@nextui-org/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@nextui-org/dropdown";
import { FC, Key } from "react";
import { SlOptionsVertical } from "react-icons/sl";

interface PollDropdownMenuProps {
  onVisitPoll: () => void;
  onEditPoll: () => void;
  onUpdatePollStatus: (status: PollStatus) => Promise<void>;
  status: 'open' | 'closed'
  disableVisit?: boolean
}

const PollDropdownMenu: FC<PollDropdownMenuProps> = ({ status, onVisitPoll, onEditPoll, onUpdatePollStatus, disableVisit }) => {

  const onAction = (key: Key) => {
    switch (key) {
      case "view":
        onVisitPoll()
        break;
      case "edit":
        onEditPoll()
        break;
      case "status_update":
        onUpdatePollStatus(status === "open" ? "closed" : "open")
        break;
      default:
        break;
    }
  }

  return (
    <Dropdown backdrop="opaque">
      <DropdownTrigger>
        <Button
          variant="light"
          isIconOnly
          size="sm"
        >
          <SlOptionsVertical />
        </Button>
      </DropdownTrigger>
      <DropdownMenu variant="faded" aria-label="Poll Actions" disabledKeys={status === "open" ? [] : ["edit", "delete"]} onAction={onAction}>
        <DropdownItem hidden={disableVisit} key="view">View</DropdownItem>
        <DropdownItem hidden={status === "closed"} key="edit">Edit Poll</DropdownItem>
        <DropdownItem key="status_update" className={status === "open" ? "text-danger" : undefined} color="danger">
          {status === "open" ? "Close" : "Open"} Poll
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>)
}

export default PollDropdownMenu