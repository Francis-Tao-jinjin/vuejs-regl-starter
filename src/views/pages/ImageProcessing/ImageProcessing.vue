<script lang="ts">
import { KernelNames } from '@/utils/convmatrix';
import { GLApp } from './webgl/gl-app';
import { getReglInstance } from '../../../components/globals';
import textureURL from '@/assets/tex.png';
import { ref } from 'vue'
import Select from '../../../vue-components/select.vue';
import MultiSelect from '@/vue-components/multi-select.vue';

export default {
  name: 'ImageProcessing',
  components: {
    Select,
    MultiSelect,
  },
  setup() {
    const texturePreview = ref<HTMLImageElement|null>(null);
    const glApp = ref<GLApp|null>(null);
    return {
      glApp,
      texturePreview,
    };
  },
  data() {
    return {
      kernel: KernelNames[0],
      kernels: [KernelNames[0]],
    };
  },
  watch: {
    kernel: function (val) {
      console.log('>> kernel', val);
      if (this.glApp) {
        this.glApp.kernel = val;
      }
    },
    kernels: function (val) {
      if (this.glApp) {
        this.glApp.kernels = val;
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
      const texturePreview = (this.texturePreview as HTMLImageElement);
      texturePreview.src = textureURL;
      (new Promise((resolve) => {
        texturePreview.onload = () => {
          const texture = regl.texture(texturePreview);
          if (this.glApp) {
            this.glApp.texture = texture;
          }
          resolve(true);
        }
      })).then(() => {
        this.onResoucesLoaded();
      });
    },
    onResoucesLoaded() {
      console.log('>> onResoucesLoaded');
      this.glApp?.startReglFrame();
    }
  },
}
</script>

<template>
  <div class="ui-container">
    <div class="row">
      <div class="col texture-preview-col">
        <h3>Texture Preview</h3>
        <img ref="texturePreview" alt="texture prview" id="texture-preview" width="125" height="125" />
      </div>
      <div class="col" style="place-self: flex-start;">
        <h3>Choose a convolution kernel</h3>
        <Select v-model="kernel"></Select>
      </div>
      <div class="col multiSelect-col">
        <MultiSelect v-model:selectedSet="kernels"></MultiSelect>
      </div>
    </div>
  </div>
</template>


<style scoped>
.row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1rem
}

.col {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.texture-preview-col {
  align-self: flex-start;
}
.multiSelect-col {
  max-height: 170px;
}
</style>