class Storage {

    static initStorage() { 
        if (localStorage.getItem('photos')) {
            init();
        } else {
            getPhotoList(2);
        }
    }

    static setStorage(data, cb) {
        const storage = localStorage.getItem('photos');
        if (!storage) {
            localStorage.setItem('photos', JSON.stringify(data));
        } else {
            const currentStorage = JSON.parse(storage);
            let newStorage = currentStorage.concat(data);
            localStorage.setItem('photos', JSON.stringify(newStorage));
        }
        cb();
    }

    static getStorage(data) {
        return JSON.parse(localStorage.getItem('photos'));        
    }

}

class Photo {
    constructor(src, author, city) {
        this.src = src;
        this.author = author;
        this.city = city;
        this.isShown = true;
    }
}

class UI {
    constructor() {
    }
    static buildDropdown() {

        const select = document.querySelector('.sort__select');
        const cities = getProperty('width', true);

        cities.forEach( city => {
            let option = createElement('option', '.sort__option', city);
            option.setAttribute('value', city);
            select.appendChild(option);
        });
    }
}

window.addEventListener('DOMContentLoaded', Storage.initStorage);

// Pexels API photos

const makeRequest = (url, cb) => {

    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.setRequestHeader('Authorization', '563492ad6f917000010000017755cef83fa34916a84c38190f83da28');
    request.send();

    request.onload = function() {
        
        const data = JSON.parse(this.response).photos;

        cb(data, init);
    
    }

}

const getPhotoList = (pages) => {
    const apiURL = 'https://api.pexels.com/v1/curated?per_page=15&page=';

    for(let i = 1; i <= pages; i++) {
        makeRequest(apiURL + i, Storage.setStorage);
    }
}



const getProperty = (prop, unique=false) => {
    const photos = Storage.getStorage();
    let property = photos.map( photo => photo[prop]);
    if (unique) {
        return property.filter( (prop, index, arr) => arr.indexOf(prop) === index);
    }
    return property;
}


function createElement(el, className = '', text = '') {
    const element = document.createElement(el);
    element.classList.add(className);
    element.textContent = text;
    return element;
}


function testImages() {
    const photos = Storage.getStorage();
    const images = [];

    photos.forEach( photo => {
        images.push(new Photo(photo.src.medium, photo.photographer, photo.width));
    })
    return images;
}

function displayPhotos(photos) {
    photos.forEach( photo => {
        const gridItem = createElement('div', 'grid__item');
        const author = createElement('span', 'photo-author', photo.author);
        const city = createElement('span', 'photo-city', photo.city);
        const photoImage = createElement('img', 'grid__image');
        photoImage.setAttribute('src', photo.src);
        gridItem.appendChild(photoImage);
        gridItem.appendChild(author);
        gridItem.appendChild(city);
        document.querySelector('.grid').appendChild(gridItem);
    });
}

function init() {
    displayPhotos( testImages() );
    UI.buildDropdown();
}

const searchInput = document.querySelector('.sort__input');
const selectInput = document.querySelector('.sort__select');
searchInput.addEventListener('keyup', sortPhotos);
selectInput.addEventListener('change', sortPhotos);

function remove() {
    const grid = document.querySelector('.grid');
    const childrens = [...grid.children];
    childrens.forEach( item => item.remove());
}

function sortPhotos() {
    let input = searchInput.value.toLowerCase();

    let matches  = testImages().filter( photo => {
        return photo.author.toLowerCase().indexOf(input) >= 0
               && 
               (photo.city == selectInput.value || selectInput.value == 'none');
    });
    remove();
    displayPhotos(matches);

}

let sortInputs = document.querySelector('.sort');
// sortInputs.addEventListener('')