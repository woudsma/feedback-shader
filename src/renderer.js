import * as THREE from 'three'
import axios from 'axios'
import * as utils from './utils'

import vertexShaderSource from './shaders/vertex-shader.glsl'
import fragmentShaderSource from './shaders/fragment-shader.glsl'

let { innerWidth: width, innerHeight: height, devicePixelRatio } = window

class Renderer {
  scene = new THREE.Scene()
  bufferScene = new THREE.Scene()
  renderer = new THREE.WebGLRenderer()
  camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, -3000, 3000)

  textureFilters = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
  }

  init = async () => {
    this.renderer.setPixelRatio(devicePixelRatio)
		this.renderer.setSize(width, height)
    this.tex0 = utils.createRenderTarget(width, height, this.textureFilters)
    this.tex1 = utils.createRenderTarget(width, height, this.textureFilters)
		document.body.appendChild(this.renderer.domElement)
    window.addEventListener('resize', this.handleResize, false)

    const vertexShader = await axios.get(vertexShaderSource).then(e => e.data)
    const fragmentShader = await axios.get(fragmentShaderSource).then(e => e.data)
    this.material = utils.createFeedbackMaterial(vertexShader, fragmentShader, [width, height], this.tex0)
    this.geom = new THREE.PlaneBufferGeometry(width, height)
    this.bufferMesh = new THREE.Mesh(this.geom, this.material)
    this.bufferScene.add(this.bufferMesh)
    this.mesh = new THREE.Mesh(this.geom, new THREE.MeshBasicMaterial({ map: this.tex1.texture }))
    this.scene.add(this.mesh)
    this.camera.z = 1000

    this.render()
  }

  render = () => {
    requestAnimationFrame(this.render)

    this.renderer.render(this.bufferScene, this.camera, this.tex1, true)
    const swapTexture = this.tex0
    this.tex0 = this.tex1
    this.tex1 = swapTexture
    this.mesh.material.map = this.tex1.texture
    this.bufferMesh.material.uniforms.uTime.value = Date.now()
    this.bufferMesh.material.uniforms.uTex.value = this.tex0.texture

    this.renderer.render(this.scene, this.camera)
  }

  handleResize = () => {
    let { innerWidth: width, innerHeight: height } = window
    // this.camera.top = height / 2
    // this.camera.right = width / 2
    // this.camera.bottom = -height / 2
    // this.camera.left = -width / 2
    // this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
    this.tex0.setSize(width, height)
    this.tex1.setSize(width, height)
    this.bufferMesh.material.uniforms.uTime.value = 0
  }
}

export default new Renderer()
