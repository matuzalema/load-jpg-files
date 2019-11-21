(function apiSupport() {
    if (window.File && window.FileReader && window.FileList && window.Blob && window.EXIF) {
        console.log('success');
    } else {
        alert('error');
    }
})();

const inputElement = document.getElementById('files');
const fileData = document.getElementById('file-data');
const imgList = document.getElementById('img-list');
let name;
let size;
let stored;
let longitude;
let latitudde;
const dataImg = {
    name: name,
    size: size
}

inputElement.addEventListener('change', handleFiles);

function handleFiles(event) {
    event.stopPropagation();
    event.preventDefault();
    const fileList = event.target.files;

    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];

        // GPS
        const toDecimal = function (number) {
            return number[0].numerator + number[1].numerator / (60 * number[1].denominator) + number[2].numerator / (3600 * number[2].denominator);
        };

    (function getExif(image) {
            EXIF.getData(image, function () {
                longitude = EXIF.getTag(this, 'GPSLongitude');
                latitude = EXIF.getTag(this, 'GPSLatitude');

                longitude = toDecimal(longitude);
                latitude = toDecimal(latitude);
                dataImg.longitude = longitude;
                dataImg.latitude = latitude;
            });
        })(file);

        //FileReader
        const reader = new FileReader();
        reader.onload = (function (file) {
            return function(e){
                const dataURL = e.target.result;
                if (file.size > 388608 ) {
                    return alert('file shuld have max 1MB')
                } else  if( longitude===undefined || latitude===undefined){
                    return alert('File ' + file.name + ' has no GPS');
                }

                dataImg.name = file.name;
                dataImg.size = file.size;
                dataImg.src = dataURL;
                
                // localStorage
                sessionStorage.setItem(file.name, JSON.stringify(dataImg));
                const retrivedStorage = sessionStorage.getItem(dataImg.name);
                stored = JSON.parse(retrivedStorage);
                
                //HTML
                fileData.insertAdjacentHTML('afterbegin', '<ul id="img-list"></ul>');

                const imgList = document.getElementById('img-list');
                imgList.insertAdjacentHTML('afterbegin', '<button type=submit class="remove-btn">remove</button>');
                imgList.insertAdjacentHTML('afterbegin', '<li class="img-data file-size"> latitudde: ' + stored.latitude + ' </li>');
                imgList.insertAdjacentHTML('afterbegin', '<li class="img-data file-size"> longitude: ' + stored.longitude + ' </li>');
                imgList.insertAdjacentHTML('afterbegin', '<li class="img-data file-size"> size: ' + stored.size + ' bites </li>');
                imgList.insertAdjacentHTML('afterbegin', '<li class="img-data file-size"> name: ' + stored.name + '</li>');
                imgList.insertAdjacentHTML('afterbegin', '<img width=100 src=' + stored.src  + '>');

                const removeButtons = document.querySelectorAll('.remove-btn');
                for(let i=0; i<removeButtons.length; i++){
                    removeButtons[i].addEventListener('click', function(e){
                        e.preventDefault();
                        this.parentNode.remove();
                        return;      
                    });
                    return;
                }
            };
        })(file);
        reader.readAsDataURL(file);
    }
}
inputElement.addEventListener('change', handleFiles);