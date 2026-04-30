import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { TimelineEvent, TimelineEventInput } from '../types/timeline';
import { useTimelineStore } from './timelineStore';

export type EditorMode = 'create' | 'edit' | 'view' | 'closed';

export const useEditorStore = defineStore('editor', () => {
  const mode = ref<EditorMode>('closed');
  const currentEvent = ref<TimelineEvent | null>(null);
  const isPanelOpen = ref(false);

  function openCreatePanel(_date?: Date): void {
    mode.value = 'create';
    currentEvent.value = null;
    isPanelOpen.value = true;
  }

  function openEditPanel(event: TimelineEvent): void {
    mode.value = 'edit';
    currentEvent.value = { ...event };
    isPanelOpen.value = true;
  }

  function openViewPanel(event: TimelineEvent): void {
    mode.value = 'view';
    currentEvent.value = event;
    isPanelOpen.value = true;
  }

  function closePanel(): void {
    mode.value = 'closed';
    currentEvent.value = null;
    isPanelOpen.value = false;
  }

  function saveEvent(input: TimelineEventInput): TimelineEvent | null {
    const timelineStore = useTimelineStore();

    if (mode.value === 'create') {
      return timelineStore.addEvent(input);
    } else if (mode.value === 'edit' && currentEvent.value) {
      return timelineStore.updateEvent(currentEvent.value.id, input);
    }

    return null;
  }

  function removeEvent(id: string): boolean {
    const timelineStore = useTimelineStore();
    const success = timelineStore.deleteEvent(id);
    if (success) {
      closePanel();
    }
    return success;
  }

  return {
    mode,
    currentEvent,
    isPanelOpen,
    openCreatePanel,
    openEditPanel,
    openViewPanel,
    closePanel,
    saveEvent,
    removeEvent,
  };
});
