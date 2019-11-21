"use strict";

(function apiSupport() {
  if (window.File && window.FileReader && window.FileList && window.Blob && window.EXIF) {
    console.log('success');
  } else {
    alert('error');
  }
})();

var inputElement = document.getElementById('files');
var fileData = document.getElementById('file-data');
var imgList = document.getElementById('img-list');
var name;
var size;
var stored;
var longitude;
var latitudde;
var dataImg = {
  name: name,
  size: size
};
inputElement.addEventListener('change', handleFiles);

function handleFiles(event) {
  event.stopPropagation();
  event.preventDefault();
  var fileList = event.target.files;

  var _loop = function _loop(i) {
    var file = fileList[i]; // GPS

    var toDecimal = function toDecimal(number) {
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
    })(file); //FileReader


    var reader = new FileReader();

    reader.onload = function (file) {
      return function (e) {
        var dataURL = e.target.result;

        if (file.size > 388608) {
          return alert('file shuld have max 1MB');
        } else if (longitude === undefined || latitude === undefined) {
          return alert('File ' + file.name + ' has no GPS');
        }

        dataImg.name = file.name;
        dataImg.size = file.size;
        dataImg.src = dataURL; // localStorage

        sessionStorage.setItem(file.name, JSON.stringify(dataImg));
        var retrivedStorage = sessionStorage.getItem(dataImg.name);
        stored = JSON.parse(retrivedStorage); //HTML

        fileData.insertAdjacentHTML('afterbegin', '<ul id="img-list"></ul>');
        var imgList = document.getElementById('img-list');
        imgList.insertAdjacentHTML('afterbegin', '<li class="img-data file-size"> latitudde: ' + stored.latitude + ' </li>');
        imgList.insertAdjacentHTML('afterbegin', '<li class="img-data file-size"> longitude: ' + stored.longitude + ' </li>');
        imgList.insertAdjacentHTML('afterbegin', '<li class="img-data file-size"> size: ' + stored.size + ' bites </li>');
        imgList.insertAdjacentHTML('afterbegin', '<li class="img-data file-size"> name: ' + stored.name + '</li>');
        imgList.insertAdjacentHTML('afterbegin', '<img width=100 src=' + stored.src + '>');
        imgList.insertAdjacentHTML('afterbegin', '<button type=submit class="remove-btn">remove</button>');
      };
    }(file);

    reader.readAsDataURL(file);
  };

  for (var i = 0; i < fileList.length; i++) {
    _loop(i);
  }
}

inputElement.addEventListener('change', handleFiles);