declare namespace Signals {
    type Signal<T> = ReadSignal<T> & WriteSignal<T>;

    type SignalGetter<T> = () => T|undefined

    type ReadSignal<T> = {
        (): (SignalGetter<T> extends () => infer T ? T : undefined),
        watch<
            T1 = null,
            T2 = (T1 extends null ? (T | undefined) : T1),
            CB extends ((v: T2|T|undefined) => void) = ((v: T2) => void)
        >(cb: CB): void,
    };

    type WriteSignal<T, T2 = T|((v: T) => T)> = {
        set(v: T2): void
    };

    type ReadOnlySignal<T> = ReadSignal<T> & {
        readonly: true,
        SCOPE?: boolean,
        0?: boolean
    };

    type SignalTuple<T, T2 = T|((p: T) => T)> = [
        getter: SignalGetter<T>,
        setter: WriteSignal<T, T2>
    ]

    type SignalRef = <T>(initialValue: T | undefined = undefined) => Signals.Signal<T>
}