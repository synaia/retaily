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
            wordWrap: true,
            width: 46,
        });
        console.log('PrinterBasic instanxce ready.'); 
    }

    print(transaction, copy = false, codepage = "auto") {
        const logo = new Image();
        logo.src = transaction.user.store.logo;
        const salesman = transaction.user.first_name.toUpperCase();
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
            .codepage(codepage)
            .align('center')
            .image(logo, 304, 248, algorithm)
            .line(slogan);
            if (copy) {
                data.newline()
                .invert()
                .text(" C O P I A ")
                .invert()
                .newline();
            }
            data.newline()
            .align('left')
            .line(address)
            .line(`RNC ${company_id}`)
            .line(`${date}  @${salesman}`)
            .newline();
            if (copy) {
                data.bold()
                .height(2)
                .line(client_line)
                .height(1)
                .bold()
            } else {
                data.line(client_line)
            }
            data.line(client_address)
            .newline()
            // .line('-'.repeat(48)) 
            .rule({style: 'single'})
            .align('center')
            .line(sequence)
            .line(sequence_str)
            .align('left')
            // .line('-'.repeat(48)) 
            .rule({style: 'single'})
            .table(
                [
                    { width: 34, marginRight: 2, align: 'left' },
                    { width: 10, align: 'right' }
                ], 
                [
                    [ 'Item', 'Valor' ],
                ]
            )
            // .line('-'.repeat(48));
            .rule({style: 'single'});

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
                        { width: 34, marginRight: 2, align: 'left' },
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
            // .line('-'.repeat(48))
            .rule({style: 'single'})
            .table(
                [
                    { width: 34, marginRight: 2, align: 'left' },
                    { width: 10, align: 'right' }
                ], 
                [
                    [ 'Delivery', (encoder) => encoder.bold().text(delivery).bold() ],
                    [ 'Sub Total', (encoder) => encoder.bold().text(`${T_(sub_total)}`).bold() ],
                    [ 'Total Descuentos', (encoder) => encoder.bold().text(`${T_(total_discount)}`).bold() ],
                    [ 'Total', (encoder) => encoder.bold().text(`${T_(total)}`).bold() ]
                ]
            )
            // .line('-'.repeat(48));
            .rule({style: 'single'});
            transaction.paids.forEach(p => {
                let descPaid = p.type == "CC" ? "Pago tarjeta" : "Pago efectivo"
                const amount = T_(parseFloat(p.amount));
                data.table(
                    [
                        { width: 34, marginRight: 2, align: 'left' },
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
            .line('GRACIAS POR PREFERIRNOS !!')
            .newline()
            .newline()
            .line('Si te es posible, por favor, escanea el QR y nos regalas un comentario :)')
            .newline()
            .newline()
            .qrcode('https://search.google.com/local/writereview?placeid=ChIJQUrnF0yJr44R0x51znS4iNU&source=g.page.m.ia._&laa=nmx-review-solicitation-ia2', 2, 8, 'h')
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