import * as THREE from "three";
import { stereoPass } from "three/examples/jsm/tsl/display/StereoPassNode.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const bounds = Math.min(window.innerWidth, window.innerHeight) / 100;
document.body.appendChild(renderer.domElement);

const randomHexColorCode = () => {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0")}`;
};

class Ball {
  dmax = 4;
  constructor() {
    this.geometry = new THREE.SphereGeometry(1, 32, 32);
  
   
    const randomColor = new THREE.Color(randomHexColorCode());
  
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        baseColor: { value: randomColor.toArray() }, 
        steps: { value: 9.0 }, 
      },
      wireframe: false,
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 baseColor; // Base color for the ball
        uniform float steps;    // Number of gradient steps
        varying vec3 vPosition;
  
        void main() {
          float mixFactor = (vPosition.y + 1.0) / 2.0; // Normalize y to [0, 1]
          float stepFactor = floor(mixFactor * steps) / (steps - 1.0);
          vec3 stepColor = baseColor * (0.7 + 0.3 * stepFactor); // Darken or lighten the base color
          gl_FragColor = vec4(stepColor, 1.0);
        }
      `,
    });
  
    this.ball = new THREE.Mesh(this.geometry, this.material);
    this.dx = (Math.random() * this.dmax - 2) * 0.1;
    this.dy = (Math.random() * this.dmax - 2) * 0.1;
    this.dz = (Math.random() * this.dmax - 2) * 0.1;
    this.ball.position.set(
      Math.random() * bounds - bounds / 2,
      Math.random() * bounds - bounds / 2,
      Math.random() * bounds - bounds / 2
    );
  }
  

  move() {
    if (Math.abs(this.ball.position.x) > bounds) this.dx *= -1;
    if (Math.abs(this.ball.position.y) > bounds) this.dy *= -1;
    if (Math.abs(this.ball.position.z) > bounds) this.dz *= -1;
    this.ball.position.x += this.dx;
    this.ball.position.y += this.dy;
    this.ball.position.z += this.dz;
  }
}

const balls = Array.from({ length: 10 }, () => new Ball());
balls.forEach((ball) => scene.add(ball.ball));

camera.position.z = bounds * 3;

function drawLine(ball1, ball2) {
  const dist = ball1.ball.position.distanceTo(ball2.ball.position);
  if (dist < bounds / 0.7) {
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: Math.min(1, 2 / dist),
      linewidth: Math.min(1, 10 / dist),
    });
    const points = [];
    points.push(ball1.ball.position.clone());
    points.push(ball2.ball.position.clone());
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    setTimeout(() => scene.remove(line), 10);
  }
}

function animate() {
  balls.forEach((ball) => ball.move());

  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      drawLine(balls[i], balls[j]);
    }
  }

  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  const bounds = Math.min(window.innerWidth, window.innerHeight) / 100;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.z = bounds * 3;
});

renderer.setAnimationLoop(animate);
