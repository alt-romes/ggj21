// Create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xeeeeee );

// Create camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

const photo_geometry = new THREE.PlaneGeometry( 1, 1, 1 );
const photo_material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );

// TODO: photo for texture as parameter
const create_photo = function () {
    const plane = new THREE.Mesh( photo_geometry, photo_material );
    scene.add( plane );

    return plane;
}

var photo = create_photo();
photo.position.x -= 1;
photo.position.y += 1;

var photo2 = create_photo();
photo2.position.x += 2;
photo2.position.y -= 1;
photo2.position.z -= 1;

// Game logic
const update = function () {

};

// Render logic
const render = function () {

    photo.rotation.y += 0.01;
    photo2.rotation.y -= 0.02;

    renderer.render( scene, camera );
};

// Main loop game
const game_loop = function () {

    requestAnimationFrame( game_loop );

    update();
    render();
};

game_loop();
