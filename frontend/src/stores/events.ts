import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { EventFilter, TimelineEvent, TimelineMode } from '@/types/event'
import {
  createEvent as apiCreateEvent,
  deleteEvent as apiDeleteEvent,
  fetchEvents,
  updateEvent as apiUpdateEvent,
} from '@/api/eventsApi'
import { sampleEvents } from '@/data/sampleEvents'
import { uuidV4 } from '@/lib/uuid'

export const useEventsStore = defineStore('events', () => {
  const mode = ref<TimelineMode>('overlay')
  const filter = ref<EventFilter>({})
  const events = ref<TimelineEvent[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const offline = ref(false)
  const selectedId = ref<string | null>(null)

  const selectedEvent = computed(() => {
    if (!selectedId.value) return null
    return events.value.find((e) => e.id === selectedId.value) ?? null
  })

  const persons = computed(() => Array.from(new Set(events.value.map((e) => e.person))).sort())
  const types = computed(() => Array.from(new Set(events.value.map((e) => e.type))).sort())

  function applyLocalFilter(list: TimelineEvent[], f: EventFilter) {
    const q = (f.search ?? '').trim().toLowerCase()
    return list.filter((e) => {
      if (f.persons?.length && !f.persons.includes(e.person)) return false
      if (f.types?.length && !f.types.includes(e.type)) return false
      if (f.dateFrom && e.date < f.dateFrom) return false
      if (f.dateTo && e.date > f.dateTo) return false
      if (q) {
        const hay = `${e.title}\n${e.content}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }

  async function refresh() {
    loading.value = true
    error.value = null
    try {
      const list = await fetchEvents(filter.value)
      offline.value = false
      events.value = applyLocalFilter(list.length ? list : sampleEvents, filter.value)
        .slice()
        .sort((a, b) => a.date.localeCompare(b.date))
      if (selectedId.value && !events.value.some((e) => e.id === selectedId.value)) selectedId.value = null
    } catch (e) {
      offline.value = true
      events.value = applyLocalFilter(sampleEvents, filter.value)
        .slice()
        .sort((a, b) => a.date.localeCompare(b.date))
      error.value = e instanceof Error ? e.message : '加载失败'
    } finally {
      loading.value = false
    }
  }

  async function createEvent(payload: Omit<TimelineEvent, 'id'>) {
    if (offline.value) {
      const created: TimelineEvent = { ...payload, id: uuidV4() }
      events.value = [...events.value, created].sort((a, b) => a.date.localeCompare(b.date))
      selectedId.value = created.id
      return
    }

    try {
      const created = await apiCreateEvent(payload)
      offline.value = false
      events.value = [...events.value, created].sort((a, b) => a.date.localeCompare(b.date))
      selectedId.value = created.id
    } catch (e) {
      offline.value = true
      const created: TimelineEvent = { ...payload, id: uuidV4() }
      events.value = [...events.value, created].sort((a, b) => a.date.localeCompare(b.date))
      selectedId.value = created.id
      error.value = e instanceof Error ? e.message : '创建失败（已切换为离线模式）'
    }
  }

  async function updateEvent(payload: TimelineEvent) {
    if (offline.value) {
      events.value = events.value
        .map((e) => (e.id === payload.id ? payload : e))
        .sort((a, b) => a.date.localeCompare(b.date))
      selectedId.value = payload.id
      return
    }

    try {
      const updated = await apiUpdateEvent(payload.id, {
        title: payload.title,
        date: payload.date,
        content: payload.content,
        image: payload.image ?? null,
        person: payload.person,
        type: payload.type,
      })
      offline.value = false
      events.value = events.value
        .map((e) => (e.id === updated.id ? updated : e))
        .sort((a, b) => a.date.localeCompare(b.date))
      selectedId.value = updated.id
    } catch (e) {
      offline.value = true
      events.value = events.value
        .map((e) => (e.id === payload.id ? payload : e))
        .sort((a, b) => a.date.localeCompare(b.date))
      selectedId.value = payload.id
      error.value = e instanceof Error ? e.message : '更新失败（已切换为离线模式）'
    }
  }

  async function deleteEvent(id: string) {
    if (offline.value) {
      events.value = events.value.filter((e) => e.id !== id)
      if (selectedId.value === id) selectedId.value = null
      return
    }

    try {
      await apiDeleteEvent(id)
      offline.value = false
    } catch (e) {
      offline.value = true
      error.value = e instanceof Error ? e.message : '删除失败（已切换为离线模式）'
    } finally {
      events.value = events.value.filter((e) => e.id !== id)
      if (selectedId.value === id) selectedId.value = null
    }
  }

  function select(id: string | null) {
    selectedId.value = id
  }

  watch(filter, refresh, { deep: true })

  return {
    mode,
    filter,
    events,
    loading,
    error,
    offline,
    selectedId,
    selectedEvent,
    persons,
    types,
    refresh,
    createEvent,
    updateEvent,
    deleteEvent,
    select,
  }
})

