import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { FC, FormEvent, useState } from "react";
import PollVoteOptions from "./PollVoteOptions";
import { Button } from "@nextui-org/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/supabase/client";
import TurnstileModal from "../TurnstileModal";
import { useDisclosure } from "@nextui-org/modal";
import { API_URL } from "@/config";
import { usePathname, useRouter } from "next/navigation";

interface IProps {
  poll: Poll
}

interface VotePayload {
  poll_id: string
  poll_option?: string
  poll_options?: string[]
}

const PollVoteCard: FC<IProps> = ({ poll }) => {

  const [selected, setSelected] = useState<string[]>([])
  const queryClient = useQueryClient()
  const { session, refetchSession } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  // const turnstileDisclosure = useDisclosure()

  const createVoteApi = async (payload: VotePayload) => {
    const headers = new Headers({
      'Content-Type': 'application/json'
    })
    if (session) {
      headers.append('Authorization', `Bearer ${session?.access_token}`)
    }
    const response = await fetch(`${API_URL}/vote`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers,
    })
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || data.error || 'Failed to vote')
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createVoteApi,
    onError: (error) => toast.error(error.message),
    onSuccess: async () => {
      toast.success("Vote recorded successfully")
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['polls'] }),
        queryClient.invalidateQueries({ queryKey: ['poll', poll.id] }),
        queryClient.invalidateQueries({ queryKey: ['poll', poll.id, 'votes'] })
      ])

    }
  })

  const onVote = async (e?: FormEvent) => {

    e?.preventDefault()
    const payload = {
      poll_id: poll.id,
      poll_options: selected.length > 1 ? selected : undefined,
      poll_option: selected.length < 2 ? selected[0] : undefined
    }
    mutate(payload)
    router.push(`${pathname}?view=1`)
  }

  // const onChallengeCompleted = (token: string) => {
  //   onVote(undefined, token)
  // }

  return (
    <Card as="form" onSubmit={onVote} className="w-full mx-auto max-w-[400px] lg:max-w-[500px]" >
      <CardHeader className="flex gap-3 justify-between">
        <div className="flex flex-col">
          <p className="text-md font-semibold">{poll.question}</p>
          <p className="text-small text-default-500">(10 minutes ago)</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex flex-col ">
          <PollVoteOptions options={poll.poll_options} multipleOptions={poll.multiple_choice} setValue={setSelected} value={selected} />
        </div>
      </CardBody>
      <Divider />
      <CardFooter className="flex justify-end py-2">

        <Button type="submit" color="primary" size="sm" isLoading={isPending}>Vote</Button>
      </CardFooter>

      {/*<TurnstileModal isOpen={turnstileDisclosure.isOpen} onOpenChange={turnstileDisclosure.onOpenChange} onChallengeCompleted={onChallengeCompleted} />*/}
    </Card >
  )
}

export default PollVoteCard