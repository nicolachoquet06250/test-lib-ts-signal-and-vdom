import {signal} from './signal';
import {effect} from './effect';

export const computed = <
    T,
    DEPS extends Signals.Signal<any>[] = Signals.Signal<any>[],
    CbParams extends Computed.CBParams<DEPS> = Computed.CBParams<DEPS>
>(cb: (...arr: CbParams) => T, ...deps: DEPS): Signals.ReadSignal<T> => {
    const computedSignal = signal<T>();

    let init: T
    for (const _ in deps) {
        init = cb(...deps.map(s => s()) as CbParams)
    }
    computedSignal.set(init!)

    effect(() => {
        let newValue: T
        for (const _ in deps) {
            newValue = cb(...deps.map(s => s()) as CbParams)
        }
        if (computedSignal() !== newValue!) {
            computedSignal.set(newValue!)
        }
    })

    return computedSignal as Signals.ReadSignal<T>
}
