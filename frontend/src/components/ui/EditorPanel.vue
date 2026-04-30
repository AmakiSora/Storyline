<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useEditorStore } from '../../stores/editorStore';
import { useTimelineStore } from '../../stores/timelineStore';
import type { TimelineEventInput } from '../../types/timeline';
import { formatDateFull } from '../../utils/dateUtils';
import ConfirmModal from './ConfirmModal.vue';

const editorStore = useEditorStore();
const timelineStore = useTimelineStore();

const formData = ref<TimelineEventInput>({
  title: '',
  date: '',
  content: '',
  image: '',
  person: '',
  type: '',
});

const showDeleteConfirm = ref(false);
const errors = ref<Record<string, string>>({});

const isViewMode = computed(() => editorStore.mode === 'view');
const panelTitle = computed(() => {
  switch (editorStore.mode) {
    case 'create': return '添加事件';
    case 'edit': return '编辑事件';
    case 'view': return '事件详情';
    default: return '';
  }
});

watch(() => editorStore.currentEvent, (event) => {
  if (event) {
    formData.value = {
      title: event.title,
      date: formatDateForInput(event.date),
      content: event.content,
      image: event.image || '',
      person: event.person,
      type: event.type,
    };
  } else if (editorStore.mode === 'create') {
    resetForm();
  }
}, { immediate: true });

watch(() => editorStore.isPanelOpen, (isOpen) => {
  if (!isOpen) {
    errors.value = {};
  }
});

function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

function resetForm(): void {
  formData.value = {
    title: '',
    date: formatDateForInput(new Date()),
    content: '',
    image: '',
    person: timelineStore.uniquePersons[0] || '',
    type: timelineStore.uniqueTypes[0] || '',
  };
}

function validate(): boolean {
  errors.value = {};

  if (!formData.value.title.trim()) {
    errors.value.title = '请输入标题';
  }

  if (!formData.value.date) {
    errors.value.date = '请选择日期';
  }

  if (!formData.value.person) {
    errors.value.person = '请选择人物';
  }

  if (!formData.value.type) {
    errors.value.type = '请选择类型';
  }

  return Object.keys(errors.value).length === 0;
}

function handleSave(): void {
  if (!validate()) return;

  editorStore.saveEvent(formData.value);
  editorStore.closePanel();
}

function handleDelete(): void {
  if (editorStore.currentEvent) {
    editorStore.removeEvent(editorStore.currentEvent.id);
  }
  showDeleteConfirm.value = false;
}

function handleClose(): void {
  editorStore.closePanel();
}

