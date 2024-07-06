type PollStatus = "open" | "closed"

interface Poll {
  id: string
  question: string
  // options: string[]
  multiple_choice: boolean
  require_autth: boolean
  end_date?: string
  created_at?: string
  user_id: string
  status: PollStatus
  closed_at: string
  responses: number
  poll_options: PollOption[]
}

interface PollOption {
  id: string
  value: string
  votes: number
}