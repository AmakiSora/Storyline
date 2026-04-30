<script setup lang="ts">
defineProps<{
  title: string;
  message: string;
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="emit('cancel')"
        />

        <div class="relative bg-bg-card rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-scale-in">
          <h3 class="text-lg font-semibold text-text-primary mb-2">
            {{ title }}
          </h3>

          <p class="text-text-secondary text-sm mb-6">
            {{ message }}
          </p>

          <div class="flex gap-3">
            <button
              @click="emit('cancel')"
              class="flex-1 px-4 py-2.5 bg-bg-elevated hover:bg-axis text-text-primary rounded-lg font-medium transition-colors"
            >
              取消
            </button>
            <button
              @click="emit('confirm')"
              class="flex-1 px-4 py-2.5 bg-error hover:bg-error/80 text-white rounded-lg font-medium transition-colors"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
