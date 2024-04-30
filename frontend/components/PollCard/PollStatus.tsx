import { Chip } from '@nextui-org/chip'
import { FC } from 'react'

interface PollStatusProps {
  status: 'open' | 'closed'
}

const PollStatus: FC<PollStatusProps> = ({ status }) => {
  return (
    <Chip size="sm" color={status === 'closed' ? "default" : "primary"}>{status}</Chip>
  )
}

export default PollStatus