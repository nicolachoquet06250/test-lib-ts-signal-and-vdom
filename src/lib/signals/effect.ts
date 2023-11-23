export let currentListener: (() => void)|undefined = undefined;

export function effect(callback: () => void) {
    currentListener = callback;
    callback();
    currentListener = undefined;
}