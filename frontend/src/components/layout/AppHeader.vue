<script setup lang="ts">
</script>

<template>
  <header class="bg-bg-main border-b border-axis/30 px-6 py-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-person-3 flex items-center justify-center">
            <svg class="w-5 h-5 text-bg-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-display font-bold text-text-primary">
              Timeline Explorer
            </h1>
            <p class="text-xs text-text-muted">
              高性能可编辑时间轴系统
            </p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-elevated">
          <span class="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span class="text-xs text-text-secondary">实时同步</span>
        </div>
      </div>
    </div>
  </header>
</template>
