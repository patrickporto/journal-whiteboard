declare class Application {
    static RENDER_STATES: Readonly<{ CLOSING: -2; CLOSED: -1; NONE: 0; RENDERING: 1; RENDERED: 2; ERROR: 3 }>;
    _state: number;
    id: string;
    appId: number;
    element: jQuery;
    title: string;
    static get defaultOptions(): any;
    async _renderInner(...args: any): Promise<JQuery>;
    async _render(force = false, options = {})
    async _renderOuter(): Promise<JQuery>;
    async close(...args: any): Promise<any>;
    activateListeners(html: JQuery): void;
}

declare class JournalPageSheet extends Application {
}

declare class JournalEntryPage {
}

declare class DocumentSheetConfig {
    static registerSheet(a: JournalEntryPage, b: string, c: JournalPageSheet, d: { types: string[], makeDefault: boolean, label: string }): void;
}

declare class HooksType {
    on(event: string, callback: (...args: any) => void): void;
    once(event: string, callback: (...args: any) => void): void;
    callAll(event: string, ...args: any): void;
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
