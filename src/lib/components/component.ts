import {effect} from '../signals';
import {el} from './element.ts';

export const component: Component = <Tag extends keyof HTMLElementTagNameMap>(
    mounter: ComponentOnMount<Tag>,
    name: string
) => {
    let template = mounter(el<Tag>(name));
    let firstMount = true;

    effect(() => {
        if (firstMount) return;
        template = mounter(el<Tag>(name));
    });

    return {
        mount<
            Tag extends keyof HTMLElementTagNameMap,
            T extends Tag|HTMLElement
        >(el: T) {
            let element/*: T2*/;
            if (typeof el === 'string') {
                element = document.querySelector(el);
            } else {
                element = el;
            }

            console.log(template, element)
            // element?.appendChild(template);
        }
    }
};
