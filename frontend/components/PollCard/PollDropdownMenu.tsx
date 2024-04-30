"use client"

import { Button } from "@nextui-org/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@nextui-org/dropdown";
import { FC } from "react";
import { SlOptionsVertical } from "react-icons/sl";

interface PollDropdownMenuProps {
  status: 'open' | 'closed'
}

const PollDropdownMenu: FC<PollDropdownMenuProps> = ({ status }) => {
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
      <DropdownMenu variant="faded" aria-label="Poll Actions" disabledKeys={status === "open" ? [] : ["edit", "delete"]}>
        <DropdownItem key="edit">Edit Poll</DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Close Poll
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>)
}

export default PollDropdownMenu