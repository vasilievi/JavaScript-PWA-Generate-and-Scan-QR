var input = document.querySelector("input[type = 'text']");
var inputAdd = document.getElementById("inputAdd");
var inputSave = document.getElementById("inputSave");
var inputLoad = document.getElementById("inputLoad");

var barcodeArr = new Array();

// Barcode generation
inputAdd.addEventListener('click', function () {
  addBarcode(input.value);
});

input.addEventListener("keypress", function (keyPressed) {
  if (keyPressed.which === 13) {
    addBarcode(this.value);
  }
});

function addBarcode(str) {
  barcodeArr.push(str);
  barcodes = document.getElementById("todos");

  if (str.length === 13) {
    canvas = document.createElement("canvas");
    barcodes.appendChild(canvas);

    GoodEan13 = str.substring(0, 12) + getLastEan13Digit(str.substring(0, 12));
    new EAN13(canvas, GoodEan13);
    str = GoodEan13;
  }
  else {
    var qrcode = new QRCode(document.getElementById("todos"));
    qrcode.makeCode(str);
  }

  var para = document.createElement("P",);
  para.innerText = str;
  barcodes.appendChild(para);
}

function getLastEan13Digit(ean) {
  if (!ean || ean.length !== 12) throw new Error('Invalid EAN 13, should have 12 digits');
  const multiply = [1, 3];
  let total = 0;
  ean.split('').forEach((letter, index) => {
    total += parseInt(letter, 10) * multiply[index % 2];
  });
  const base10Superior = Math.ceil(total / 10) * 10;
  return base10Superior - total;
}

// Save and load from localstorage
inputSave.addEventListener('click', function () {
  localStorage.setItem('barcodeArr', JSON.stringify(barcodeArr))
})

inputLoad.addEventListener('click', function () {
  array = JSON.parse(localStorage.getItem('barcodeArr'));
  array.forEach(element => {
    addBarcode(element);
  });
})

let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
scanner.addListener('scan', function (content) {
  console.log(content);
});
Instascan.Camera.getCameras().then(function (cameras) {
  if (cameras.length > 0) {
    scanner.start(cameras[0]);
  } else {
    console.error('No cameras found.');
  }
}).catch(function (e) {
  console.error(e);
});


/* input.addEventListener("keypress", function (keyPressed) {
  if (keyPressed.which === 13) {

    if (this.value.length == 13) {
      barcodes = document.getElementById("todos"); //document.getElementById("barcodes");
      canvas = document.createElement("canvas");
      barcodes.appendChild(canvas);

      //LastEan13Digit = getLastEan13Digit(this.value);
      GoodEan13 = this.value.substring(0, 12) + getLastEan13Digit(this.value.substring(0, 12));
      new EAN13(canvas, GoodEan13);
      this.value = GoodEan13;
    }
    else {
      var qrcode = new QRCode(document.getElementById("todos"));
      qrcode.makeCode(this.value);
    }
  }
});

div.addEventListener('click', function (ev) {
  if (ev.target.tagName === 'CANVAS' ||  ev.target.tagName === 'IMG') {
  ev.target.remove();
}
}, false
); */

/* loadBtn.addEventListener('click', function(){
  document.getElementById('todos').innerHTML = localStorage.getItem('todos');
});

saveBtn.addEventListener('click',function(){
  localStorage.setItem('todos', document.getElementById('todos').innerHTML);
}); */

