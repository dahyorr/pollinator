'use server'

import PollData from "@/components/PollData"
import { nanoid } from "nanoid"
import { cookies } from "next/headers"


const PollPage = () => {
  return (
    <main className="container mx-auto px-4 bg-red">
      <PollData />
    </main>
  )
}

export default PollPage