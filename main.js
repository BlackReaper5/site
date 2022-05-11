import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js"
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";

let camera, controls, scene, renderer, player, forward_button, backward_button;
let cube, cube2;
const fov = 100;
const aspect = window.innerWidth / window.innerHeight;
const near = 1;
const far = 1000;
var current_state = "paused";

const clock = new THREE.Clock();
const speed = 2;

initWorld();

function initWorld() {
  // Buttons
  forward_button = document.getElementById("forward_button");
  forward_button.addEventListener("click", function () {

    onForward();

  });

  backward_button = document.getElementById("backward_button");
  backward_button.addEventListener("click", function () {

    onBackward();

  });



  // Main 
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);



  // // Controls
  // controls = new OrbitControls(camera, renderer.domElement);
  // controls.listenToKeyEvents(window); // optional
  // //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
  // controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  // controls.dampingFactor = 0.05;
  // controls.screenSpacePanning = false;
  // // controls.minDistance = 100;
  // // controls.maxDistance = 400;
  // controls.maxPolarAngle = Math.PI / 2;



  // Objects
  const geometry = new THREE.BoxGeometry(10, 10, 10);
  const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
  cube = new THREE.Mesh(geometry, material);
  cube2 = new THREE.Mesh(geometry, material);
  const cubePosition = new THREE.Vector3(0, 0, 0);
  const cube2Position = new THREE.Vector3(250, 0, -300);
  cube.position.set(cubePosition.x, cubePosition.y, cubePosition.z);
  cube2.position.set(cube2Position.x, cube2Position.y, cube2Position.z);

  scene.add(cube, cube2);



  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);


  // Listeners
  window.addEventListener('resize', onWindowResize);
  // window.addEventListener("wheel", onMouseWheel);



  // Helpers
  const size = 1000;
  const divisions = 50;

  const gridHelper = new THREE.GridHelper(size, divisions);
  scene.add(gridHelper);



  // Inits
  initPlayer();
  update();
}

// Helper functions
// Buttons

function onForward() {
  console.log("Go forward")
  current_state = "forward";
}

function onBackward() {
  console.log("Go backward")
  current_state = "backward";
}

function render() {
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
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

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

function followCamera() {
  //Offset from camera to player
  var relativeCameraOffset = new THREE.Vector3(0, 10, 12);

  //UPDATE PLAYER WORLD MATRIX FOR PERFECT CAMERA FOLLOW
  player.updateMatrixWorld()
  //Apply offset to player matrix
  var cameraOffset = relativeCameraOffset.applyMatrix4(player.matrixWorld);

  //Apply position offset to camera DIRECTLY -> NOT SMOOTH
  // camera.position.x = cameraOffset.x;
  // camera.position.y = cameraOffset.y;
  // camera.position.z = cameraOffset.z;

  //SMOOTH CAMERA POSITION TO TARGET POSITION
  camera.position.lerp(cameraOffset, 0.5);
  camera.lookAt(player.position);
}

function initPlayer() {
  //Create player object
  player = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), new THREE.MeshLambertMaterial( { color: 0x9797CE } ) );
  player.position.y = 0.5;
  player.position.z = 100;
  player.position.needsUpdate = true; 
// add the object to the scene
  scene.add( player );
}

function update(time) {
  if (current_state == "paused") {}
  else if (current_state == "forward") {
    player.translateZ(-1);
  }
  else if (current_state == "backward") { 
    player.translateZ(1);
  }
  if (player.position.z < cube.position.z + 20) {
    current_state = "paused";
  }

  if (player.position.z > cube.position.z + 200) {
    current_state = "paused";
  }

  //UPDATE CAMERA POSITION
  followCamera();

  //UPDATE RENDER
  render();
  // controls.update();
  requestAnimationFrame(update);
}