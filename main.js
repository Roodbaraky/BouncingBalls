import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const randomHexColorCode = () => {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0")}`;
};

class Ball {
  constructor() {
    this.geometry = new THREE.SphereGeometry(1);
    this.color = randomHexColorCode();
    this.material = new THREE.MeshBasicMaterial({ color: this.color });
    this.ball = new THREE.Mesh(this.geometry, this.material);
    this.dx = 0.01* (Math.round(Math.random()) ? 1 : -1);
    this.dy = 0.01* (Math.round(Math.random()) ? 1 : -1);
    this.dz = 0.01* (Math.round(Math.random()) ? 1 : -1);
    this.ball.position.setX(1 + Math.random() * 4);
    this.ball.position.setY(1 + Math.random() * 4);
    this.ball.position.setZ(1 + Math.random() * 4);
  }

  moveX() {
    if (Math.abs(this.ball.position.x) > 5) {
      this.dx *= -1;
    }
    this.ball.position.x += this.dx;
  }
  moveY() {
    if (Math.abs(this.ball.position.y) > 5) {
      this.dy *= -1;
    }
    this.ball.position.y += this.dy;
  }
  moveZ() {
    if (Math.abs(this.ball.position.z) > 5) {
      this.dz *= -1;
    }
    this.ball.position.z += this.dz;
  }
}

const balls = Array.from({ length: 5 }, () => new Ball());
balls.forEach((ball) => scene.add(ball.ball));

camera.position.z = 10;

function animate() {
  balls.forEach((ball) => {
    ball.moveX();
    ball.moveY();
    ball.moveZ();
  });
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
