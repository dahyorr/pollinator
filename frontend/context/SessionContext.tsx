import { supabase } from "@/supabase/client";
import { Session } from "@supabase/supabase-js";
import { FC, PropsWithChildren, createContext, useEffect, useState } from "react";

interface SessionContextType {
  session: Session | null
  loading: boolean
  refreshSession: () => void
  refetchSession: () => void
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  loading: true,
  refreshSession: () => { },
  refetchSession: () => { },
})

export const SessionProvider: FC<PropsWithChildren> = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session)
      switch (event) {
        case 'SIGNED_IN':
        case 'INITIAL_SESSION':
        case 'TOKEN_REFRESHED':
        // case 'PASSWORD_RECOVERY':
        case 'USER_UPDATED':
        case 'SIGNED_IN':
          setLoading(false)
          setSession(session)
          break
        case 'SIGNED_OUT':
          setLoading(false)
          setSession(null)
          break
      }
    })
    return () => { data.subscription.unsubscribe() }
  }, [])


  // const getUser = async () => {
  //   const { data: { session } } = await supabase.auth.getSession()
  //   setSession(session)
  // }

  const refreshSession = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.refreshSession()
    setLoading(false)
    // setSession(session)
  }

  const refetchSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setSession(session)

  }

  return (
    <SessionContext.Provider value={{
      session,
      refreshSession,
      refetchSession,
      loading
    }}>
      {children}
    </SessionContext.Provider>
  )
}

export default SessionContext