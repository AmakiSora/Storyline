export interface EventItem {
  id: string;
  title: string;
  date: string;
  content: string;
  image?: string;
  person: string;
  type: string;
}
export type TimelineMode = 'overlay' | 'lane';
