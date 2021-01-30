import * as THREE from './node_modules/three/build/three.module.js'
import {PointerLockControls} from './node_modules/three/examples/jsm/controls/PointerLockControls.js'
import {RectAreaLightUniformsLib} from './node_modules/three/examples/jsm/lights/RectAreaLightUniformsLib.js';





/*---- Important Global Objects -----------------------------------*/

// Needed for RectAreaLighting
RectAreaLightUniformsLib.init();

// Create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x0 );
scene.fog = new THREE.Fog( 0x0, 0, 200 );

// Create camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 20;
camera.position.y = 10;

// Create controls for movement
const controls = new PointerLockControls( camera, document.body );
scene.add( controls.getObject() );





/*---- HTML Control -----------------------------------------------*/


document.getElementById("menu").addEventListener( 'click', function () { controls.lock(); } );
controls.addEventListener( 'lock', function () { document.getElementById("blocker").style.display = 'none'; document.getElementById("menu").style.display = 'none'; } );
controls.addEventListener( 'unlock', function () { document.getElementById("blocker").style.display = 'block'; document.getElementById("menu").style.display = ''; } );

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize );





/*---- Photos Logic -----------------------------------------------*/


const photo_geometry = new THREE.PlaneGeometry( 25, 25, 25 );
const create_photo = function () {

    // TODO: photo for texture as parameter

    const map = new THREE.TextureLoader().load( 'phot.png' );
    const photo_material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, map: map} );

    const plane = new THREE.Mesh( photo_geometry, photo_material );
    plane.position.y += 13;
    scene.add( plane );
    
    const intensity = 10;
    const width = 12;
    const height = 4;
    const light = new THREE.RectAreaLight(0xFFFFFF, intensity, width, height);
    plane.add(light);

    return plane;
}

var photo = create_photo();
photo.position.x -= 40;

var photo2 = create_photo();
photo2.position.x += 40;
photo2.position.z -= 40;





/*---- Other Objects Logic ----------------------------------------*/


{
    const planeSize = 500;
    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, side: THREE.DoubleSide, });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
}





/*---- Player movement --------------------------------------------*/


let moveLeft = false;
let moveRight = false;
let moveForward = false;
let movebackward = false;

var onkeydown = function ( event ) {
    switch ( event.keycode ) {
        case 38: // up
        case 87: // w
            moveforward = true;
            break;
        case 37: // left
        case 65: // a
            moveleft = true; break;
        case 40: // down
        case 83: // s
            movebackward = true;
            break;
        case 39: // right
        case 68: // d
            moveright = true;
            break;
    }
};

var onkeyup = function ( event ) {
    switch( event.keycode ) {
        case 38: // up
        case 87: // w
            moveforward = false;
            break;
        case 37: // left
        case 65: // a
            moveleft = false;
            break;
        case 40: // down
        case 83: // s
            movebackward = false;
            break;
        case 39: // right
        case 68: // d
            moveright = false;
            break;
    }
};

document.addeventlistener( 'keydown', onkeydown, false );
document.addeventlistener( 'keyup', onkeyup, false );

const velocity = new three.vector3();
const direction = new three.vector3();
let speed = 30;





/*---- Game Logic -------------------------------------------------*/


const update = function (delta) {

    if ( controls.isLocked === true ) {

        velocity.x -= velocity.x * delta;
        velocity.z -= velocity.z * delta;

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) velocity.z -= direction.z * speed * delta;
        if ( moveLeft || moveRight ) velocity.x -= direction.x * speed * delta;

        controls.moveRight( - velocity.x * delta );
        controls.moveForward( - velocity.z * delta );
    }

};

photo.rotation.y = -90;
photo2.rotation.y = 90;





/*---- Render Logic -----------------------------------------------*/


const render = function (delta) {

    // photo.rotation.y += 0.01;
    // photo2.rotation.y -= 0.02;

    // composer.render( scene, camera );
    renderer.render( scene, camera );
};





/*---- Main Game Loop ---------------------------------------------*/


let prevTime = performance.now();

const game_loop = function () {

    requestAnimationFrame( game_loop );

    const time = performance.now();
    const delta = ( time - prevTime ) / 1000;

    update(delta);
    render(delta);
    
    prevTime = time;
};

game_loop();
