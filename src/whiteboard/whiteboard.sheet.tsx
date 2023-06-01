import React from "react";
import * as ReactDOM from "react-dom/client";
import { WhiteBoardPage } from "./whiteboard-page";
import "./whiteboard.style.css";
import { useSnapshot } from "../tldraw/store";
import { TLInstance, TLUser, TldrawEditorConfig } from "@tldraw/tldraw";


export class JournalWhiteboardPageSheet extends JournalPageSheet {
    root: ReactDOM.Root | null = null;
    object: any;
    form: HTMLFormElement;
    snapshot: any = null;
    isEditable: boolean;


    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 960,
            height: 800,
            classes: ["whiteboard"],
            submitOnClose: false,
            submitOnChange: false
        });
    }

    async _renderInner(sheet: any): Promise<JQuery<Element>> {
        this.createForm();

        const tldrawConfig = new TldrawEditorConfig({});
        const store = tldrawConfig.createStore({
            initialData: {},
            userId: TLUser.createCustomId(game.user.id),
            instanceId: TLInstance.createCustomId(this.object.id),
        });
        this.snapshot = useSnapshot(store);
        const whiteboard = sheet.data.system?.whiteboard
        if (whiteboard) {
            this.snapshot.loadSnapshot(JSON.parse(whiteboard));
        }
        this.renderReact(sheet, tldrawConfig, store)
        return $(this.form);
    }

    createForm() {
        if (this.form) {
            return
        }
        this.form = document.createElement("form");
        this.form.setAttribute("autocomplete", "off");
    }

    renderReact(sheet: any, tldrawConfig: any, store: any) {
        if (!this.root) {
            this.root = ReactDOM.createRoot(this.form);
        }
        this.root.render(<WhiteBoardPage sheet={sheet} store={store} config={tldrawConfig} />);
    }

    async saveSnapshot() {
        const snapshot = this.snapshot.getSnapshot();
        await this.object.update({ ['system.whiteboard']: JSON.stringify(snapshot) }, { diff: false, recursive: true })
    }

    async close() {
        this.root?.unmount();
        this.root = null;
        if(this.isEditable) {
            await this.saveSnapshot();
        }
        return await super.close();
    }
}
