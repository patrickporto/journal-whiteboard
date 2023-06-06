import Raect, { ReactElement } from 'react';
import * as ReactDOM from 'react-dom/client';
import { DocumentSheetProvider } from './document-sheet.context';

export abstract class JournalPageSheetReact extends JournalPageSheet {
    root: ReactDOM.Root | null = null;
    object: any;
    form: HTMLFormElement;
    isEditable: boolean;
    rendered: boolean;

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            submitOnClose: false,
            submitOnChange: false,
        });
    }

    async _renderInner(sheet: any): Promise<JQuery<Element>> {
        this.createForm();
        this.componentDidMount(sheet);
        this.createReactRoot(sheet)
        return $(this.form);
    }

    createForm() {
        if (this.form) {
            return;
        }
        this.form = document.createElement('form');
        this.form.setAttribute('autocomplete', 'off');
    }

    createReactRoot(sheet: any) {
        if (this.root) {
            return
        }
        this.root = ReactDOM.createRoot(this.form);
        this.root.render(<DocumentSheetProvider sheet={sheet}>{this.reactComponent()}</DocumentSheetProvider>);
    }

    abstract componentDidMount(sheet): void;

    abstract reactComponent(props: {
        sheet: any
    }): ReactElement;

    async close() {
        this.root?.unmount();
        this.root = null;
        return await super.close();
    }

    deactivateListeners(html: JQuery) {
        html.find('img[data-edit]').off('click');
        html.find('input,select,textarea').off('change');
        html.find('button.file-picker').off('click');
    }

    override activateListeners(html: JQuery) {
        this.deactivateListeners(html);

        super.activateListeners(html);
    }
    _activateEditor(_: JQuery | HTMLElement) {}
    async saveEditor(name: string, _: { remove?: boolean } = {}) {}
}
