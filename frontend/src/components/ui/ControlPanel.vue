<script setup lang="ts">
import { ref } from 'vue';
import { useTimelineStore } from '../../stores/timelineStore';
import { useEditorStore } from '../../stores/editorStore';
import { getPersonColor, getTypeColor } from '../../types/timeline';
import { debounce } from '../../utils/dateUtils';

const timelineStore = useTimelineStore();
const editorStore = useEditorStore();

const searchInput = ref('');
const showFilters = ref(false);

const debouncedSearch = debounce((value: string) => {
  timelineStore.setFilterOptions({ searchQuery: value });
}, 300);

function onSearchInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  searchInput.value = value;
  debouncedSearch(value);
}

function togglePerson(person: string): void {
  const persons = [...timelineStore.filterOptions.persons];
  const index = persons.indexOf(person);

  if (index === -1) {
    persons.push(person);
  } else {
    persons.splice(index, 1);
  }

  timelineStore.setFilterOptions({ persons });
}

function toggleType(type: string): void {
  const types = [...timelineStore.filterOptions.types];
  const index = types.indexOf(type);

  if (index === -1) {
    types.push(type);
  } else {
    types.splice(index, 1);
  }

  timelineStore.setFilterOptions({ types });
}

function setViewMode(mode: 'overlay' | 'lane'): void {
  timelineStore.setViewMode(mode);
}

function openCreateEvent(): void {
  editorStore.openCreatePanel();
}
</script>

<template>
  <div class="bg-bg-card/80 backdrop-blur-sm border-b border-axis/30">
    <div class="px-6 py-4">
      <div class="flex items-center gap-4">
        <div class="flex-1 max-w-md">
          <div class="relative">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="搜索事件..."
              :value="searchInput"
              @input="onSearchInput"
              class="w-full pl-10 pr-4 py-2 bg-bg-elevated rounded-lg text-text-primary placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
        </div>

        <div class="flex items-center gap-2">
          <div class="flex bg-bg-elevated rounded-lg p-1">
            <button
              @click="setViewMode('overlay')"
              class="px-3 py-1.5 rounded-md text-sm transition-colors"
              :class="timelineStore.viewMode === 'overlay' ? 'bg-accent text-bg-deep' : 'text-text-secondary hover:text-text-primary'"
            >
              叠加
            </button>
            <button
              @click="setViewMode('lane')"
              class="px-3 py-1.5 rounded-md text-sm transition-colors"
              :class="timelineStore.viewMode === 'lane' ? 'bg-accent text-bg-deep' : 'text-text-secondary hover:text-text-primary'"
            >
              并列
            </button>
          </div>

          <button
            @click="showFilters = !showFilters"
            class="px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
            :class="showFilters ? 'bg-accent text-bg-deep' : 'bg-bg-elevated text-text-secondary hover:text-text-primary'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            筛选
          </button>

          <button
            @click="openCreateEvent"
            class="px-4 py-2 bg-accent hover:bg-accent-hover text-bg-deep rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            添加事件
          </button>
        </div>
      </div>

      <div
        v-if="showFilters"
        class="mt-4 pt-4 border-t border-axis/30 animate-fade-in"
      >
        <div class="grid grid-cols-2 gap-6">
          <div>
            <h4 class="text-text-secondary text-xs font-medium uppercase tracking-wider mb-3">
              人物
            </h4>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="person in timelineStore.uniquePersons"
                :key="person"
                @click="togglePerson(person)"
                class="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                :style="{
                  backgroundColor: timelineStore.filterOptions.persons.includes(person) ? getPersonColor(person) : 'transparent',
                  color: timelineStore.filterOptions.persons.includes(person) ? '#0f0f1a' : getPersonColor(person),
                  border: `1px solid ${getPersonColor(person)}`
                }"
              >
                {{ person }}
              </button>
            </div>
          </div>

          <div>
            <h4 class="text-text-secondary text-xs font-medium uppercase tracking-wider mb-3">
              类型
            </h4>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="type in timelineStore.uniqueTypes"
                :key="type"
                @click="toggleType(type)"
                class="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                :style="{
                  backgroundColor: timelineStore.filterOptions.types.includes(type) ? getTypeColor(type) : 'transparent',
                  color: timelineStore.filterOptions.types.includes(type) ? '#0f0f1a' : getTypeColor(type),
                  border: `1px solid ${getTypeColor(type)}`
                }"
              >
                {{ type }}
              </button>
            </div>
          </div>
        </div>

        <div class="mt-4 flex justify-end">
          <button
            @click="timelineStore.clearFilters"
            class="px-3 py-1.5 text-text-muted hover:text-text-primary text-sm transition-colors"
          >
            清除筛选
          </button>
        </div>
      </div>
    </div>

    <div class="px-6 pb-3 flex items-center gap-4 text-xs text-text-muted">
      <span>共 {{ timelineStore.filteredEvents.length }} 个事件</span>
      <span v-if="timelineStore.filterOptions.persons.length > 0 || timelineStore.filterOptions.types.length > 0">
        已筛选 {{ timelineStore.events.length - timelineStore.filteredEvents.length }} 个
      </span>
    </div>
  </div>
</template>
