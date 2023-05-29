import { CANNONICAL_NAME } from '../constants';

export class DebugSettings {
    registerSettings() {
        (game as Game).settings.register(CANNONICAL_NAME, 'debug', {
            name: (game as Game).i18n.localize('MODULE.Debug'),
            hint: (game as Game).i18n.localize('MODULE.DebugHint'),
            scope: 'world',
            config: true,
            default: false,
            type: Boolean,
        });
    }

    get debug() {
        return (game as Game).settings.get(CANNONICAL_NAME, 'debug');
    }
}
