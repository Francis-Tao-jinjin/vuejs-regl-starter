<script lang="ts">
import { KernelNames } from '@/utils/convmatrix';
import canvasFit from 'canvas-fit';
import createREGL from 'regl/dist/regl.unchecked';
import { GLApp } from '../components/gl-app';
import { setReglInstance } from '../components/globals';
import textureURL from '../assets/tex.png';
import { ref } from 'vue'
import Select from '../vue-components/select.vue';
import MultiSelect from '@/vue-components/multi-select.vue';

export default {
  components: {
    Select,
    MultiSelect,
},
  setup() {
    const reglContainer = ref<HTMLDivElement|null>(null);
    const reglCanvas = ref<HTMLCanvasElement|null>(null);
    const reglInstance = ref(null);
    const texturePreview = ref<HTMLImageElement|null>(null);
    const glApp = ref<GLApp|null>(null);

    return {
      reglContainer,
      reglCanvas,
      reglInstance,
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
    const canvas = this.$refs.reglCanvas as HTMLCanvasElement;
    const gl = canvas.getContext("webgl2");

    window.addEventListener('resize', canvasFit(canvas), false);
    console.log(gl);
    const regl = createREGL({
      canvas,
      gl: gl as WebGL2RenderingContext,
      container: this.$refs.reglContainer as HTMLDivElement,
      extensions: [
        // 'OES_element_index_uint',
        // 'OES_standard_derivatives',
      ],
      optionalExtensions: [
        // 'WEBGL_draw_buffers',
        // 'OES_texture_float',
        'EXT_color_buffer_float',
        'OES_texture_float_linear',
        // 'OES_texture_half_float',
        'EXT_color_buffer_half_float',
        // 'OES_texture_half_float_linear',
        // 'WEBGL_depth_texture',
        // 'EXT_shader_texture_lod',
        // 'EXT_disjoint_timer_query',
        'EXT_disjoint_timer_query_webgl2'
      ],
      attributes: {
        alpha: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: true,
      },
    });
    this.reglInstance = regl;
    setReglInstance(regl);
    this.glApp = new GLApp({regl});

    const texturePreview = (this.$refs.texturePreview as HTMLImageElement);
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
  methods: {
    onResoucesLoaded() {
      console.log('>> onResoucesLoaded');
      this.glApp?.startReglFrame();
    }
  }
}
</script>

<template>
  <div class="ui-container">
    <div class="row">
      <div class="col">
        <h2>Texture Preview</h2>
        <img ref="texturePreview" alt="texture prview" id="texture-preview" width="125" height="125" />
      </div>
      <div class="col" style="place-self: flex-start;">
        <h3>Choose a convolution kernel</h3>
        <Select v-model="kernel"></Select>
      </div>
      <div class="col">
        <MultiSelect v-model:selectedSet="kernels"></MultiSelect>
      </div>
    </div>
  </div>
  <div ref="reglContainer" id="regl-view">
    <canvas ref="reglCanvas"/>
    <!-- Regl will automatically append a Canvas to the container, you can also create the Canvas by yourself -->
  </div>
</template>

<style scoped>
#regl-view {
  width: 100%;
  height: 100%;
}

.ui-container {
  z-index: 2;
  position: absolute;
}

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
</style>