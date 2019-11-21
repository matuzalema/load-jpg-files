const inputElement = document.getElementById('files');
const fileData = document.getElementById('file-data');
const imgList = document.getElementById('img-list');
let name;
let size;
let stored;
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
                longitude = toDecimal(EXIF.getTag(this, 'GPSLongitude'));
                latitude = toDecimal(EXIF.getTag(this, 'GPSLatitude'));

                dataImg.longitude = longitude;
                dataImg.latitude = latitude;
            });
        })(file);

        //FileReader
        const reader = new FileReader();
        reader.onload = (function (file) {
            return function(e){
                const dataURL = e.target.result;
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
                imgList.insertAdjacentHTML('afterbegin', '<li class="img-data file-size"> latitudde: ' + stored.latitude + ' </li>');

                imgList.insertAdjacentHTML('afterbegin', '<li class="img-data file-size"> longitude: ' + stored.longitude + ' </li>');

                imgList.insertAdjacentHTML('afterbegin', '<li class="img-data file-size"> size: ' + stored.size + ' bites </li>');
                imgList.insertAdjacentHTML('afterbegin', '<li class="img-data file-size"> name: ' + stored.name + '</li>');
                imgList.insertAdjacentHTML('afterbegin', '<img width=100 src=' + stored.src  + '>');
            };
        })(file);
        reader.readAsDataURL(file);
    }
}
inputElement.addEventListener('change', handleFiles);