import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown'
import { FC, Key } from 'react'
import { User } from "@supabase/supabase-js"
import { Avatar } from '@nextui-org/avatar'
import { signOut } from '@/utils/authHelpers'

interface UserMenuProps {
  user: User | null
}

const UserMenu: FC<UserMenuProps> = ({ user }) => {
  const userMetadata = user?.user_metadata
  const email = user?.email

  const onAction = (key: Key) => {
    if (key === "logout") {
      signOut()
    }
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="primary"
          // name={user?.identities[0].provider === "google" ? user?.user_metadata.full_name : name}
          size="sm"
          src={userMetadata?.avatar_url}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat" onAction={onAction}>
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{userMetadata?.name || userMetadata?.email}</p>
        </DropdownItem>
        <DropdownItem key="logout" color="danger">
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export default UserMenu