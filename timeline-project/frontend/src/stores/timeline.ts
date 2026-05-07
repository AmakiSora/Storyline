/**
 * timeline.ts - Pinia 状态管理
 *
 * 管理时间线数据、人物、筛选状态和 UI 状态
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TimelineEvent, Person, FilterCriteria, TimelineMode } from '@/types'
import { api } from '@/api'

export const useTimelineStore = defineStore('timeline', () => {
  // ==================== State ====================
  const events = ref<TimelineEvent[]>([])
  const persons = ref<Person[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 筛选状态
  const selectedPersonIds = ref<string[]>([])
  const selectedTypes = ref<string[]>([])
  const searchQuery = ref('')
  const mode = ref<TimelineMode>('overlay')

  // 当前编辑的事件
  const editingEvent = ref<TimelineEvent | null>(null)
  const isEditorOpen = ref(false)

  // ==================== Getters ====================
  const filteredEvents = computed(() => {
    let result = events.value

    // 按人物筛选
    if (selectedPersonIds.value.length > 0) {
      result = result.filter(e => selectedPersonIds.value.includes(e.personId))
    }

    // 按类型筛选
    if (selectedTypes.value.length > 0) {
      result = result.filter(e => selectedTypes.value.includes(e.type))
    }

    // 搜索
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(e =>
        e.title.toLowerCase().includes(query) ||
        e.content.toLowerCase().includes(query)
      )
    }

    // 按时间排序
    return result.sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  })

  const visiblePersons = computed(() => {
    if (selectedPersonIds.value.length === 0) {
      return persons.value
    }
    return persons.value.filter(p => selectedPersonIds.value.includes(p.id))
  })

  // ==================== Actions ====================

  /** 加载所有数据 */
  async function loadData(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const [eventsData, personsData] = await Promise.all([
        api.getEvents(),
        api.getPersons()
      ])
      events.value = eventsData
      persons.value = personsData
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载数据失败'
      console.error('Load data error:', e)
    } finally {
      loading.value = false
    }
  }

  /** 刷新单个事件 */
  async function refreshEvents(): Promise<void> {
    try {
      const data = await api.getEvents()
      events.value = data
    } catch (e) {
      error.value = e instanceof Error ? e.message : '刷新失败'
    }
  }

  /** 创建事件 */
  async function createEvent(eventData: Omit<TimelineEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> {
    try {
      const newEvent = await api.createEvent(eventData)
      events.value.push(newEvent)
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : '创建失败'
      return false
    }
  }

  /** 更新事件 */
  async function updateEvent(eventId: string, eventData: Partial<TimelineEvent>): Promise<boolean> {
    try {
      const updated = await api.updateEvent(eventId, eventData)
      const index = events.value.findIndex(e => e.id === eventId)
      if (index !== -1) {
        events.value[index] = { ...events.value[index], ...updated }
      }
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : '更新失败'
      return false
    }
  }

  /** 删除事件 */
  async function deleteEvent(eventId: string): Promise<boolean> {
    try {
      await api.deleteEvent(eventId)
      events.value = events.value.filter(e => e.id !== eventId)
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : '删除失败'
      return false
    }
  }

  /** 切换人物筛选 */
  function togglePerson(personId: string): void {
    const index = selectedPersonIds.value.indexOf(personId)
    if (index > -1) {
      selectedPersonIds.value.splice(index, 1)
    } else {
      selectedPersonIds.value.push(personId)
    }
  }

  /** 切换类型筛选 */
  function toggleType(type: string): void {
    const index = selectedTypes.value.indexOf(type)
    if (index > -1) {
      selectedTypes.value.splice(index, 1)
    } else {
      selectedTypes.value.push(type)
    }
  }

  /** 清除所有筛选 */
  function clearFilters(): void {
    selectedPersonIds.value = []
    selectedTypes.value = []
    searchQuery.value = ''
  }

  /** 打开编辑器 */
  function openEditor(event?: TimelineEvent): void {
    editingEvent.value = event || null
    isEditorOpen.value = true
  }

  /** 关闭编辑器 */
  function closeEditor(): void {
    isEditorOpen.value = false
    editingEvent.value = null
  }

  /** 设置显示模式 */
  function setMode(newMode: TimelineMode): void {
    mode.value = newMode
  }

  return {
    // State
    events,
    persons,
    loading,
    error,

    // 筛选状态
    selectedPersonIds,
    selectedTypes,
    searchQuery,
    mode,

    // 编辑状态
    editingEvent,
    isEditorOpen,

    // Getters
    filteredEvents,
    visiblePersons,

    // Actions
    loadData,
    refreshEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    togglePerson,
    toggleType,
    clearFilters,
    openEditor,
    closeEditor,
    setMode
  }
})
