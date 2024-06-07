"use client"
import { supabase } from '@/supabase/client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'next/navigation'
import PollCard from './PollCard'
import PollVoteCard from './PollCard/PollVoteCard'
import { useSession } from '@/hooks/useSession'
import CircularLoader from './CircularLoader'
import { useEffect } from 'react'
import { toast } from 'sonner'

const PollData = () => {
  const { session } = useSession()
  const { pollId } = useParams<{ pollId: string }>()
  const searchParms = useSearchParams()
  const { data, isLoading, isFetching, isError, error } = useQuery<Poll>({
    queryKey: ['poll', pollId],
    queryFn: async ({ signal }) => {
      const { data } = await supabase
        .from('poll')
        .select('*, poll_options(id, value, votes)')
        .eq('id', pollId)
        .abortSignal(signal)
        .single()
        .throwOnError()
      return data
    }
  })
  const forceView = Boolean(searchParms.get('view'))
  const { data: previousVotes, isLoading: loadingPreviousVotes, isFetching: isFetchingPreviousVotes } = useQuery<any[]>({
    queryKey: ['poll', pollId, 'votes'],
    queryFn: async ({ signal }) => {
      const headers = new Headers({
        'Content-Type': 'application/json'
      })
      if (session) {
        headers.append('Authorization', `Bearer ${session?.access_token}`)
      }
      const res = await fetch(`http://localhost:8000/api/poll/${pollId}/votes`, {
        headers,
        signal
      })
      if (res.ok) {
        return (await res.json()).votes
      }
      else {
        throw new Error('Failed to fetch previous votes')
      }
    },
    retry: false,
    staleTime: 0
  })

  const hasVoted = previousVotes && previousVotes?.length > 0

  const isOwner = data?.user_id === session?.user.id
  // const allowVoting = !isOwner && !hasVoted && data?.status === 'open'
  const allowVoting = true
  const pollOptionsIds = data?.poll_options.map((option) => option.id)

  useEffect(() => {
    if (isError) {
      toast.error(error.message)
    }
  }, [isError, error])

  const queryClient = useQueryClient()

  const voteEventProcessor = (event: string, payload: any) => {
    switch (event) {
      case 'vote_increment':
        queryClient.setQueryData(['poll', payload.poll_id], (data: Poll) => {
          const updatedOptions = data.poll_options.map((option) => {
            if (option.id === payload.poll_option_id) {
              return {
                ...option,
                votes: option.votes + 1
              }
            }
            return option
          })
          const newData = {
            ...data,
            poll_options: updatedOptions
          }
          console.log(newData)
          return newData
        })
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (data && pollOptionsIds) {
      const channel = supabase.channel(`poll-votes-updates-${pollId}`)
      channel
        .on(
          'broadcast',
          {
            event: 'vote_increment',
          },
          ({ event, payload }) => voteEventProcessor(event, payload)
        )
        .subscribe()
      return () => {
        channel.unsubscribe()
      }
    }
  }, [allowVoting, data])

  if (isLoading || loadingPreviousVotes) {
    return <CircularLoader />
  }

  if (data) return (
    <div className='flex justify-center py-9'>
      {allowVoting && !forceView ? (<PollVoteCard poll={data} />) : (<PollCard poll={data} owner={isOwner} />)}
    </div>
  )
  else return null
}

export default PollData