"use client"

import { Button } from "@nextui-org/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@nextui-org/dropdown";
import { FC, Key } from "react";
import { SlOptionsVertical } from "react-icons/sl";

interface PollDropdownMenuProps {
  onVisitPoll: () => void;
  onEditPoll: () => void;
  status: 'open' | 'closed'
  disableVisit?: boolean
}

const PollDropdownMenu: FC<PollDropdownMenuProps> = ({ status, onVisitPoll, onEditPoll, disableVisit }) => {

  const onAction = (key: Key) => {
    switch (key) {
      case "view":
        onVisitPoll()
        break;
      case "edit":
        onEditPoll()
        break;
      case "close":
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
        <DropdownItem key="close" className="text-danger" color="danger">
          Close Poll
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>)
}

export default PollDropdownMenu