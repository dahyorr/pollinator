import { supabase } from "@/supabase/client";
import { Session } from "@supabase/supabase-js";
import { FC, PropsWithChildren, createContext, useEffect, useState } from "react";

interface SessionContextType {
  session: Session | null
  refreshSession: () => void
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  refreshSession: () => { },
})

export const SessionProvider: FC<PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)

  console.log(session)
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
          setSession(session)
          break
        case 'SIGNED_OUT':
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
    const { data: { session } } = await supabase.auth.refreshSession()
    // setSession(session)
  }

  return (
    <SessionContext.Provider value={{
      session,
      refreshSession
    }}>
      {children}
    </SessionContext.Provider>
  )
}

export default SessionContext