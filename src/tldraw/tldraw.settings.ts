import { CANNONICAL_NAME } from '../constants';
import { createi18nLazyObject } from '../foundry/i18n';

export enum Theme {
    Light = 'light',
    Dark = 'dark',
}

export const ThemeLabel = createi18nLazyObject({
    [Theme.Light]: 'JW.ThemeLight',
    [Theme.Dark]: 'JW.ThemeDark',
});

export class TldrawSettings {
    registerSettings() {
        game.settings.register(CANNONICAL_NAME, 'theme', {
            name: game.i18n.localize('JW.Theme'),
            hint: game.i18n.localize('JW.ThemeHint'),
            scope: 'world',
            config: true,
            default: Theme.Light,
            choices: ThemeLabel,
            type: String,
        });
    }

    get theme() {
        return game.settings.get(CANNONICAL_NAME, 'theme');
    }
}
