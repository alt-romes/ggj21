import * as THREE from './node_modules/three/build/three.module.js'
import {EffectComposer} from './node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from './node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import {BloomPass} from './node_modules/three/examples/jsm/postprocessing/BloomPass.js';
import {FilmPass} from './node_modules/three/examples/jsm/postprocessing/FilmPass.js';

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

// Set up renderer effects
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new BloomPass(
    1,    // strength
    25,   // kernel size
    4,    // sigma ?
    256,  // blur render target resolution
);
composer.addPass(bloomPass);

const filmPass = new FilmPass(
    0.35,   // noise intensity
    0.025,  // scanline intensity
    648,    // scanline count
    false,  // grayscale
);
filmPass.renderToScreen = true;
composer.addPass(filmPass);

const photo_geometry = new THREE.PlaneGeometry( 1, 1, 1 );

// TODO: photo for texture as parameter
const create_photo = function () {

    const map = new THREE.TextureLoader().load( 'phot.png' );
    const photo_material = new THREE.MeshBasicMaterial( {color: 0x000, side: THREE.DoubleSide, map: map} );

    const plane = new THREE.Mesh( photo_geometry, photo_material );
    scene.add( plane );

    return plane;
}

var photo = create_photo();
photo.position.x -= 2;
photo.position.y += 2;

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

    composer.render( scene, camera );
};

// Main loop game
const game_loop = function () {

    requestAnimationFrame( game_loop );

    update();
    render();
};

game_loop();
