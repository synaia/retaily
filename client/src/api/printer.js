import ThermalPrinterEncoder from "thermal-printer-encoder";
import { T_ } from "../util/Utils";

export class PrinterBasic {
    device;
    thermalEncoder;
    BIG_CHART = '\x1b' + '\x21' + '\x30';
    CUT_PAPER = '\x1B' + '\x69';

    constructor() { 
        this.thermalEncoder = new ThermalPrinterEncoder({
            language: 'esc-pos',
            wordWrap: true
        });
        console.log('PrinterBasic instanxce ready.'); 
    }

    print(transaction) {
        // let string = "WILTON BELTRE\n\n";
        // let encoder = new TextEncoder();
        // let data = encoder.encode(string);
        // const data = this.thermalEncoder.initialize()
        // .underline(true)
        // .text('WILTON BELTRE')
        // .underline(false)
        // .newline()
        // .bold()
        // .text('BOLD TEXT')
        // .newline()
        // .align('right')
        // .line('RIGHT $5,689.00')
        // .align('center')
        // .line('THANK YOU!!')
        // .align('left')
        // .size('small')
        // .line('A line of small text')
        // .size('normal')
        // .line('A line of normal text')
        // .width(2)
        // .line('A line of text twice as wide')
        // .width(3)
        // .line('A line of text three times as wide')
        // .width(1)
        // .line('A line of text with normal width')
        // .height(2)
        // .line('A line of text twice as high')
        // .height(3)
        // .line('A line of text three times as high')
        // .height(1)
        // .line('A line of text with normal height')
        // .encode();

        // const data = this.thermalEncoder.initialize()
        // .table(
        //     [
        //         { width: 36, marginRight: 2, align: 'left' },
        //         { width: 10, align: 'right' }
        //     ], 
        //     [
        //         [ 'Item 1', (encoder) => encoder.height(3).text('$ 250,75').height(1) ],
        //         [ 'Item 2', '15,00' ],
        //         [ 'Item 3', '9,95' ],
        //         [ 'Item 4', '4,75' ],
        //         [ 'Item 5', '211,05' ],
        //         [ '', '='.repeat(10) ],
        //         [ 'Total', (encoder) => encoder.bold().text('$ 250,75').bold() ],
        //     ]
        // )
        // .encode()

        // const data = this.thermalEncoder.initialize()
        // .box(
        //     { width: 30, align: 'right', style: 'double', marginLeft: 10 }, 
        //     'The quick brown fox jumps over the lazy dog'
        // )
        // .encode()

        // const data = this.thermalEncoder.initialize()
        // .rule({ style: 'single' }) 
        // .encode()

        // const data = this.thermalEncoder.initialize()
        // .qrcode('https://www.instagram.com/evofitdr', 2, 8, 'h')
        // .encode()


        const logo = new Image();
        logo.src = transaction.user.store.logo;
        const slogan = transaction.user.store.slogan;
        const address = transaction.user.store.address;
        const company_id = transaction.user.store.company_id;
        const date = `${(new Date()).toISOString().substring(0, 10)} ${(new Date()).toISOString().substring(11, 19)}`;
        const client_line = `${transaction.client.name} ${transaction.client.celphone}`.toUpperCase();
        const client_address = transaction.client.address;
        const sequence = transaction.sequence.name;
        const sequence_str = transaction.sequence_str;

        const total_discount = transaction.sale_detail.discount_total;
        const sub_total = transaction.sale_detail.sub_total;
        const total = transaction.sale_detail.gran_total;
        const delivery = transaction.sale_detail.delivery;

        logo.onload = () => {
            const algorithm = 'threshold';
            const data = this.thermalEncoder.initialize()
            .codepage('cp852')
            .align('center')
            .image(logo, 304, 248, algorithm)
            .line(slogan)
            .newline()
            .align('left')
            .line(address)
            .line(`RNC ${company_id}`)
            .line(date)
            .newline()
            .line(client_line)
            .line(client_address)
            .newline()
            .line('-'.repeat(48)) 
            .align('center')
            .line(sequence)
            .line(sequence_str)
            .align('left')
            .line('-'.repeat(48)) 
            .table(
                [
                    { width: 36, marginRight: 2, align: 'left' },
                    { width: 10, align: 'right' }
                ], 
                [
                    [ 'Item', 'Valor' ],
                ]
            )
            .line('-'.repeat(48));

            transaction.products.forEach(p => {
                let discount;
                try {
                    if (p.discount)
                        discount = `-${T_(p.discount)}`;
                    else 
                        discount = '';
                
                } catch (err) {
                    discount = '';
                }

                const price_for_sale = p.price_for_sale * p.inventory[0].quantity_for_sale;
                data.table(
                    [
                        { width: 36, marginRight: 2, align: 'left' },
                        { width: 10, align: 'right' }
                    ], 
                    [
                        [ p.name, (encoder) => encoder.bold().text(`${T_(price_for_sale)}`).bold() ],
                        [`${p.inventory[0].quantity_for_sale} x ${T_(p.price)}`, discount]
                    ]
                );
                data.newline();
            });
            data.newline()
            .newline()
            .align('center')
            .line('Resumen Facturacion')
            .align('left')
            .line('-'.repeat(48))
            .table(
                [
                    { width: 36, marginRight: 2, align: 'left' },
                    { width: 10, align: 'right' }
                ], 
                [
                    [ 'Delivery', (encoder) => encoder.bold().text(delivery).bold() ],
                    [ 'Sub Total', (encoder) => encoder.bold().text(`${T_(sub_total)}`).bold() ],
                    [ 'Total Descuentos', (encoder) => encoder.bold().text(`${T_(total_discount)}`).bold() ],
                    [ 'Total', (encoder) => encoder.bold().text(`${T_(total)}`).bold() ]
                ]
            )
            .line('-'.repeat(48));
            transaction.paids.forEach(p => {
                let descPaid = p.type == "CC" ? "Pago tarjeta" : "Pago efectivo"
                const amount = T_(parseFloat(p.amount));
                data.table(
                    [
                        { width: 36, marginRight: 2, align: 'left' },
                        { width: 10, align: 'right' }
                    ], 
                    [
                        [ descPaid, (encoder) => encoder.bold().text(amount).bold() ]
                    ]
                );
            });
            data.newline()
            .newline()
            .align('center')
            .line('Gracias por preferirnos!')
            .newline()
            .newline()
            .qrcode('https://www.instagram.com/evofitdr', 2, 8, 'h')
            .newline()
            .newline()
            .newline()
            .cut('partial')

            this.device.transferOut(1, data.encode())
            .catch(error => { console.log('print: ', error); })
        }
    }

