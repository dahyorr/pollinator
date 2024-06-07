import { supabase } from "@/supabase/client"

export const signInWithEmail = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: "http://localhost:3000"
    }
  })
}

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google"
  })
}

export const signInWithGithub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github"
  })
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
}