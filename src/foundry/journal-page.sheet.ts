import { ReactElement } from 'react';
import * as ReactDOM from 'react-dom/client';

export abstract class JournalPageSheetReact extends JournalPageSheet {
    root: ReactDOM.Root | null = null;
    object: any;
    form: HTMLFormElement;
    isEditable: boolean;

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
        if (!this.root) {
            this.root = ReactDOM.createRoot(this.form);
        }
        this.root.render(this.renderReact({sheet}));
    }

    abstract componentDidMount(sheet): void;

    abstract renderReact(props: {
        sheet: any;
    }): ReactElement;

    async close() {
        this.root?.unmount();
        this.root = null;
        return await super.close();
    }
}
