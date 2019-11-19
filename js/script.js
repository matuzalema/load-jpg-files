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

        //GPS
        var toDecimal = function (number) {
            return number[0].numerator + number[1].numerator / (60 * number[1].denominator) + number[2].numerator / (3600 * number[2].denominator);
        };

        (function getExif(image) {
            EXIF.getData(image, function () {
                longitude = toDecimal(EXIF.getTag(this, 'GPSLongitude'));
                latitude = toDecimal(EXIF.getTag(this, 'GPSLatitude'));
            });
        })(file);
        
        
        var reader = new FileReader();
        reader.onload = function(e) {

            //check if file is smaller then 1MB and chceck if file has got GPS
            if (file.size > 8388608 ){
                return alert('To large file. The file cannot be greater then 1MB.');
            } else if (longitude === undefined || latitude === undefined){
                return alert("This file hasnt got a GPS");
            }

            //Add file list
            dataURL = e.target.result;

            fileData.insertAdjacentHTML('afterbegin', '<ul id="img-list"></ul>');
            var imgList = document.getElementById('img-list');
            
            imgList.insertAdjacentHTML('afterbegin', '<button class="remove-btn">Remove</button>');
            imgList.insertAdjacentHTML('afterbegin', '<li class="img-data file-size"> longitude:' + longitude + ' </li>');
            imgList.insertAdjacentHTML('afterbegin', '<li class="img-data file-size"> latitude:' + latitude + '</li>');
            imgList.insertAdjacentHTML('afterbegin', '<li class="img-data file-size"> size: ' + file.size + ' bites </li>');
            imgList.insertAdjacentHTML('afterbegin', '<li class="img-data file-name"> name: ' + file.name + '</li>');
            imgList.insertAdjacentHTML('afterbegin', '<img width=100 src=' + dataURL + '>');
            
            //button remove
            var removeBtn = document.querySelectorAll('.remove-btn');
            for(var i=0; i<removeBtn.length; i++){
                removeBtn[i].addEventListener('click', function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    this.parentNode.remove();
                })
            }

            //localStorage
            const dataImg = {
                latitude: latitude,
                longitude: longitude,
                size: file.size,
                src: dataURL
            };

            localStorage.clear();
            sessionStorage.setItem(file.name, JSON.stringify(dataImg));
        };
        reader.readAsDataURL(file);  
    }
}

inputElement.addEventListener('change', handleFiles);


