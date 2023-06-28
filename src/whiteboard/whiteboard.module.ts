import { CANNONICAL_NAME } from '../constants';
import { debugService } from '../debug/debug.module';
import { WhiteboardModel } from './whiteboard.datamodel';
import { JournalWhiteboardPageSheet } from './whiteboard.sheet';

export default {
    hooks: {
        async init() {
            debugService.log('registering whiteboard data model');
            Object.assign(CONFIG.JournalEntryPage.dataModels, {
                [`${CANNONICAL_NAME}.whiteboard`]: WhiteboardModel,
            });
            debugService.log('registering journal whiteboard type');
            DocumentSheetConfig.registerSheet(
                JournalEntryPage,
                CANNONICAL_NAME,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                JournalWhiteboardPageSheet,
                {
                    types: [`${CANNONICAL_NAME}.whiteboard`],
                    label: game.i18n.localize('TYPES.JournalEntryPage.journal-whiteboard.whiteboard'),
                    makeDefault: true,
                },
            );
        },
    },
};
