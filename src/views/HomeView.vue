<script lang="ts">
import { KernelNames } from '@/utils/convmatrix';
import canvasFit from 'canvas-fit';
import createREGL from 'regl/dist/regl.unchecked';
import { GLApp } from './pages/ImageProcessing/webgl/gl-app';
import { setReglInstance } from '../components/globals';
import textureURL from '../assets/tex.png';
import { ref } from 'vue'
import Select from '../vue-components/select.vue';
import MultiSelect from '@/vue-components/multi-select.vue';
import { RouterView } from 'vue-router';

export default {
  components: {
    Select,
    MultiSelect,
},
  setup() {
    const reglContainer = ref<HTMLDivElement|null>(null);
    const reglCanvas = ref<HTMLCanvasElement|null>(null);
    return {
      reglContainer,
      reglCanvas,
    };
  },
  created() {
    console.log('path:', window.location.pathname);
    if (window.location.pathname === '/') {
      // set the default path to /img-processing
      this.$router.push('/img-processing');
    }
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
    setReglInstance(regl);
  },
  methods: {
  }
}
</script>

<template>
  <div ref="reglContainer" id="regl-view">
    <canvas ref="reglCanvas"/>
    <!-- Regl will automatically append a Canvas to the container, you can also create the Canvas by yourself -->
  </div>
  <div class="vue-ui-container">
    <div class="header">
      <div class="header-title">
        <h2>WebGL Playground</h2>
      </div>
    </div>
    <div class="content">
      <div class="side-nav">
        <router-link to="/img-processing">Image Processing</router-link>
        <router-link to="/about">About</router-link>
      </div>
      <RouterView/>
    </div>
  </div>
</template>

<style scoped>
#regl-view {
  width: 100%;
  height: 100%;
}

.vue-ui-container {
  position: absolute;
  top: 0;
  width: 100%;
}

.header-title {
  background: rgb(240 248 255 / 50%);
}

.content {
  display: flex;
  flex-direction: row;
}

.side-nav {
  display: flex;
  flex-direction: column;
  background-color: rgb(240 248 255 / 40%);
}

.side-nav a {
  color: black;
}

.side-nav a:hover {
  background-color: var(--color-background-mute);
}
</style>