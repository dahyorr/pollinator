interface Poll {
  id: string
  question: string
  // options: string[]
  multiple_choice: boolean
  end_date?: string
  created_at?: string
  user_id: string
  status: "open" | "closed"
  closed_at: string
  responses: number
  poll_options: PollOption[]
}

interface PollOption {
  id: string
  value: string
  votes: number
}