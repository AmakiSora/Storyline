/**
 * useTimelineFilters.ts - 时间轴筛选逻辑
 *
 * 提供按人物、类型、时间范围的筛选功能
 */

import { ref, computed, type Ref } from 'vue'
import type { TimelineEvent, FilterCriteria, TimeRange } from '@/types'

export function useTimelineFilters(
  events: Ref<TimelineEvent[]>,
  persons: Ref<{ id: string; name: string; color: string }[]>
) {
  // 筛选状态
  const selectedPersonIds = ref<string[]>([])
  const selectedTypes = ref<string[]>([])
  const timeRange = ref<TimeRange | undefined>(undefined)
  const searchQuery = ref('')

  /**
   * 应用所有筛选条件
   */
  const filteredEvents = computed((): TimelineEvent[] => {
    let result = events.value

    // 1. 按人物筛选
    if (selectedPersonIds.value.length > 0) {
      result = result.filter(e =>
        selectedPersonIds.value.includes(e.personId)
      )
    }

    // 2. 按事件类型筛选
    if (selectedTypes.value.length > 0) {
      result = result.filter(e =>
        selectedTypes.value.includes(e.type)
      )
    }

    // 3. 按时间范围筛选
    if (timeRange.value) {
      const { start, end } = timeRange.value
      result = result.filter(e => {
        const eventDate = new Date(e.date).getTime()
        return eventDate >= start.getTime() && eventDate <= end.getTime()
      })
    }

    // 4. 按搜索关键词筛选
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(e =>
        e.title.toLowerCase().includes(query) ||
        e.content.toLowerCase().includes(query)
      )
    }

    // 5. 按时间排序
    result.sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    return result
  })

  /**
   * 切换人物筛选
   */
  const togglePerson = (personId: string): void => {
    const index = selectedPersonIds.value.indexOf(personId)
    if (index > -1) {
      selectedPersonIds.value.splice(index, 1)
    } else {
      selectedPersonIds.value.push(personId)
    }
  }

  /**
   * 切换类型筛选
   */
  const toggleType = (type: string): void => {
    const index = selectedTypes.value.indexOf(type)
    if (index > -1) {
      selectedTypes.value.splice(index, 1)
    } else {
      selectedTypes.value.push(type)
    }
  }

  /**
   * 设置时间范围
   */
  const setTimeRange = (range: TimeRange): void => {
    timeRange.value = range
  }

  /**
   * 清除所有筛选
   */
  const clearFilters = (): void => {
    selectedPersonIds.value = []
    selectedTypes.value = []
    timeRange.value = undefined
    searchQuery.value = ''
  }

  /**
   * 获取可见的人物列表
   */
  const visiblePersons = computed(() => {
    if (selectedPersonIds.value.length === 0) {
      return persons.value
    }
    return persons.value.filter(p =>
      selectedPersonIds.value.includes(p.id)
    )
  })

  /**
   * 获取当前筛选条件摘要
   */
  const filterSummary = computed(() => {
    const parts: string[] = []
    if (selectedPersonIds.value.length > 0) {
      parts.push(`${selectedPersonIds.value.length} 个人物`)
    }
    if (selectedTypes.value.length > 0) {
      parts.push(`${selectedTypes.value.length} 种类型`)
    }
    if (timeRange.value) {
      parts.push(`${timeRange.value.start.toLocaleDateString()} ~ ${timeRange.value.end.toLocaleDateString()}`)
    }
    if (searchQuery.value) {
      parts.push(`搜索: "${searchQuery.value}"`)
    }
    return parts.join(' · ') || '全部显示'
  })

  return {
    // 状态
    selectedPersonIds,
    selectedTypes,
    timeRange,
    searchQuery,

    // 计算属性
    filteredEvents,
    visiblePersons,
    filterSummary,

    // 方法
    togglePerson,
    toggleType,
    setTimeRange,
    clearFilters
  }
}

export type FiltersReturn = ReturnType<typeof useTimelineFilters>
