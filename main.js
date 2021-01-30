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





/*---- Scenes -----------------------------------------------------*/

var current_scene;

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x0 );
scene.fog = new THREE.Fog( 0x0, 0, 200 );

current_scene = scene;


// Testing skybox scene
const photo1_scene = new THREE.Scene();
var skybox_geometry = new THREE.BoxGeometry(200, 200, 200);

function createPathStrings(filename) {

    const basePath = "./static/skybox/";
    const baseFilename = basePath + filename;
    const fileType = ".png";
    const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
    const pathStings = sides.map(side => {
        return baseFilename + "_" + side + fileType;
    });

    console.log(pathStings)
    return pathStings;
}

function createMaterialArray(filename) {
    const skyboxImagepaths = createPathStrings(filename);
    const materialArray = skyboxImagepaths.map(image => {
        let texture = new THREE.TextureLoader().load(image);

        return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide }); // <---
    });

    console.log(materialArray)
    return materialArray;
}

const skybox_materialarray = createMaterialArray("teste");
const skybox = new THREE.Mesh(skybox_geometry, skybox_materialarray);
photo1_scene.add(skybox);

var ambl = new THREE.AmbientLight(0xffffff, 0.3);
photo1_scene.add(ambl);



/*---- Camera and Controls ----------------------------------------*/


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
photo.photo_scene = photo1_scene;

var photo2 = create_photo();
photo2.position.x += 40;
photo2.position.z -= 40;





/*---- Other Objects Logic ----------------------------------------*/


// Floor
{
    const planeSize = 500;
    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, side: THREE.DoubleSide, });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
}





/*---- Player Movement --------------------------------------------*/


let moveLeft = false;
let moveRight = false;
let moveForward = false;
let moveBackward = false;

var onkeydown = function ( event ) {
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
        case 67:
            console.log("CCC");
            change_scene(photo);
            break;
    }
};

var onkeyup = function ( event ) {
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

document.addEventListener( 'keydown', onkeydown, false );
document.addEventListener( 'keyup', onkeyup, false );

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let speed = 30;





/*---- Game Logic -------------------------------------------------*/

const change_scene = function (photo) {

    current_scene = photo.photo_scene;
    current_scene.add(controls.getObject());

}


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
    renderer.render( current_scene, camera );
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
