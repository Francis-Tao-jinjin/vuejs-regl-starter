<script lang="ts">
import { GLApp } from './webgl/gl-app';
import { getReglInstance } from '../../../components/globals';
import { ref } from 'vue';
import { mat3, vec2 } from 'gl-matrix';
import { RectMesh } from './webgl/rect-mesh';

export default {
  name: 'transform2d',
  setup() {
    const glApp = ref<GLApp|null>(null);
    const transformMat = mat3.create();
    return {
      glApp,
      translationMatrix: mat3.create(),
      rotationMatrix: mat3.create(),
      scaleMatrix: mat3.create(),
      transformMat,
    };
  },
  data() {
    return {
      translationX: 0,
      translationY: 0,
      angleInDegrees: 0,
      scaleX: 1,
      scaleY: 1,
    }
  },
  watch: {
    translationX: function (val) {
      if (this.glApp) {
        this.glApp.translation[0] = val * window.innerWidth / 100;
        this.updateMatrix();
      }
    },
    translationY: function (val) {
      if (this.glApp) {
        this.glApp.translation[1] = val * window.innerHeight / 100;
        this.updateMatrix();
      }
    },
    angleInDegrees: function (val) {
      if (this.glApp) {
        const angleInRadians = val * Math.PI / 180;
        this.glApp.rotation[0] = Math.sin(angleInRadians);
        this.glApp.rotation[1] = Math.cos(angleInRadians);
        this.updateMatrix();
      }
    },
    scaleX: function (val) {
      if (this.glApp) {
        this.glApp.scale[0] = val;
        this.updateMatrix();
      }
    },
    scaleY: function (val) {
      if (this.glApp) {
        this.glApp.scale[1] = val;
        this.updateMatrix();
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
      for (let i = 0; i < 3; i++) {
        this.glApp.addRectMesh(new RectMesh());
      }
      this.glApp?.startReglFrame();
    },
    updateMatrix() {
      if (this.glApp) {

        mat3.identity(this.transformMat);
        mat3.identity(this.translationMatrix);
        mat3.identity(this.rotationMatrix);
        mat3.identity(this.scaleMatrix);

        mat3.translate(this.translationMatrix, this.translationMatrix, this.glApp.translation);
        mat3.rotate(this.rotationMatrix, this.rotationMatrix, this.angleInDegrees * Math.PI / 180);
        mat3.scale(this.scaleMatrix, this.scaleMatrix, this.glApp.scale);
        const moveOriginMatrix = mat3.create();
        mat3.translate(moveOriginMatrix, moveOriginMatrix, [-50, -75]);
        // mat3.translate(this.translationMatrix, this.translationMatrix, [-50, -75]);

        for (let i = 0; i < this.glApp.rectMeshs.length; i++) {
          // mat3.translate(this.transformMat, this.transformMat, this.glApp.translation);
          // mat3.rotate(this.transformMat, this.transformMat, this.angleInDegrees * Math.PI / 180);
          // mat3.scale(this.transformMat, this.transformMat, this.glApp.scale);

          // const newTranslate = mat3.create();
          // mat3.translate(newTranslate, newTranslate, (this.glApp.translation as number[]).map((v) => (v * 0.33)) as vec2);
          // mat3.multiply(this.transformMat, this.translationMatrix, this.rotationMatrix);
          mat3.multiply(this.transformMat, this.transformMat, this.translationMatrix);
          mat3.multiply(this.transformMat, this.transformMat, this.rotationMatrix);
          mat3.multiply(this.transformMat, this.transformMat, this.scaleMatrix);
          mat3.multiply(this.transformMat, this.transformMat, moveOriginMatrix);

          mat3.copy(this.glApp.rectMeshs[i].transformMat, this.transformMat);
        }
      }
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
      <div class="slidecontainer">
        <span>θ</span>
        <input type="range" min="0" max="360" v-model="angleInDegrees" class="slider" id="translate">
        <span>{{angleInDegrees}}</span>
      </div>
      <div class="slidecontainer">
        <span>ScaleX</span>
        <input type="range" min="-5" max="5" step="0.01" v-model="scaleX" class="slider" id="translate">
        <span>{{scaleX}}</span>
      </div>
      <div class="slidecontainer">
        <span>ScaleY</span>
        <input type="range" min="-5" max="5" step="0.01" v-model="scaleY" class="slider" id="translate">
        <span>{{scaleY}}</span>
      </div>
    </div>
  </div>
</template>