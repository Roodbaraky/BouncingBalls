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
  dmax = 4;
  constructor() {
    this.geometry = new THREE.SphereGeometry(1);
    this.color = randomHexColorCode();
    this.material = new THREE.MeshBasicMaterial({ color: this.color });
    this.ball = new THREE.Mesh(this.geometry, this.material);
    this.dx = (Math.random() * this.dmax - 2) * 0.1;
    this.dy = (Math.random() * this.dmax - 2) * 0.1;
    this.dz = (Math.random() * this.dmax - 2) * 0.1;
    this.ball.position.set(
      Math.random() * 10 - 5,
      Math.random() * 10 - 5,
      Math.random() * 10 - 5
    );
  }

  move() {
    if (Math.abs(this.ball.position.x) > 5) this.dx *= -1;
    if (Math.abs(this.ball.position.y) > 5) this.dy *= -1;
    if (Math.abs(this.ball.position.z) > 5) this.dz *= -1;

    this.ball.position.x += this.dx;
    this.ball.position.y += this.dy;
    this.ball.position.z += this.dz;
  }
}

const balls = Array.from({ length: 20 }, () => new Ball());
balls.forEach((ball) => scene.add(ball.ball));

camera.position.z = 15;

function drawLine(ball1, ball2) {
  const dist = ball1.ball.position.distanceTo(ball2.ball.position);
  const material = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: `${dist / 40}`,
  });
  const points = [];
  points.push(ball1.ball.position.clone());
  points.push(ball2.ball.position.clone());
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  scene.add(line);

  setTimeout(() => scene.remove(line), 16);
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

renderer.setAnimationLoop(animate);
