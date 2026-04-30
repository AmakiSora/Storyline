<script setup lang="ts">
import { computed } from 'vue';
import type { TimelineEvent } from '../../types/timeline';
import { getPersonColor, getTypeColor } from '../../types/timeline';
import { formatDateFull } from '../../utils/dateUtils';

const props = defineProps<{
  event: TimelineEvent;
  x: number;
  y: number;
  canvasWidth: number;
  canvasHeight: number;
}>();

const tooltipStyle = computed(() => {
  const width = 280;
  const height = 180;
  const margin = 16;

  let left = props.x + margin;
  let top = props.y - height - margin;

  if (left + width > props.canvasWidth) {
    left = props.x - width - margin;
  }

  if (top < margin) {
    top = props.y + margin;
  }

  return {
    left: `${left}px`,
    top: `${top}px`,
  };
});

const personColor = computed(() => getPersonColor(props.event.person));
const typeColor = computed(() => getTypeColor(props.event.type));
</script>

<template>
  <div
    class="absolute z-50 pointer-events-none animate-fade-in"
    :style="tooltipStyle"
  >
    <div
      class="bg-bg-card/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-axis/30"
      style="width: 280px;"
    >
      <div class="flex items-start gap-3">
        <div
          class="w-1 h-12 rounded-full flex-shrink-0"
          :style="{ backgroundColor: personColor }"
        />
        <div class="flex-1 min-w-0">
          <h3 class="text-text-primary font-semibold text-base truncate">
            {{ event.title }}
          </h3>
          <p class="text-text-muted text-xs font-mono mt-0.5">
            {{ formatDateFull(event.date) }}
          </p>
        </div>
      </div>

      <p class="text-text-secondary text-sm mt-3 line-clamp-3">
        {{ event.content }}
      </p>

      <div class="flex items-center gap-2 mt-3">
        <span
          class="px-2 py-0.5 rounded-full text-xs font-medium"
          :style="{ backgroundColor: `${personColor}20`, color: personColor }"
        >
          {{ event.person }}
        </span>
        <span
          class="px-2 py-0.5 rounded-full text-xs font-medium"
          :style="{ backgroundColor: `${typeColor}20`, color: typeColor }"
        >
          {{ event.type }}
        </span>
      </div>

      <div
        v-if="event.image"
        class="mt-3 rounded-lg overflow-hidden h-24"
      >
        <img
          :src="event.image"
          :alt="event.title"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
  </div>
</template>
