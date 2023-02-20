var device;

 // Epson printer specific codes
const INIT_PRINT = '\x1B' + '\x40';
const LINE_BREAK = '\x0A';
const CUT_PAPER = '\x1B' + '\x69';
const CARRIAGE_RETURN= '\x0D';
const BIG_CHART = '\x1b' + '\x21' + '\x30';

//  // Paper
//  PAPER_FULL_CUT : Buffer.from([0x1d, 0x56, 0x00]), // Full cut paper
//  PAPER_PART_CUT : Buffer.from([0x1d, 0x56, 0x01]), // Partial cut paper
//
//   HW_INIT         : Buffer.from([0x1b, 0x40]),               // Clear data in buffer and reset modes

const searchbtn = document.getElementById('searchbtn')
searchbtn.addEventListener('click', connectToDevice)

const prepare = document.getElementById('prepare')
prepare.addEventListener('click', prepareDevice)

const printerbtn = document.getElementById('printerbtn')
printerbtn.addEventListener('click', print)

const cutpaperbtn = document.getElementById('cutpaperbtn')
cutpaperbtn.addEventListener('click', cutpaper)

const revokebtn = document.getElementById('revokebtn')
revokebtn.addEventListener('click', voluntaryRevoke)



function setup(device) {
    return device.open()
    .then(() => device.selectConfiguration(1))
    .then(() => device.claimInterface(0))
}

function print() {
    var string = "WILTON BELTRE\n\n";
    var encoder = new TextEncoder();
    var data = encoder.encode(BIG_CHART + string);
    device.transferOut(1, data)
    .catch(error => { console.log('print: ', error); })

}

function cutpaper() {
    const encoder = new TextEncoder();
    const data = encoder.encode(CUT_PAPER);
    device.transferOut(1, data).catch(error => { console.log('CUTPAPER: ', error); })
}


function connectToDevice() {
    if (device == null) {

        navigator.usb.requestDevice({ filters: [{}]})
        .then(selectedDevice => {
            device = selectedDevice;
            console.log('connecting .... : ', device);
            return setup(device);
        })
        .then(() => console.log('Connected!', device))
        .catch(error => { console.log(error); })
    }
}

function prepareDevice() {
    if (device == null) {
        navigator.usb.getDevices().then(devices => {
            if (devices.length > 0) {
                console.log('devices: ', devices)
                device = devices[0];
                return setup(device);
            }
        }).catch(error => {
            console.log('Ummmmm ', error);
        });
    } else {
        console.log('Device already set: ', device)
    }
}

function voluntaryRevoke() {
    console.log('Chau USB printer...', device)
    device.forget();
    device = null;
}


const ESC_INIT = [0x1b, 0x40];
const ESC_BIT_IMAGE = [0x1b, 0x2a]
const DOTS_DENSITY = 24
const LUMINANCE = {
    RED: 0.299,
    GREEN: 0.587,
    BLUE: 0.114
}
const LINE_FEED = 0x0a;

function calculateLuminance(pixel) {
    return LUMINANCE.RED * pixel[0] + LUMINANCE.GREEN * pixel[1] + LUMINANCE.BLUE * pixel[2]
}

function calculateSlice(x, y, image) {
    const threshold = 127;
    let slice = 0;

    for (let bit = 0; bit < 8; bit++) {
        if ((y + bit) >= image.length)
            continue;

        luminance = calculateLuminance(image[y + bit][x])

        slice |= (luminance < threshold ? 1 : 0) << 7 - bit
    }

    return slice;
}

function collectStripe(x, y, image) {
    let slices = [];
    let z = y + DOTS_DENSITY;

    let i = 0
    while (y < z && i < 3){
      slices.push(calculateSlice(x, y, image));

      y += 8
    }

    return slices;
}

function manipulateImage(image) {
    let data = [];
    const imageWidth = image[0].length;

    for (let y = 0; y < image.length; y += DOTS_DENSITY){
        data.push(...ESC_BIT_IMAGE, 33, (0x00ff & imageWidth), (0xff00 & imageWidth) >> 8);

        for (let x = 0; x < imageWidth; x++) {
            data.push(...collectStripe(x, y, image));
        }

        data.push(LINE_FEED);
    }

    return data;
}

function printImage(image) {
    let transformedImage = [];

    transformedImage.push(...ESC_INIT);

    transformedImage.push(...manipulateImage(image));

    return new Uint8Array(transformedImage);
}

let flat_image = [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255];

let gg = printImage(flat_image);

