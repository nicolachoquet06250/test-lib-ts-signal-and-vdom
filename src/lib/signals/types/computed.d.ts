declare namespace Computed {
    type Signal = Signals.Signal
    type ReadSignal = Signals.ReadSignal

    type CBParams<DEPS extends Signal<any>[]> = {
        [K in keyof DEPS]: DEPS[K] extends Signals.Signal<infer V> ? V : undefined
    };

    type Computed = <
        T,
        DEPS extends Signal<any>[] = Signal<any>[],
        CbParams extends CBParams<DEPS> = CBParams<DEPS>
    >(cb: (...arr: CbParams) => T, ...deps: DEPS) => ReadSignal<T>
}