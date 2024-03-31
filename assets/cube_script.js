const section = document.querySelector("section.cube");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
section.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();

const textures = [
    'images/rule 1.png', 'images/rule 2.png',
    'images/top1.png', 'images/bottom 1.png',
    'images/front 1.png', 'images/back 1.png'
];

const frontTexture = loader.load('images/front.png'); // Load the front texture separately

const materials = textures.map(url => {
    return new THREE.MeshBasicMaterial({ map: loader.load(url) });
});

const geometry = new THREE.BoxGeometry(1, 1, 1);
const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

let rotating = false;
let reverseRotation = false;
let rotationAngle = -Math.PI / 2; // Initial rotation angle
let completedRotation = false; // Flag to track completed rotation
let reachedBottom = false; // Flag to track reaching the bottom of the page

function rotateCubeTo(imageUrl) {
    const index = textures.findIndex(url => url === imageUrl);
    if (index !== -1) {
        const targetRotation = rotationAngle * index;
        cube.rotation.y = targetRotation;
    }
}

function handleScroll() {
    if (!rotating) {
        rotateCubeTo('images/rule 1.png'); // Rotate left first (rule 1.png in front)
        rotating = true;
        animate();
    } else if (!reverseRotation) {
        // After one complete scroll cycle, reverse the rotation direction
        reverseRotation = true;
        rotationAngle *= -1; // Reverse the rotation angle
        completedRotation = true; // Set completed rotation flag
    } else {
        rotateCubeTo('images/rule 2.png'); // Rotate right after left rotation (rule 2.png in front)
        animate();
    }

    // Check if the user has scrolled to the bottom of the page
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        reachedBottom = true;
    } else {
        reachedBottom = false;
    }

    // Update footer visibility based on scroll position
    const footer = document.getElementById('footer');
    if (reachedBottom && (completedRotation || reverseRotation)) {
        footer.classList.remove('hidden'); // Show the footer
    } else {
        footer.classList.add('hidden'); // Hide the footer
    }
}

window.addEventListener('scroll', handleScroll);

function animate() {
    requestAnimationFrame(animate);

    const currentTimeline = window.pageYOffset / 3000;
    const rx = currentTimeline * Math.PI * 2; // Convert to radians for rotation
    cube.rotation.y = rx;

    if (reachedBottom && (completedRotation || reverseRotation)) {
        // Update cube materials to use the front texture for all faces only at the bottom
        cube.material = materials.map(() => new THREE.MeshBasicMaterial({ map: frontTexture }));
    } else {
        // Revert to previous images for all faces
        cube.material = materials;
    }

    renderer.render(scene, camera);
}