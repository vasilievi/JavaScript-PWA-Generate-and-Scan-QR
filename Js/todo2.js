var input = document.querySelector("input[type = 'text']");
var inputAdd = document.getElementById("inputAdd");
var inputSave = document.getElementById("inputSave");
var inputLoad = document.getElementById("inputLoad");
var inputScan = document.getElementById("inputScan");
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


// Scanner
inputScan.addEventListener('click', function () {
  // let selectedDeviceId;
  const codeReader = new ZXing.BrowserMultiFormatReader();
  console.log('ZXing code reader initialized');
  VideoInputDevices = codeReader.listVideoInputDevices();
  selectedDeviceId = VideoInputDevices[VideoInputDevices.length - 1];

  //codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
  codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
    if (result) {
      console.log(result);
      input.value = result.text;
    }
    if (err && !(err instanceof ZXing.NotFoundException)) {
      console.error(err);
      input.value = err;
    }
  })
  console.log(`Started continous decode from camera with id ${selectedDeviceId}`);
})
