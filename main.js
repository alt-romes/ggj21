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
scene.fog = new THREE.Fog( 0x0, 0, 300 );

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

    return pathStings;
}

function createMaterialArray(filename) {
    const skyboxImagepaths = createPathStrings(filename);
    const materialArray = skyboxImagepaths.map(image => {
        let texture = new THREE.TextureLoader().load(image);

        return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide }); // <---
    });

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

// Create raycaster: define its properties and dependencies
const raycaster = new THREE.Raycaster();
//TODO: TUNE THIS VALUE
raycaster.far = 25;
const mouse = new THREE.Vector2();





/*---- HTML Control -----------------------------------------------*/


document.getElementById("menu").addEventListener( 'click', function () { 
    controls.lock();
    mouse.x = 0;
    mouse.y = 0;
});

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
const create_photo = function (path, path2, path3, dx, dy, dz) {

    const map = new THREE.TextureLoader().load( path );
    map.minFilter = THREE.LinearFilter;
    const photo_material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, map: map} );

    const plane = new THREE.Mesh( photo_geometry, photo_material );
    plane.position.y += 13;
    scene.add( plane );
    
    const intensity = 10;
    const width = 12;
    const height = 4;
    const light = new THREE.RectAreaLight(0xFFFFFF, intensity, width, height);
    plane.add(light);

    plane.position.x += dx;
    plane.position.y += dy;
    plane.position.z += dz;

    plane.states = [path, path2, path3]
    plane.state = 0;

    return plane;
}

const create_center_photo = function (p1, p2, p3, p4, p5, dx, dy, dz) {

    const big_photo_geometry = new THREE.PlaneGeometry( 45, 45, 45 );

    const map = new THREE.TextureLoader().load( p1 );
    map.minFilter = THREE.LinearFilter;
    const photo_material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, map: map} );

    const plane = new THREE.Mesh( big_photo_geometry, photo_material );
    plane.position.y += 23;
    scene.add( plane );
    
    const intensity = 10;
    const width = 12;
    const height = 4;
    const light = new THREE.RectAreaLight(0xFFFFFF, intensity, width, height);
    plane.add(light);

    plane.states = [p1, p2, p3, p4, p5]
    plane.state = 0;

    plane.position.x += dx;
    plane.position.y += dy;
    plane.position.z += dz;

    plane.rotation.x = Math.PI;

    plane.center_photo = true;

    return plane;
    
}

// Create the photos
var photo = create_photo("phot.png", "phot.png", "phot.png", -40, 0, 0);
photo.photo_scene = photo1_scene;

var photo2 = create_photo("paintings/Hotel_BW.png", "paintings/Hotel_RED.png", "paintings/Hotel_A.png", 40, 0, -40);
var photo3 = create_photo("paintings/Hotel_BW.png", "paintings/Hotel_RED.png", "paintings/Hotel_A.png", 40, 0, -40);
var photo4 = create_photo("paintings/Hotel_BW.png", "paintings/Hotel_RED.png", "paintings/Hotel_A.png", 40, 0, -40);
var photo5 = create_photo("paintings/Hotel_BW.png", "paintings/Hotel_RED.png", "paintings/Hotel_A.png", 40, 0, -40);

var center_photo = create_center_photo("static/skybox/teste_bk.png", "static/skybox/teste_dn.png", "static/skybox/teste_up.png", "static/skybox/teste_rt.png", "static/skybox/teste_lf.png", 0, 0, 0);
var photos = [photo, photo2]



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
        case 69: // e
            interact_object();
            break;
        case 67: // c
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





/*---- Interact Logic ---------------------------------------------*/


var paintings_interacted = 0;

const interact_object = function () {

    //TODO: REVIEW THIS
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(scene, true); ///scene.children doesnt work
    console.log('Intersecting objects', intersects) 

    if (intersects.length > 0) {
        let obj = intersects[0].object;

        console.log(intersects[0].object)

        let did_interact = false;

        if (obj.states != undefined && obj.interacted == undefined && !obj.center_photo) {

            paintings_interacted++;
            obj.interacted = true;

            did_interact = true;

        }

        for (let p of photos) {

            let state = Math.trunc(paintings_interacted / 2);

            if (state != p.state) {

                p.material.map = new THREE.TextureLoader().load( p.states[state % 3] );
                p.material.map.minFilter = THREE.LinearFilter;
                p.state = state;
            }

            switch (state) {
                case 0:
                    p.children[0].color = new THREE.Color( 0xffffff )
                    break;
                case 1:
                    p.children[0].color = new THREE.Color( 0xff0000 )
                    break;
                case 2:
                    // Maybe light up middle
                    p.children[0].color = new THREE.Color( 0xfff000 )
                    break;
            }
        }

        if (did_interact && paintings_interacted < 5) {

            center_photo.material.map = new THREE.TextureLoader().load( center_photo.states[paintings_interacted] );
            center_photo.material.map.minFilter = THREE.LinearFilter;
            center_photo.state++;

        }

    }

}





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
