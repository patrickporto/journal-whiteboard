import { debugService } from '../debug/debug.module';
import { WhiteboardModel } from './whiteboard.datamodel';
import { JournalWhiteboardPageSheet } from './whiteboard.sheet';

export default {
    hooks: {
        async init() {
            debugService.log('registering whiteboard data model');
            Object.assign(CONFIG.JournalEntryPage.dataModels, {
                "journal-whiteboard.whiteboard": WhiteboardModel,
            });
            debugService.log('registering journal whiteboard type');
            DocumentSheetConfig.registerSheet(
                JournalEntryPage,
                'journal-whiteboard',
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                JournalWhiteboardPageSheet,
                {
                    types: ['journal-whiteboard.whiteboard'],
                    label: game.i18n.localize('TYPES.JournalEntryPage.journal-whiteboard.whiteboard'),
                    makeDefault: true,
                },
            );
        },
    },
};
