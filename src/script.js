import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { BooleanKeyframeTrack } from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Model
const gltfLoader = new GLTFLoader()
gltfLoader.load(
    '/models/model/scene.gltf',
    (gltf) => {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.position.y = 3
        gltf.scene.rotation.y = Math.PI * 0.5
        gltf.scene.position.x = 5
        gltf.scene.castShadow = true
        scene.add(gltf.scene)
    }
)

// Skybox
const box = new THREE.Mesh(
    new THREE.BoxGeometry(50, 50, 50),
    new THREE.MeshStandardMaterial({
        color: "#245592",
        metalness: 0.1,
        side: THREE.BackSide
    })
)

scene.add(box)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(50, 50), new THREE.MeshPhongMaterial({ color: '#A9A9A9', depthWrite: false }),
    new THREE.MeshStandardMaterial({
        wireframe: true
    })
)
floor.receiveShadow = true
floor.rotation.x = -Math.PI * 0.5
scene.add(floor)

// Grids
const grid = new THREE.GridHelper(100, 50, 0x000000, 0x000000);
grid.material.opacity = 1;
grid.material.transparent = true;
grid.material.receiveShadow = true
scene.add(grid);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(-5, 5, 0)
scene.add(directionalLight)

// sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 10, 10)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const tick = () => {
    controls.update()
        // Render
    renderer.render(scene, camera)
        // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()