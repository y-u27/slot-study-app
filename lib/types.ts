export interface StudyContent {
  id: string
  name: string
}

export interface StudyDuration {
  id: string
  minutes: number
}

export interface StudyLogRow {
  id: string
  created_at: string
  content: string
  duration: number
  status: boolean
}
