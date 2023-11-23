declare namespace Element {
    type TagType<T extends ReadonlyArray<
        `<${keyof HTMLElementTagNameMap}>${string}`|
        `<${keyof HTMLElementTagNameMap} ${string}>${string}`
        |string
    >> = T[0] extends `<${infer T1 extends keyof HTMLElementTagNameMap}>${string}`
        ? T1 :
        (
            T[0] extends `<${infer T1 extends keyof HTMLElementTagNameMap} ${string}>${string}`
                ? T1 : string
            );

    type TaggedHTML<T extends keyof HTMLElementTagNameMap> = (
        strings: TemplateStringsArray,
        ...values: string[]
    ) => HTMLElementTagNameMap[T];

    type Element<Tag extends keyof HTMLElementTagNameMap = 'template'> = <
        Tpl extends ReadonlyArray<
            `<${T}>${string}`|
            `<${T} ${string}>${string}`|
            string
        >,
        Args extends any[]
    >(tpl: Tpl, ...args: Args) => HTMLElementTagNameMap[Tag]
}