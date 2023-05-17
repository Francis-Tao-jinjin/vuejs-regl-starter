<script lang="ts">
import { ref } from 'vue'
import createREGL, { type Regl } from 'regl';
import { GLApp } from '../components/gl-app';
import { setReglInstance } from '../components/globals';

export default {
  setup() {
    const reglContainer = ref<HTMLDivElement|null>(null);
    const reglInstance = ref<Regl|null>(null);
    const glApp = ref<GLApp|null>(null);
    return { reglContainer, reglInstance, glApp };
  },
  mounted() {
    console.log('>> onMounted');
    const regl = createREGL({
      container: this.$refs.regContainer as HTMLDivElement,
      extensions: [
        'OES_element_index_uint',
        'OES_standard_derivatives',
      ],
      optionalExtensions: [
        'WEBGL_draw_buffers',
        'OES_texture_float',
        'EXT_color_buffer_float',
        'OES_texture_float_linear',
        'OES_texture_half_float',
        'EXT_color_buffer_half_float',
        'OES_texture_half_float_linear',
        'WEBGL_depth_texture',
        'EXT_shader_texture_lod',
        'EXT_disjoint_timer_query',
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
  <div ref="regContainer" id="regl-view"> 
    <!-- Regl will automatically append a Canvas to the container, you can also create the Canvas by yourself -->
  </div>
</template>

<style scoped>
#regl-view {
  width: 100%;
  height: 100%;
}
</style>