<script setup lang="ts">
import AppHeader from '../components/layout/AppHeader.vue';
import ControlPanel from '../components/ui/ControlPanel.vue';
import TimelineCanvas from '../components/timeline/TimelineCanvas.vue';
import EditorPanel from '../components/ui/EditorPanel.vue';
</script>

<template>
  <div class="min-h-screen bg-bg-deep">
    <AppHeader />

    <main class="flex flex-col h-[calc(100vh-73px)]">
      <ControlPanel />

      <div class="flex-1 overflow-hidden">
        <TimelineCanvas />
      </div>

      <div class="h-12 border-t border-axis/30 flex items-center justify-center px-6">
        <div class="flex items-center gap-6 text-xs text-text-muted">
          <span class="flex items-center gap-2">
            <kbd class="px-1.5 py-0.5 rounded bg-bg-elevated font-mono">滚轮</kbd>
            缩放
          </span>
          <span class="flex items-center gap-2">
            <kbd class="px-1.5 py-0.5 rounded bg-bg-elevated font-mono">拖拽</kbd>
            移动
          </span>
          <span class="flex items-center gap-2">
            <kbd class="px-1.5 py-0.5 rounded bg-bg-elevated font-mono">双击</kbd>
            添加事件
          </span>
        </div>
      </div>
    </main>

    <EditorPanel />
  </div>
</template>
