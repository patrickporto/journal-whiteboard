import React from 'react';
import { WhiteBoardPage } from './whiteboard-page';
import './whiteboard.style.css';
import { useSnapshot } from '../tldraw/store';
import { App, TLInstance, TLUser, TldrawEditorConfig } from '@tldraw/tldraw';
import { ActorShape, ActorTool } from './custom-components/actor';
import { debugService } from '../debug/debug.module';
import { DocumentShape, DocumentTool } from './custom-components/document';
import { tldrawSettings } from '../tldraw/tldraw.module';
import { JournalPageSheetReact } from '../foundry/journal-page.sheet';

export class JournalWhiteboardPageSheet extends JournalPageSheetReact {
    snapshot: any = null;
    store: any;
    tldrawApp: App;
    tldrawConfig: TldrawEditorConfig;

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 960,
            height: 800,
            classes: ['whiteboard'],
        });
    }

    componentDidMount(sheet: any) {
        this.tldrawConfig = new TldrawEditorConfig({
            shapes: [ActorShape, DocumentShape] as any,
            tools: [ActorTool, DocumentTool],
            allowUnknownShapes: true,
        });
        this.store = this.tldrawConfig.createStore({
            initialData: {},
            userId: TLUser.createCustomId(game.user.id),
            instanceId: TLInstance.createCustomId(this.object.id),
        });
        this.snapshot = useSnapshot(this.store);
        const whiteboard = sheet.data.system?.whiteboard;
        if (whiteboard) {
            this.snapshot.loadSnapshot(JSON.parse(whiteboard));
        }
        if (this.isEditable) {
            $(this.form).on('drop', this._onDrop.bind(this));
        }
    }

    handleMount = (app: App) => {
        this.tldrawApp = app;
        debugService.log('Tldraw App', app);
        if (tldrawSettings.theme === 'dark') {
            this.tldrawApp.setDarkMode(true);
        } else {
            this.tldrawApp.setDarkMode(false);
        }
        if (!this.isEditable) {
            this.tldrawApp.enableReadOnlyMode();
        }
    };

    renderReact({ sheet }: any) {
        return (
            <WhiteBoardPage
                sheet={sheet}
                store={this.store}
                config={this.tldrawConfig}
                onMount={this.handleMount}
            />
        );
    }

    async saveSnapshot() {
        const snapshot = this.snapshot.getSnapshot();
        await this.object.update(
            { ['system.whiteboard']: JSON.stringify(snapshot) },
            { diff: false, recursive: true },
        );
    }

    async close() {
        if (this.isEditable) {
            await this.saveSnapshot();
        }
        return await super.close();
    }

    async _onDrop({ originalEvent }: any) {
        const data = JSON.parse(originalEvent.dataTransfer?.getData('text/plain') ?? '');
        debugService.log('Drop', data);
        const shapeId = this.tldrawApp.createShapeId();
        if (data.type === 'Actor') {
            this.tldrawApp.createShapes([
                {
                    id: shapeId,
                    type: 'actor',
                    x: originalEvent.x - 200,
                    y: originalEvent.y - 200,
                    props: {
                        id: data.uuid,
                    },
                },
            ]);
            this.tldrawApp.setSelectedIds([shapeId])
            this.tldrawApp.setSelectedTool('select.idle')
            return;
        }
        this.tldrawApp.createShapes([
            {
                id: shapeId,
                type: 'document',
                x: originalEvent.x - 200,
                y: originalEvent.y - 200,
                props: {
                    id: data.uuid,
                },
            },
        ]);
        this.tldrawApp.setSelectedIds([shapeId])
        this.tldrawApp.setSelectedTool('select.idle')

    }
}
