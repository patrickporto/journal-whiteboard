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

declare class HooksType {
    on(event: string, callback: (...args: any) => void): void;
    once(event: string, callback: (...args: any) => void): void;
}

declare const Hooks: HooksType

declare const game: any = {
}

declare const foundry: any = {}

declare const ui: any = {
    notifications: {
        error(message: string): void;
    }
}

declare function fromUuid(uuid: string): Promise<any>;
declare function fromUuidSync(uuid: string): any;

declare const foundry = {
    abstract: {
        TypeDataModel: any
    },
    data: {
        fields: any
    }
}

declare const CONFIG = {
    JournalEntryPage: any
}
