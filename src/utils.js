import * as THREE from 'three'

export const createRenderTarget = (width, height, textureFilters) => {
  return new THREE.WebGLRenderTarget(width, height, textureFilters)
}

export const createFeedbackMaterial = (vertexShader, fragmentShader, dim, target) => {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { type: 'f', value: 0.0 },
      uDim: { value: dim },
      uTex: { value: target.texture },
    },
  })
}
