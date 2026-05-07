import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { TimelineEvent, TimelineFilter, TimelineMode } from '../types/event'

const demo: TimelineEvent[] = [
  { id: '1', title: 'JAY', date: '2000-11-07', content: '首张专辑发布', person: 'Jay', type: 'album' },
  { id: '2', title: '范特西', date: '2001-09-20', content: '第二张专辑', person: 'Jay', type: 'album' },
  { id: '3', title: '无与伦比', date: '2004-10-01', content: '演唱会巡演', person: 'Jay', type: 'concert' },
  { id: '4', title: '地表最强', date: '2016-06-24', content: '世界巡回演唱会', person: 'Jay', type: 'concert' }
]

export const useTimelineStore = defineStore('timeline', () => {
  const events = ref<TimelineEvent[]>(demo)
  const mode = ref<TimelineMode>('overlay')
  const filter = ref<TimelineFilter>({ person: [], type: [], keyword: '' })
  const selected = ref<TimelineEvent | null>(null)

  const filteredEvents = computed(() => events.value.filter(e => {
    if (filter.value.person.length && !filter.value.person.includes(e.person)) return false
    if (filter.value.type.length && !filter.value.type.includes(e.type)) return false
    if (filter.value.keyword && !`${e.title}${e.content}`.toLowerCase().includes(filter.value.keyword.toLowerCase())) return false
    if (filter.value.from && e.date < filter.value.from) return false
    if (filter.value.to && e.date > filter.value.to) return false
    return true
  }))

  const saveEvent = (payload: TimelineEvent) => {
    const idx = events.value.findIndex(i => i.id === payload.id)
    idx >= 0 ? events.value.splice(idx, 1, payload) : events.value.push({ ...payload, id: String(Date.now()) })
  }
  const removeEvent = (id: string) => { events.value = events.value.filter(e => e.id !== id) }

  return { events, filteredEvents, mode, filter, selected, saveEvent, removeEvent }
})
