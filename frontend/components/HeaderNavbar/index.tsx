'use client'

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, } from "@nextui-org/navbar"
import { Button } from "@nextui-org/button"
import { useDisclosure } from "@nextui-org/modal"
import LoginModal from "../LoginModal"
import { useSession } from "@/hooks/useSession"
import UserMenu from "./UserMenu"
import { CircularProgress } from "@nextui-org/progress"

const HeaderNavbar = () => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure()
  const { session, loading } = useSession()
  const user = session?.user || null

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
          {loading ? <CircularProgress size="sm" aria-label="loading user" /> : session?.user ? (<UserMenu user={user} />) : (
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