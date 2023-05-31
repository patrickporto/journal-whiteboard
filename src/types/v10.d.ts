declare class JournalPageSheet {
    static get defaultOptions(): any;
    async _renderInner(...args: any): Promise<any>;
    async close(...args: any): Promise<any>;
}

declare class JournalEntryPage {
}

declare class DocumentSheetConfig {
    static registerSheet(a: JournalEntryPage, b: string, c: JournalPageSheet, d: { types: string[], makeDefault: boolean, label: string }): void;
}

declare const Hooks = {
    on(event: string, callback: (...args: any) => void): void;
}

declare const game: any = {
}

declare const foundry: any = {}

declare const ui: any = {
    notifications: {
        error(message: string): void;
    }
}
