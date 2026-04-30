export type TimelineEvent = {
  id: string
  title: string
  date: string
  content: string
  image?: string | null
  person: string
  type: string
}

export type TimelineMode = 'overlay' | 'lane'

export type EventFilter = {
  persons?: string[]
  types?: string[]
  dateFrom?: string
  dateTo?: string
  search?: string
}

