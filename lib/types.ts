export interface StudyContent {
  id: string
  name: string
}

export interface StudyDuration {
  id: string
  minutes: number
}

export interface StudyLog {
  id: string
  date: string
  contentId: string
  contentName: string
  durationId: string
  durationMinutes: number
  status: boolean
}
