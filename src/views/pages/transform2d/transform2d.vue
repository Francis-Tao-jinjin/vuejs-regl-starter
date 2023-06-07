<script lang="ts">
import { GLApp } from './webgl/gl-app';
import { getReglInstance } from '../../../components/globals';
import { ref } from 'vue';

export default {
  name: 'transform2d',
  setup() {
    const glApp = ref<GLApp|null>(null);
    return {
      glApp,
    };
  },
  data() {
    return {
      translationX: 0,
      translationY: 0,
    }
  },
  watch: {
    translationX: function (val) {
      if (this.glApp) {
        this.glApp.translation[0] = val * window.innerWidth / 100;
      }
    },
    translationY: function (val) {
      if (this.glApp) {
        this.glApp.translation[1] = val * window.innerHeight / 100;
      }
    },
  },
  mounted() {
    const checkReglTimer = setInterval(() => {
      const reglInstance = getReglInstance();
      if (reglInstance !== null) {
        clearInterval(checkReglTimer);
        this.onReglReady();
      }
    }, 20);
  },
  unmounted() {
    this.glApp?.stopReglFrame();
  },
  methods: {
    onReglReady() {
      const regl = getReglInstance();
      this.glApp = new GLApp({ regl });
      this.glApp?.startReglFrame();
    },
  },
}
</script>

<template>
  <div class="ui-container">
    <div>
      <div class="slidecontainer">
        <span>X</span>
        <input type="range" min="0" max="100" v-model="translationX" class="slider" id="translate">
        <span>{{translationX}}</span>
      </div>
      <div class="slidecontainer">
        <span>Y</span>
        <input type="range" min="0" max="100" v-model="translationY" class="slider" id="translate">
        <span>{{translationY}}</span>
      </div>
    </div>
  </div>
</template>