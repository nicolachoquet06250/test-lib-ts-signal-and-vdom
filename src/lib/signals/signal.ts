import {currentListener, effect} from './effect';

const createSignal = (s: Signals.SignalRef): Signals.SignalRef => s as Signals.SignalRef;

export const signal = createSignal(<T>(
    initialValue: T | undefined = undefined
): Signals.Signal<T> => {
    let value = initialValue;

    const subscribers = new Set<() => void>();

    const read: Signals.SignalTuple<T>[0] = () => {
        if (currentListener !== undefined) {
            // before returning, track the current listener
            subscribers.add(currentListener);
        }
        return value;
    };
    const write: Signals.WriteSignal<T>['set'] = (newValue: T) => {
        value = newValue instanceof Function
            ? newValue(read()!)
            : newValue as unknown as T;

        subscribers.forEach(fn => fn());
    };

    const r = read as Signals.Signal<T>;
    r.set = write;
    r.watch = (cb) => {
        effect(() => cb(read()));
    }
    return r;
})
