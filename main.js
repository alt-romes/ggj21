
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

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}

window.addEventListener( 'resize', onWindowResize );

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

let moveLeft = false;
let moveRight = false;
let moveForward = false;
let moveBackward = false;

var onKeyDown = function ( event ) {
    switch ( event.keyCode ) {
        case 38: // up
        case 87: // w
            moveForward = true;
            break;
        case 37: // left
        case 65: // a
            moveLeft = true; break;
        case 40: // down
        case 83: // s
            moveBackward = true;
            break;
        case 39: // right
        case 68: // d
            moveRight = true;
            break;
        case 32: // space
            if ( canJump === true ) velocity.y += 350;
            canJump = false;
            break;
    }
};
var onKeyUp = function ( event ) {
    switch( event.keyCode ) {
        case 38: // up
        case 87: // w
            moveForward = false;
            break;
        case 37: // left
        case 65: // a
            moveLeft = false;
            break;
        case 40: // down
        case 83: // s
            moveBackward = false;
            break;
        case 39: // right
        case 68: // d
            moveRight = false;
            break;
    }
};

document.addEventListener( 'keydown', onKeyDown, false );
document.addEventListener( 'keyup', onKeyUp, false );




// Game logic
const update = function () {
    if (moveForward) {
        camera.position.z -= 1/60;
    }
    if (moveBackward) {
        camera.position.z += 1/60;
    }
    if (moveLeft) {
        camera.position.x -= 1/60;
    }
    if (moveRight) {
        camera.position.x += 1/60;
    }
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
