<script lang="ts">
import { KernelNames } from '@/utils/convmatrix';

export default {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  setup(props) {
    return {
      items: KernelNames,
    };
  },
  data() {
    return {
      fieldValue: this.modelValue,
    };
  },
  emits: ['update:modelValue'],
  methods: {
    emitValue(ev: Event) {
      this.$emit('update:modelValue', this.fieldValue);
    },
  },
  watch: {
    modelValue: function (val) {
      this.fieldValue = val;
    },
  },
}
</script>

<template>
  <select @change="emitValue" v-model="fieldValue">
    <option v-for="item in items" :key="item" :value="item" >{{ item }}</option>
  </select>
  <span>Selected: {{ fieldValue }}</span>
</template>