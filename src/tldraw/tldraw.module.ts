import { TldrawSettings } from "./tldraw.settings";


export let tldrawSettings: TldrawSettings;

export default {
    hooks: {
        init() {
            tldrawSettings = new TldrawSettings();
            tldrawSettings.registerSettings();
        },
    },
};
