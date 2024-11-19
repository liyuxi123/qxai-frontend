<!-- TestEmitter.vue -->
<template>
  <div>
    <button @click="emitEvent">发射事件</button>
     <MetricsDialog />
  </div>
</template>
<script>
import { EventBus } from '@/utils/eventBus/event-bus';

import  MetricsDialog from '@/views/metrics/MetricsDialog.vue'
export default {

  components: {
    MetricsDialog
  },
  methods: {
    emitEvent() {
      console.log('准备发射事件');
      EventBus.$emit('testEvent', 'Hello from TestEmitter!');
      console.log('事件已发射');
    }
  }
};
</script>
