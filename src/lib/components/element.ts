import { h } from "snabbdom";
import ReadSignal = Signals.ReadSignal;
import Signal = Signals.Signal;

const createElementGenerator = <
    Tag extends keyof HTMLElementTagNameMap = 'template'
>(el: <
        Tpl extends ReadonlyArray<
            `<${Tag}>${string}`|
            `<${Tag} ${string}>${string}`|
            string
        >,
        Args extends any[]
    >(tpl: Tpl, ...args: Args) => HTMLElementTagNameMap[Tag]|HTMLElement
) => el as Element.Element<Tag>

const startHtmlTagToCompleteCssSelector = (startTag: string): string => {
    const regex = /<(?<tag>[a-zA-Z\-_]+) ?(class=["'](?<classes>[a-zA-Z0-9\-_ ]*)["'])? ?(id=["'](?<id>[a-zA-Z0-9\-_]*)["'])?>/gm;
    const { tag, classes, id } = regex.exec(startTag)?.groups ?? {};
    return `${tag}${id ? `#${id}` : ''}${classes ? `.${classes.split(' ').join('.')}` : ''}`;
};

const arg = <
    T,
    T1 extends ReadSignal<T> | Signal<T>
>(v: T1) => {
    const isFunctionSignal = typeof v === 'function' && 'watch' in v;
    const isPrimitive = ['string', 'boolean', 'number', 'bigint', 'undefined'].includes(typeof v);

    if (isFunctionSignal) return v();
    else if (isPrimitive) return v;
    else if (typeof v === 'object')
        return JSON.stringify(v);

    console.error(new Error(`can't convert object to string`));
    return null;
};

export function el<
    Tag extends keyof HTMLElementTagNameMap = 'template'
>(component: string) {
    return createElementGenerator<Tag>((tpl, ...args) => {
        console.log(tpl);
        console.log(component);
        console.log(args);

        let startTag = '';
        let i = 0;
        for (const item of tpl) {
            const v = args[i];
            let ended = false;

            for (const char of item.split('')) {
                if (char === '>') {
                    startTag += char;
                    ended = true;
                    break;
                }
                startTag += char;
            }

            if (ended) break;

            const isFunctionSignal = typeof v === 'function' && 'watch' in v;
            const isObjectSignal = typeof v === 'object' && 'value' in v;
            const isObjectValue = isObjectSignal && typeof v.value === 'object';
            const isFunctionValue = isObjectValue && typeof v.value === 'function';
            const isFunctionValueReturnValid = isFunctionValue &&
                typeof v.value() !== 'object' && typeof v.value() !== 'function';

            if (isFunctionSignal) {
                startTag += v();
            }
            else if (isObjectSignal) {
                startTag += v.value;
            }
            else if (isFunctionValueReturnValid) {
                startTag += v.value();
            }
            else if (!isFunctionValue && !isFunctionValue) {
                startTag += v;
            }
            else {
                console.error(new Error(`can't convert object to string`));
                console.log(v, false);
            }

            i++;
        }

        let fullDomContent = '';
        let j = 0;
        for (const item of tpl) {
            fullDomContent += item;
            fullDomContent += `<template 
                data-var-id="${j}"
                data-var-component-name="${component}"
            >${arg(args[j])}</template>`

            // if (j < args.length) {
            //     console.log(`'${item.replace(/  /g, '__')}'`, arg(args[j]));
            // }
            // else {
            //     console.log(`'${item.replace(/  /g, '__')}'`);
            // }

            j++;
        }

        startTag = startTag
            .replace(/\n/g, '')
            .replace(/( )+/g, ' ')
            .replace(/( )+>/g, '>');

        const selector = startHtmlTagToCompleteCssSelector(startTag);

        console.log(startTag, selector);
        console.log(fullDomContent);
        // const parsedDom = (new DOMParser()).parseFromString(
        //     `<template>${fullDomContent.replace(/\n/g, '')
        //         .replace(/( )+/g, ' ')
        //         .replace(/( )+>/g, '>')}</template>`,
        //     'text/html'
        // ) as HTMLDocument;
        // const head: HTMLHeadElement = parsedDom.firstElementChild?.firstElementChild! as HTMLHeadElement;
        // const template = head.firstElementChild!.cloneNode(true) as HTMLTemplateElement;
        // console.log(template.innerHTML)

        console.log(h(selector, {}, [
            'test',
            h('span.tralala', {}, 'toto')
        ]));

        /*for (const v of args) {
            const isFunctionSignal = typeof v === 'function' && 'watch' in v;
            const isObjectSignal = typeof v === 'object' && 'value' in v;
            const isObjectValue = isObjectSignal && typeof v.value === 'object';
            const isFunctionValue = isObjectValue && typeof v.value === 'function';
            const isFunctionValueReturnValid = isFunctionValue &&
                typeof v.value() !== 'object' && typeof v.value() !== 'function';

            if (
                (isFunctionSignal || isObjectValue || isFunctionValueReturnValid) &&
                (!isObjectValue && !isFunctionValue || isFunctionValueReturnValid)
            ) {
                console.log(v, true);
            } else {
                console.log(v, false);
            }
        }*/

        return document.createElement('span');
    })
}
