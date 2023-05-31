export const abortController = (() => {
    let controller = new AbortController();
    let signal = controller.signal;

    const abortPendingRequest = () => {
        controller.abort();
        controller = new AbortController();
        signal = controller.signal;
        // TODO: for multiple cancell, maybe dont use new objets.
    }

    const getSignal = () => signal;

    return {
        abortPendingRequest,
        getSignal
    }
});
