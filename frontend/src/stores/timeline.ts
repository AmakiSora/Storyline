import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { EventItem, TimelineMode } from '../types/timeline';

const seed: EventItem[] = [
  { id: '1', title: 'JAY', date: '2000-11-07', content: '首张专辑发布', person: 'Jay', type: 'album' },
  { id: '2', title: '我很忙', date: '2007-11-02', content: '第8张专辑', person: 'Jay', type: 'album' },
  { id: '3', title: '无与伦比', date: '2004-10-01', content: '巡演开启', person: 'Jay', type: 'concert' }
];

export const useTimelineStore = defineStore('timeline', () => {
  const events = ref<EventItem[]>(seed);
  const mode = ref<TimelineMode>('overlay');
  const keyword = ref('');
  const personFilter = ref('all');
  const typeFilter = ref('all');
  const range = ref<[string, string]>(['1999-01-01', '2030-12-31']);
  const selected = ref<EventItem | null>(null);

  const filtered = computed(() => events.value.filter((e) => {
    if (personFilter.value !== 'all' && e.person !== personFilter.value) return false;
    if (typeFilter.value !== 'all' && e.type !== typeFilter.value) return false;
    if (keyword.value && !`${e.title}${e.content}`.includes(keyword.value)) return false;
    return e.date >= range.value[0] && e.date <= range.value[1];
  }));

  const upsert = (payload: EventItem) => {
    const i = events.value.findIndex((x) => x.id === payload.id);
    if (i === -1) events.value.push(payload);
    else events.value[i] = payload;
  };
  const remove = (id: string) => (events.value = events.value.filter((e) => e.id !== id));

  return { events, filtered, mode, keyword, personFilter, typeFilter, range, selected, upsert, remove };
});
