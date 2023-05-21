<script lang="ts">
import { ref } from 'vue'
import createREGL from 'regl/dist/regl.unchecked';
import { GLApp } from '../components/gl-app';
import { setReglInstance } from '../components/globals';
import canvasFit from 'canvas-fit';

export default {
  setup() {
    const reglContainer = ref<HTMLDivElement|null>(null);
    const reglCanvas = ref<HTMLCanvasElement|null>(null);
    const reglInstance = ref(null);
    const glApp = ref<GLApp|null>(null);
    return { reglContainer, reglCanvas, reglInstance, glApp };
  },
  mounted() {
    console.log('>> onMounted');
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
    this.glApp.startReglFrame();
  }
}
</script>

<template>
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
</style>