import {  getStorage, ref, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';

// Firebase storage paths for your images
const imagePaths = {
    characters: {
        dog: "images/characters/dog.png",
        hero: "images/characters/hero.png",
        lowerSrc: "images/characters/lower-src.png",
    },
    maps: {
        CPP: {
            BG_test: "images/maps/CPP/BG_test.png",
            kitchen: "images/maps/CPP/kitchen.png",
            landProto: "images/maps/CPP/landProto.png"
        },
        bg: "images/maps/bg.png",
        topBar_bg: "images/maps/topBar_bg.png"
    }
};