function startEditing(): void {
  if (editorStore.currentEvent) {
    editorStore.openEditPanel(editorStore.currentEvent);
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="slide">
      <div
        v-if="editorStore.isPanelOpen"
        class="fixed inset-0 z-50 flex justify-end"
      >
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="handleClose"
        />

        <div
          class="relative w-full max-w-md bg-bg-main border-l border-axis/30 shadow-2xl flex flex-col animate-slide-in"
        >
          <div class="flex items-center justify-between px-6 py-4 border-b border-axis/30">
            <h2 class="text-lg font-semibold text-text-primary">
              {{ panelTitle }}
            </h2>
            <button
              @click="handleClose"
              class="p-2 rounded-lg hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6">
            <template v-if="isViewMode">
              <div v-if="editorStore.currentEvent" class="space-y-6">
                <div>
                  <h3 class="text-2xl font-display font-bold text-text-primary">
                    {{ editorStore.currentEvent.title }}
                  </h3>
                  <p class="mt-2 text-text-muted font-mono text-sm">
                    {{ formatDateFull(editorStore.currentEvent.date) }}
                  </p>
                </div>

                <div class="flex gap-2">
                  <span
                    class="px-3 py-1 rounded-full text-sm font-medium"
                    :style="{ backgroundColor: `${getPersonColor(editorStore.currentEvent.person)}20`, color: getPersonColor(editorStore.currentEvent.person) }"
                  >
                    {{ editorStore.currentEvent.person }}
                  </span>
                  <span
                    class="px-3 py-1 rounded-full text-sm font-medium"
                    :style="{ backgroundColor: `${getTypeColor(editorStore.currentEvent.type)}20`, color: getTypeColor(editorStore.currentEvent.type) }"
                  >
                    {{ editorStore.currentEvent.type }}
                  </span>
                </div>

                <p class="text-text-secondary leading-relaxed">
                  {{ editorStore.currentEvent.content }}
                </p>

                <div
                  v-if="editorStore.currentEvent.image"
                  class="rounded-xl overflow-hidden"
                >
                  <img
                    :src="editorStore.currentEvent.image"
                    :alt="editorStore.currentEvent.title"
                    class="w-full h-48 object-cover"
                  />
                </div>
              </div>
            </template>

            <template v-else>
              <form @submit.prevent="handleSave" class="space-y-5">
                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-2">
                    标题 <span class="text-error">*</span>
                  </label>
                  <input
                    v-model="formData.title"
                    type="text"
                    placeholder="输入事件标题"
                    class="w-full px-4 py-2.5 bg-bg-elevated rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
                    :class="{ 'ring-2 ring-error/50': errors.title }"
                  />
                  <p v-if="errors.title" class="mt-1 text-xs text-error">
                    {{ errors.title }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-2">
                    日期 <span class="text-error">*</span>
                  </label>
                  <input
                    v-model="formData.date"
                    type="date"
                    class="w-full px-4 py-2.5 bg-bg-elevated rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
                    :class="{ 'ring-2 ring-error/50': errors.date }"
                  />
                  <p v-if="errors.date" class="mt-1 text-xs text-error">
                    {{ errors.date }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-2">
                    人物 <span class="text-error">*</span>
                  </label>
                  <select
                    v-model="formData.person"
                    class="w-full px-4 py-2.5 bg-bg-elevated rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
                    :class="{ 'ring-2 ring-error/50': errors.person }"
                  >
                    <option value="" disabled>选择人物</option>
                    <option
                      v-for="person in timelineStore.uniquePersons"
                      :key="person"
                      :value="person"
                    >
                      {{ person }}
                    </option>
                    <option value="__new__">+ 添加新人物</option>
                  </select>
                  <p v-if="errors.person" class="mt-1 text-xs text-error">
                    {{ errors.person }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-2">
                    类型 <span class="text-error">*</span>
                  </label>
                  <select
                    v-model="formData.type"
                    class="w-full px-4 py-2.5 bg-bg-elevated rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
                    :class="{ 'ring-2 ring-error/50': errors.type }"
                  >
                    <option value="" disabled>选择类型</option>
                    <option
                      v-for="type in timelineStore.uniqueTypes"
                      :key="type"
                      :value="type"
                    >
                      {{ type }}
                    </option>
                    <option value="__new__">+ 添加新类型</option>
                  </select>
                  <p v-if="errors.type" class="mt-1 text-xs text-error">
                    {{ errors.type }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-2">
                    描述
                  </label>
                  <textarea
                    v-model="formData.content"
                    rows="4"
                    placeholder="输入事件描述..."
                    class="w-full px-4 py-2.5 bg-bg-elevated rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-2">
                    图片 URL
                  </label>
                  <input
                    v-model="formData.image"
                    type="url"
                    placeholder="https://..."
                    class="w-full px-4 py-2.5 bg-bg-elevated rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
              </form>
            </template>
          </div>

          <div class="px-6 py-4 border-t border-axis/30 flex gap-3">
            <template v-if="isViewMode">
              <button
                @click="startEditing"
                class="flex-1 px-4 py-2.5 bg-accent hover:bg-accent-hover text-bg-deep rounded-lg font-medium transition-colors"
              >
                编辑
              </button>
              <button
                @click="showDeleteConfirm = true"
                class="px-4 py-2.5 bg-error/20 hover:bg-error/30 text-error rounded-lg font-medium transition-colors"
              >
                删除
              </button>
            </template>

            <template v-else>
              <button
                @click="handleClose"
                class="flex-1 px-4 py-2.5 bg-bg-elevated hover:bg-axis text-text-primary rounded-lg font-medium transition-colors"
              >
                取消
              </button>
              <button
                @click="handleSave"
                class="flex-1 px-4 py-2.5 bg-accent hover:bg-accent-hover text-bg-deep rounded-lg font-medium transition-colors"
              >
                保存
              </button>
            </template>
          </div>
        </div>
      </div>
    </Transition>

    <ConfirmModal
      v-if="showDeleteConfirm"
      title="确认删除"
      message="确定要删除这个事件吗？此操作无法撤销。"
      @confirm="handleDelete"
      @cancel="showDeleteConfirm = false"
    />
  </Teleport>
</template>

<script lang="ts">
import { getPersonColor, getTypeColor } from '../../types/timeline';
export { getPersonColor, getTypeColor };
</script>
