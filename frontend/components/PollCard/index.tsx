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
dayjs.extend(relativeTime)

interface IProps {
  poll: Poll
  owner?: boolean
}

const PollCard: FC<IProps> = ({ poll, owner }) => {
  const router = useRouter()
  const onVisitPoll = () => {
    router.push(`/${poll.id}`)
  }

  return (
    <Card className="max-w-[400px] lg:max-w-[500px]">
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
        <PollDropdownMenu status="open" onVisitPoll={onVisitPoll} />
      </CardFooter>)}
    </Card>
  )
}

export default PollCard