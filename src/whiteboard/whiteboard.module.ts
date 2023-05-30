import { debugService } from '../debug/debug.module';
import { JournalWhiteboardPageSheet } from './whiteboard.sheet';

export default {
    hooks: {
        async init() {
            debugService.log('registering journal whiteboard type');
            DocumentSheetConfig.registerSheet(
                JournalEntryPage,
                'journal-whiteboard',
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                JournalWhiteboardPageSheet,
                {
                    types: ['journal-whiteboard.whiteboard'],
                    makeDefault: true,
                },
            );
        },
    },
};
