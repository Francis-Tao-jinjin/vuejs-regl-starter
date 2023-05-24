<script lang="ts">
import { KernelNames, type KernelName } from '@/utils/convmatrix';
import type { PropType } from 'vue';

export default {
  name: 'MultiSelect',
  props:{
    selectedSet: {
      type: Array as PropType<KernelName[]>,
      default: () => [],
    }
  },
  emits: ['update:selectedSet'],
  data() {
    return {
      items: KernelNames,
    }
  },
  methods: {
    isSelected(item: KernelName) {
      return this.selectedSet?.includes(item);
    },
    removeItem(item: KernelName) {
      this.$emit('update:selectedSet', this.selectedSet.filter((i) => i !== item));
    },
    selectItem(item: KernelName) {
      console.log('>> selectItem', item);
      if (!this.isSelected(item)) {
        this.$emit('update:selectedSet', [...this.selectedSet, item]);
      }
    },
  },
  mounted() {
    console.log('>> MultiSelect mounted', this.selectedSet);
  },
}
</script>

<template>
  <div class="multi-select-container">
    <div class="options-container">
      <div v-for="item in items" :key="item">
        <button class="option" :disabled="isSelected(item)"
          @click="selectItem(item)"
        >{{item}}</button>
      </div>
    </div>
    <div class="selected-container">
      <div class="selected-item" v-for="item in selectedSet" :key="item">
        {{item}}
        <button @click="removeItem(item)">X</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.multi-select-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.options-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  max-height: 200px;
  overflow-y: scroll;
}
.selected-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  max-height: 200px;
  overflow-y: scroll;
}
.option {
  border: 1px solid black;
  background-color: aliceblue;
  color: darkblue;
}

.option:hover {
  cursor: pointer;
}

.selected-item {
  margin: 0.1rem;
  border: 1px solid grey;
  background-color: rgb(237, 237, 237);
  color: #3F51B5;
}

.selected-item button:hover {
  cursor: pointer;
}
</style>