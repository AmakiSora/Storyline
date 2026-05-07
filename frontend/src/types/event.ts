export type TimelineMode = 'overlay' | 'lane'
export interface TimelineEvent { id: string; title: string; date: string; content: string; image?: string; person: string; type: 'album' | 'concert' }
export interface TimelineFilter { person: string[]; type: string[]; from?: string; to?: string; keyword: string }
