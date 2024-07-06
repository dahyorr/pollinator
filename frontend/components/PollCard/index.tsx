"use client"
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import PollOptionItem from "./PollOptionItem";
import PollStatus from "./PollStatus";
import PollDropdownMenu from "./PollDropdownMenu";
import { FC } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import { useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from "@nextui-org/modal";
import NewPollModal from "../NewPollModal";
import { API_URL } from "@/config";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";
dayjs.extend(relativeTime)

interface IProps {
  poll: Poll
  owner?: boolean
  standalone?: boolean
}

const PollCard: FC<IProps> = ({ poll, owner, standalone }) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const pollModalDisclosure = useDisclosure()
  const { session } = useSession()

  const onVisitPoll = () => {
    router.push(`/${poll.id}?view=1`)
  }

  const onUpdatePollStatus = async (status: PollStatus) => {
    const payload = {
      poll_id: poll.id,
      status
    }
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`
    })
    const response = await fetch(`${API_URL}/vote/updateStatus`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers,
    })
    if (!response.ok) {
      const data = await response.json()
      const message = data.message || data.error || 'Failed to update poll status'
      toast.error(message)
    }
    else {
      await queryClient.invalidateQueries({ queryKey: ['polls'] })
      await queryClient.invalidateQueries({ queryKey: ['poll', poll.id] })
      toast.success('Poll status updated successfully')
    }
  }


  return (
    <Card className="mx-auto max-w-[400px] lg:max-w-[500px] w-full">
      <CardHeader className="flex gap-3 justify-between">
        <div className="flex flex-col">
          <p className="text-md font-semibold">{poll.question}</p>
          {/* <p className="text-small text-default-500">(10 minutes ago)</p> */}
          <p className="text-small text-default-500">({dayjs().to(dayjs(poll.created_at))})</p>
        </div>
        <PollStatus status={poll.status} />
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex flex-col gap-4">
          {poll.poll_options.map((option, index) => (
            <PollOptionItem key={index} label={option.value} percentage={(option.votes / poll.responses) * 100 || 0} />
          ))}
        </div>
      </CardBody>
      <Divider />
      {owner && (<CardFooter className="flex gap-3 justify-between">
        <p className="text-small text-default-500">{poll.responses} responses</p>
        <PollDropdownMenu
          status={poll.status}
          onVisitPoll={onVisitPoll}
          onEditPoll={() => pollModalDisclosure.onOpen()}
          onUpdatePollStatus={onUpdatePollStatus}
          disableVisit={standalone}
        />
      </CardFooter>)}

      {pollModalDisclosure.isOpen && (<NewPollModal isOpen={pollModalDisclosure.isOpen} onOpenChange={pollModalDisclosure.onOpenChange} poll={poll} />)}

    </Card>
  )
}

export default PollCard