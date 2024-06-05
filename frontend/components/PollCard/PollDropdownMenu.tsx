"use client"

import { Button } from "@nextui-org/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@nextui-org/dropdown";
import { FC, Key } from "react";
import { SlOptionsVertical } from "react-icons/sl";

interface PollDropdownMenuProps {
  onVisitPoll: () => void;
  status: 'open' | 'closed'
}

const PollDropdownMenu: FC<PollDropdownMenuProps> = ({ status, onVisitPoll }) => {

  const onAction = (key: Key) => {
    switch (key) {
      case "view":
        onVisitPoll()
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
        <DropdownItem key="view">View</DropdownItem>
        <DropdownItem key="edit">Edit Poll</DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Close Poll
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>)
}

export default PollDropdownMenu