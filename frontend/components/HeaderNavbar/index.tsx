'use client'

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, } from "@nextui-org/navbar"
import { Button } from "@nextui-org/button"
import { Link } from "@nextui-org/link"
import { useDisclosure } from "@nextui-org/modal"
import LoginModal from "../LoginModal"
import { useSession } from "@/hooks/useSession"
import UserMenu from "./UserMenu"

const HeaderNavbar = () => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure()
  const { session } = useSession()
  const user = session?.user || null

  console.log(session)

  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit">POLLINATOR</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        {/* <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem> */}
        <NavbarItem>
          {session?.user ? (<UserMenu user={user} />) : (
            <Button color="primary" variant="flat" onClick={onOpen}>
              Sign in
            </Button>
          )}

        </NavbarItem>
      </NavbarContent>

      <LoginModal isOpen={isOpen} onOpenChange={onOpenChange} />

    </Navbar>
  )
}

export default HeaderNavbar