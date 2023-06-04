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

//const getdevices = document.getElementById('getdevices')
//getdevices.addEventListener('click', getDevicesX)



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

//function getDevicesX() {
//  const x =  navigator.usb.getDevices();
//  console.log(x)
//  x.forEach((z) => {
//    console.log(`Name: ${z.productName}, Serial: ${z.serialNumber}`);
//  });
//}

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


