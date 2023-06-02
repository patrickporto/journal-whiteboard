export const createi18nLazyObject = (obj: object) => {
    const props = {}
    for (const [key, value] of Object.entries(obj)) {
        props[key] = {
            get() {
                return game.i18n.localize(value)
            },
        }
    }
    return Object.defineProperties(obj, props)
}
