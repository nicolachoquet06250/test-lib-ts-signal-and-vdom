type ComponentReturn = {
    mount: <
        Tag extends keyof HTMLElementTagNameMap,
        T extends keyof HTMLElementTagNameMap|HTMLElement
    >(el: T) => void
}

type ComponentOnMount<
    Tag extends keyof HTMLElementTagNameMap,
    T extends HTMLElementTagNameMap[Tag] = HTMLElementTagNameMap[Tag]
> = (el: Element.Element<Tag>) => T

type Component = <Tag extends keyof HTMLElementTagNameMap>(
    mounter: ComponentOnMount<Tag>,
    name: string
) => ComponentReturn;