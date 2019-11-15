(function apiSupport(){
    if(window.File && window.FileReader && window.FileList && window.Blob) {
        console.log('success');
    } else {
        alert('error');
    }
})();

function getExif(image, gps, dataGeographical) {
    EXIF.getData(image, function() {
        var data = EXIF.getTag(this, gps);
        li = document.createElement('li');
        li.innerHTML = (dataGeographical + toDecimal(data));
        document.querySelector('.list').insertAdjacentElement('afterbegin', li);
    });
}

var toDecimal = function (number) {
    return number[0].numerator + number[1].numerator / (60 * number[1].denominator) + number[2].numerator / (3600 * number[2].denominator);
};

function handleFileSelect(event) {
    var files = event.target.files; 
    var output = [];
    
    for (var i = 0; i<files.length; i++) {
        var file = files[i];
        var reader= new FileReader();
        var imgSrc;
        var span;

        // add to localStorage
        var name = event.target.files[i].name;
        reader.addEventListener("load", function () {
            if (this.result && localStorage) {
                window.localStorage.clear();
                window.localStorage.setItem(name, this.result);
            } else {
                console('err');
            }
        });
        reader.readAsDataURL(event.target.files[i]);
    
        reader.onload = (function (theFile) {
            return function(e) {
                imgSrc = e.target.result;
                li = document.createElement('li');
                li.innerHTML = ['<img class="thumb" src="', imgSrc,
                '" height="100"/>'].join('');
                document.querySelector('.list').insertAdjacentElement('afterbegin', li);

                getExif(file, 'GPSLongitude', 'longitude: ');
                getExif(file, 'GPSLatitude', 'latitude: ');
            }
    })(file);
        
        output.push(
            '<li> <strong> file name: </strong>' + file.name + 
            '<li><strong>size:</strong>' + file.size + ' bytes <br />' + '</li>'
        );
    }

    document.getElementById('list').innerHTML = '<ul class="list">' + output.join("") + '</ul>';
}

document.getElementById('files').addEventListener('change', handleFileSelect);


