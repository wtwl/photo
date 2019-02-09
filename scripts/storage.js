
// Pexels API photos


const makeRequest = (url, cb) => {

    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.setRequestHeader('Authorization', '563492ad6f917000010000017755cef83fa34916a84c38190f83da28');
    request.send();

    request.onload = function() {
        
        const data = JSON.parse(this.response).photos;

        cb(data);
    
    }

}

const getPhotoList = (pages) => {
    const apiURL = 'https://api.pexels.com/v1/curated?per_page=15&page=';

    for(let i = 1; i <= pages; i++) {
        makeRequest(apiURL + i, Storage.setStorage);
    }
}
 
export default class Storage {

    static initStorage() { 
        if (localStorage.getItem('photos')) {
            return;
        } else {
            getPhotoList(4);
        }
    }

    static setStorage(data) {
        const storage = localStorage.getItem('photos');
        if (!storage) {
            localStorage.setItem('photos', JSON.stringify(data));
        } else {
            const currentStorage = JSON.parse(storage);
            let newStorage = currentStorage.concat(data);
            localStorage.setItem('photos', JSON.stringify(newStorage));
        }
    }

    static getStorage(data) {
        return JSON.parse(localStorage.getItem('photos'));        
    }

}
