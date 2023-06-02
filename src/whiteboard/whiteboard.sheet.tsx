import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { WhiteBoardPage } from './whiteboard-page';
import './whiteboard.style.css';
import { useSnapshot } from '../tldraw/store';
import { App, TLInstance, TLUser, TldrawEditorConfig } from '@tldraw/tldraw';
import { ActorShape, ActorTool } from '../foundry/actor';
import { debugService } from '../debug/debug.module';

export class JournalWhiteboardPageSheet extends JournalPageSheet {
    root: ReactDOM.Root | null = null;
    object: any;
    form: HTMLFormElement;
    snapshot: any = null;
    isEditable: boolean;
    store: any;
    tldrawApp: App;

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 960,
            height: 800,
            classes: ['whiteboard'],
            submitOnClose: false,
            submitOnChange: false,
        });
    }

    async _renderInner(sheet: any): Promise<JQuery<Element>> {
        this.createForm();

        const tldrawConfig = new TldrawEditorConfig({
            shapes: [ActorShape] as any,
            tools: [ActorTool],
            allowUnknownShapes: true,
        });
        this.store = tldrawConfig.createStore({
            initialData: {},
            userId: TLUser.createCustomId(game.user.id),
            instanceId: TLInstance.createCustomId(this.object.id),
        });
        this.snapshot = useSnapshot(this.store);
        const whiteboard = sheet.data.system?.whiteboard;
        if (whiteboard) {
            this.snapshot.loadSnapshot(JSON.parse(whiteboard));
        }
        this.renderReact(sheet, tldrawConfig, this.store);
        return $(this.form);
    }

    createForm() {
        if (this.form) {
            return;
        }
        this.form = document.createElement('form');
        this.form.setAttribute('autocomplete', 'off');
        if (this.isEditable) {
            $(this.form).on('drop', this._onDrop.bind(this));
        }
    }

    handleMount = (app: App) => {
        this.tldrawApp = app
        if (!this.isEditable) {
            this.tldrawApp.enableReadOnlyMode()
        }
    }

    renderReact(sheet: any, tldrawConfig: any, store: any) {
        if (!this.root) {
            this.root = ReactDOM.createRoot(this.form);
        }
        this.root.render(<WhiteBoardPage sheet={sheet} store={store} config={tldrawConfig} onMount={this.handleMount} />);
    }

    async saveSnapshot() {
        const snapshot = this.snapshot.getSnapshot();
        await this.object.update(
            { ['system.whiteboard']: JSON.stringify(snapshot) },
            { diff: false, recursive: true },
        );
    }

    async close() {
        this.root?.unmount();
        this.root = null;
        if (this.isEditable) {
            await this.saveSnapshot();
        }
        return await super.close();
    }

    async _onDrop({ originalEvent }: any) {
        const data = JSON.parse(originalEvent.dataTransfer?.getData('text/plain') ?? '');
        debugService.log('Drop', data);
        const document = await fromUuid(data.uuid);
        const shapeId = this.tldrawApp.createShapeId(data.uuid);
        if (data.type === 'Actor') {
            this.tldrawApp.createShapes([
                {
                    id: shapeId,
                    type: 'actor',
                    x: originalEvent.x - 200,
                    y: originalEvent.y - 200,
                    props: {
                        id: data.uuid,
                        name: document.name,
                    }
                }
            ])
        }
    }
}