    #setup(device) {
        if (!device.opened) {
            return device.open()
            .then(() => device.selectConfiguration(1))
            .then(() => device.claimInterface(0))
        }
    }

    cutpaper() {
        const encoder = new TextEncoder();
        const data = encoder.encode(this.CUT_PAPER);
        this.device.transferOut(1, data).catch(error => { console.log('CUTPAPER: ', error); })
    }

    async connectToDevice() {
        console.log('try connectToDevice.');
        if (this.device == null) {
            await navigator.usb.requestDevice({ filters: [{}]})
            .then(selectedDevice => {
                this.device = selectedDevice;
                console.log('connecting .... : ', this.device);
                return this.#setup(this.device);
            })
            .then(() => console.log('Connected!', this.device))
            .catch(error => { console.log(error); })
        }
    }

    async prepareDevice() {
        if (this.device == null) {
            let found = false;
            await navigator.usb.getDevices().then(devices => {
                    if (devices.length > 0) {
                        found = true;
                        // console.log('prepared devices: ', devices)
                        this.device = devices[0];
                        if (!this.device.opened) {
                            return this.#setup(this.device);
                        }
                    }
                }).catch(error => {
                    console.log('Ummmmm ', error);
                });
            if (!found) {
                //TODO: do it manually by user.
                // await this.connectToDevice();
            }
        } else {
            console.log('Device already set: ', this.device)
        }
    }

    voluntaryRevoke() {
        console.log('Chau USB printer...', this.device)
        this.device.forget();
        this.device = null;
    }

    async troubleshooting() {
        this.device = null;
        await this.prepareDevice();
        // console.log(`RUNNNING: ${this.running()} STATUS: ${this.device}`)
    }

    running() {
        return (this.device != null) ? true : false;
    }

    restart() {
        this.voluntaryRevoke();
        this.prepareDevice();
    }

}