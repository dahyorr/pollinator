import { useSession } from '@/hooks/useSession'
import { supabase } from '@/supabase/client'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import PollCard from "@/components/PollCard";
import { toast } from 'sonner';
import CircularLoader from './CircularLoader';


const Polls = () => {
  // TODO:Add pagination

  const { session } = useSession()
  const { data, isLoading, isError, error } = useQuery<Poll[]>({
    queryKey: ['polls'],
    enabled: !!session,
    queryFn: async ({ signal }) => {
      const { data } = await supabase
        .from('poll')
        .select('*, poll_options(id, value, votes)')
        .order('created_at', { ascending: false })
        .eq('user_id', session?.user.id)
        .range(0, 19)
        .abortSignal(signal)
        .throwOnError()
      return data as Poll[]
    },
  })

  useEffect(() => {
    if (isError) {
      toast.error(error.message)
    }
  }, [isError, error])

  if(!session){
    return <p className="text-center text-lg">Please sign in to view your polls</p>
  }

  if (isLoading) return (
    <CircularLoader />
  )

  if (!data) {
    return null
  }

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
      {data.map(p => (<PollCard key={p.id} poll={p} owner={p.user_id === session?.user.id} />))}
    </div>
  )
}

export default Polls