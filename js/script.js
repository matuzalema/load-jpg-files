var inputElement = document.getElementById('files');
var fileData = document.getElementById('file-data');
var imgList = document.getElementById('img-list');

function handleFiles(event) {
    var fileList = event.target.files;

    for(var i=0; i<fileList.length; i++){
        var file = fileList[i];
        var dataURL;
        var longitude;
        var latitude;

        var toDecimal = function (number) {
            return number[0].numerator + number[1].numerator / (60 * number[1].denominator) + number[2].numerator / (3600 * number[2].denominator);
        };

        (function getExif(image) {
            EXIF.getData(image, function () {
                longitude = EXIF.getTag(this, 'GPSLongitude');
                latitude = EXIF.getTag(this, 'GPSLatitude');
            });
        })(file);
        
        fileData.insertAdjacentHTML('afterbegin', '<ul id="img-list"></ul>');
        var imgList = document.getElementById('img-list');
        
        var reader = new FileReader();
        reader.onload = function(e) {
            dataURL = e.target.result;
            imgList.insertAdjacentHTML('afterbegin', '<li class="img-data file-size"> longitude:' + longitude + ' </li>');
            imgList.insertAdjacentHTML('afterbegin', '<li class="img-data file-size"> latitude:' + latitude + '</li>');
            imgList.insertAdjacentHTML('afterbegin', '<li class="img-data file-size"> size: ' + file.size + ' bites </li>');
            imgList.insertAdjacentHTML('afterbegin', '<li class="img-data file-name"> name: ' + file.name + '</li>');
            imgList.insertAdjacentHTML('afterbegin', '<img width=100 src='+ dataURL+ '>'); 
        };
        reader.readAsDataURL(file);   
    }
}

inputElement.addEventListener('change', handleFiles);


