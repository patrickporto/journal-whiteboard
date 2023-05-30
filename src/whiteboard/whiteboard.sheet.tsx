import React from "react";
import * as ReactDOM from "react-dom/client";
import { WhiteBoardPage } from "./whiteboard-page";
import "./whiteboard.style.css";


export class JournalWhiteboardPageSheet extends JournalPageSheet {
    private root: ReactDOM.Root | null = null;

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 600,
            height: 600,
            classes: ["whiteboard"],
        });
    }

    async _renderInner(): Promise<JQuery<Element>> {
        const form = document.createElement("form");
        form.setAttribute("autocomplete", "off");
        this.renderReact(form);
        return $(form);
    }

    renderReact(element: HTMLElement) {
        if (this.root) {
            return
        }
        this.root = ReactDOM.createRoot(element);
        this.root.render(<WhiteBoardPage />);

    }

    async close(...args: any[]) {
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }
        return super.close(...args);
    }
}
