import { CANNONICAL_NAME } from '../constants';

export class DebugSettings {
    registerSettings() {
        game.settings.register(CANNONICAL_NAME, 'debug', {
            name: game.i18n.localize('JW.Debug'),
            hint: game.i18n.localize('JW.DebugHint'),
            scope: 'world',
            config: true,
            default: false,
            type: Boolean,
        });
    }

    get debug() {
        return game.settings.get(CANNONICAL_NAME, 'debug');
    }
}
