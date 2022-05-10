import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js"
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";

let camera, controls, scene, renderer;
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 1;
const far = 1000;

init();
animate();

function init() {

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 500;

  // controls

  controls = new OrbitControls(camera, renderer.domElement);
  controls.listenToKeyEvents(window); // optional

  //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;

  controls.screenSpacePanning = false;

  controls.minDistance = 100;
  controls.maxDistance = 400;

  controls.maxPolarAngle = Math.PI / 2;

  // Object
  const geometry = new THREE.BoxGeometry(10, 10, 10);
  const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
  const cube = new THREE.Mesh(geometry, material);
  const cube2 = new THREE.Mesh(geometry, material);
  cube.position.set(100, 0, 0);
  cube2.position.set(0, 0, 250);

  scene.add(cube, cube2);
  // lights
  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

  // Listeners
  window.addEventListener('resize', onWindowResize);
  // window.addEventListener("wheel", onMouseWheel);
}

// Helper functions
function render() {
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  
  renderer.render(scene, camera);

}

function animate() {

  requestAnimationFrame(animate);

  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

  render();

}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function onMouseWheel() {
  const top = document.body.getBoundingClientRect().top;
  camera.position.z = top * -0.01;
  controls.update();
}