/* eslint-disable no-dupe-class-members, no-unused-expressions */
function collectFormData(formData) {
    const object = {};
    formData.forEach((value, key) => {
        if (!Reflect.has(object, key)) {
            object[key] = value;
            return;
        }
        if (!Array.isArray(object[key])) {
            object[key] = [object[key]];
        }
        object[key].push(value);
    });
    return object;
}

function getFocusable(dialog) {
    return [...dialog.querySelectorAll('button,[href],select,textarea,input:not([type="hidden"]),[tabindex]:not([tabindex="-1"])')];
}

function getElements(dialog, elementRef){
    return dialog.querySelectorAll(`[data-ref=${elementRef}]`);
}

function getElement(dialog, elementRef){
    return getElements(dialog, elementRef)[0];
}

class Dialog {
    dialogs = [];
    dialogSupported = typeof HTMLDialogElement === 'function';

    constructor(settings = {}) {
        this.#init(settings);
    }

    #init(settings) {
        this.SETTINGS = {
            id: 'dialog',
            locale: {
                accept: 'Ok',
                cancel: 'Cancel'
            },
            ...settings
        };
    }

    #createDialogElement(settings, globalSettings) {
        const defaults = {
            ...globalSettings,
            ...settings
        };

        const dialog = document.createElement('dialog');
        dialog.classList.add(...[
            globalSettings.id, 
            `${globalSettings.id}-${defaults.type ?? 'default'}`, 
            defaults.className ?? null
        ].filter((token) => token !== null));
        
        if (this.dialogs.find((dialog) => dialog.id === defaults.id)) {
            defaults.id = `${defaults.id}-${this.dialogs.length}`;
        }

        dialog.setAttribute('id', defaults.id);
        dialog.setAttribute('role', 'dialog');
        dialog.dataset.component = this.dialogSupported ? 'dialog' : 'no-dialog';

        const acceptBtn = `<button class="btn btn-primary" type="submit" data-ref="accept" value="accept">${defaults.locale.accept}</button>`;
        const cancelBtn = `<button class="btn btn-secondary" type="submit" value="cancel" data-ref="cancel">${defaults.locale.cancel}</button>`;
        const closeBtn = '<div class="small"><button type="submit" class="btn-close small" aria-label="Close" value="cancel" data-ref="cancel"></button></div>';
        
        dialog.innerHTML = `
            <form method="dialog" data-ref="form">
                <header data-ref="header">
                    <div data-ref="message"></div>
                    ${defaults.type === 'prompt' ? closeBtn : ''}
                </header>
                <fieldset data-ref="fieldset" role="document">
                    <div data-ref="template"></div>
                </fieldset>
                <footer data-ref="actions">
                    <menu>
                        ${acceptBtn}
                        ${defaults.type === 'confirm' || defaults.type === 'prompt' ? cancelBtn : ''}
                    </menu>
                </footer>
            </form>
        `;

        this.dialogs.push(dialog);
        document.body.appendChild(dialog);

        return dialog;
    }

    #cleanDialog(dialog) {
        this.dialogs = this.dialogs.filter((item) => item !== dialog);
        dialog.remove();
    }

    #setupEvents(dialog, blockUI) {
        dialog.addEventListener('click', (event) => {
            if (!blockUI && event.target.nodeName === 'DIALOG') {
                dialog.dispatchEvent(new Event('cancel'));
                dialog.close();
            }
        }, { once: true });
        
        dialog.addEventListener('close', (event) => {
            dialog.dispatchEvent(new Event('cancel'));
            this.#cleanDialog(event.target);
        }, { once: true });

        dialog.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                event.stopPropagation();
                dialog.dispatchEvent(new Event('cancel'));
            }
        }, { once: true });

        dialog.addEventListener('cancel', (event) => {
            if (blockUI) {
                event.preventDefault();
            }
        });

        getElements(dialog, 'cancel').forEach((cancelBtn) => cancelBtn.addEventListener('click', () => {
            dialog.dispatchEvent(new Event('cancel'));
        }, { once: true }));
    }

    #waitForUser(dialog, hasForm, blockUI) {
        return new Promise(resolve => {
            dialog.addEventListener('close', (e) => {
                // dialog.returnValue
                resolve(false);
            }, { once: true });
            
            getElements(dialog, 'accept').forEach((acceptBtn) => acceptBtn.addEventListener('click', () => {
                const value = hasForm ? collectFormData(new FormData(getElement(dialog, 'form'))) : true;
                resolve(value);
            }, { once: true }));
        });
    }

    open(settings = {}) {
        const dialog = this.#createDialogElement(settings, this.SETTINGS);
        const blockUI = settings.blockUI ?? true;

        const dialogMessage = getElement(dialog, 'message');
        if (settings.message) {
            dialogMessage.innerHTML = settings.message;
        } else if (settings.actions === false || settings.actions === null || settings.actions === '') {
            dialogMessage.remove();
        }

        if (settings.template){
            getElement(dialog, 'template').innerHTML = settings.template;
        }

        const dialogActions = getElement(dialog, 'actions');
        if (settings.actions) {
            dialogActions.innerHTML = settings.actions;
        } else if (settings.actions === false || settings.actions === null || settings.actions === '') {
            dialogActions.remove();
        }

        this.#setupEvents(dialog, blockUI);

        dialog.showModal();

        const focusable = getFocusable(dialog);
        const inputElements = [].slice.call(getElement(dialog, 'fieldset').elements).find((elm) => elm.select);

        if (inputElements) {
            inputElements?.focus();
            inputElements?.select();
        } else {
            focusable[0]?.focus();
        }


        return this.#waitForUser(dialog, inputElements, blockUI);
    }

    alert(message, config = {}) {
        return this.open({
            type: 'alert',
            message,
            blockUI: false,
            ...config
        });
    }

    confirm(message, config = {}){
        return this.open({
            type: 'confirm',
            message,
            ...config
        });
    }

    prompt(message, defaultValue, config = {}) {
        const template = `
            <label aria-label="${message}" class="w-100">
                <input class="w-100 form-control" type="text" name="prompt" value="${defaultValue ?? ''}" placeholder="${config.placeholder ?? ''}">
            </label>`;

        return this.open({
            type: 'prompt',
            message,
            template,
            ...config
        });
    }

    spinner(message, config = {}) {
        const template = `
            <div class="text-center">
                <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>
                <div>${message ?? ''}</div>
            </div>`;

        return this.open({
            type: 'spinner',
            id: 'spinner',
            message: null,
            actions: null,
            template,
            ...config
        });
    }

    closeAll() {
        this.dialogs.forEach((dialog) => {
            dialog.close('close');
        });
    }

    close(id) {
        this.dialogs.find((dialog) => dialog.id === id)?.close('close');
    }
}

export class CustomDialogs extends Dialog {
    constructor(settings = {}) {
        super(settings)
    }
    
    error(message, config = {}) {
        return this.open({
            type: 'error',
            message,
            ...config
        });
    }
}

// const dialog = new CustomDialogs();

