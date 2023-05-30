export class JournalWhiteboardPageSheet extends JournalPageSheet {
    private form: any = null;
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 600,
            height: 600,
        });
    }

    async _renderInner(...args: any[]) {
        if (!this.form) {
            this.form = document.createElement("form");
            this.form.innerHTML = "HELLO WORLD"
            this.form.setAttribute("autocomplete", "off");
        }
        return $(this.form);
    }

    async close(...args: any[]) {
        return super.close(...args);
    }
}
