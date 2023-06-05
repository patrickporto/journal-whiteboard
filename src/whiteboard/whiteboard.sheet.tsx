import React from 'react';
import { WhiteboardPage } from './whiteboard-page';
import './whiteboard.style.css';
import { useSnapshot } from '../tldraw/store';
import {
    App,
    TLInstance,
    TLInstanceId,
    TLInstancePageState,
    TLUser,
    TLUserId,
    TLUserPresence,
    TldrawEditorConfig,
} from '@tldraw/tldraw';
import { debugService } from '../debug/debug.module';
import { tldrawSettings } from '../tldraw/tldraw.module';
import { JournalPageSheetReact } from '../foundry/journal-page.sheet';
import {
    getShapeByDataTransferType,
    getShapes,
    getTools,
} from '../custom-components/custom-components.service';
import { collaborativeStore, collaborativeStoreSocket } from '../collaboration/collaboration.module';

export class JournalWhiteboardPageSheet extends JournalPageSheetReact {
    snapshot: any = null;
    store: any;
    tldrawApp: App;
    tldrawConfig: TldrawEditorConfig;
    userId: TLUserId;
    user: TLUser;
    userPresence: TLUserPresence
    instanceId: TLInstanceId;
    instance: TLInstance;
    instancePageState: TLInstancePageState
    removeStoreListener: any;

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 960,
            height: 800,
            classes: ['sheet', 'journal-entry-page', 'journal-sheet', 'whiteboard'],
        });
    }

    componentDidMount(sheet: any) {
        this.tldrawConfig = new TldrawEditorConfig({
            shapes: getShapes(),
            tools: getTools(),
            allowUnknownShapes: true,
        });

        this.userId = TLUser.createCustomId(game.user.id);
        this.user = TLUser.create({
            id: this.userId,
            name: game.user.name,
        });
        this.instanceId = TLInstance.createCustomId(this.object.id)
        this.store = this.tldrawConfig.createStore({
            initialData: {},
            userId: this.userId,
            instanceId: this.instanceId,
        })
        this.snapshot = useSnapshot(this.store);
        if (this.isEditable) {
            $(this.form).on('drop', this._onDrop.bind(this));
        }
        const whiteboard = this.object.system?.whiteboard;
        if (whiteboard) {
            this.snapshot.loadSnapshot(whiteboard);
        }
    }

    handleMount = (app: App) => {
        this.tldrawApp = app;
        debugService.log('Tldraw App', app);
        this.enableCollaborativeEditing(app);
        if (tldrawSettings.theme === 'dark') {
            this.tldrawApp.setDarkMode(true);
        } else {
            this.tldrawApp.setDarkMode(false);
        }
        if (!this.isEditable) {
            this.tldrawApp.enableReadOnlyMode();
        }
    };

    enableCollaborativeEditing(app: App) {
        if (!collaborativeStore) {
            return
        }
        collaborativeStore.registerStore(this.instanceId, this.store);
        debugService.info('Collaborative editing is enabled.');
        app.updateUserPresence({color: game.user.color})
        this.removeStoreListener = app.store.listen(entry => {
            collaborativeStoreSocket.executeForOthers('handleEvents', {
                instanceId: this.instanceId,
                changes: entry.changes,
                schema: app.store.schema.serialize(),
                userId: this.userId,
            });
        });
    }

    renderReact({ sheet }: any) {
        return (
            <WhiteboardPage
                sheet={sheet}
                store={this.store}
                config={this.tldrawConfig}
                onMount={this.handleMount}
                userId={this.userId}
                instanceId={this.instanceId}
            />
        );
    }

    async saveSnapshot() {
        const snapshot = this.snapshot.getSnapshot();
        await this.object.update(
            { ['system.whiteboard']: snapshot },
            { diff: false, recursive: true },
        );
    }

    async close() {
        if (this.isEditable) {
            await this.saveSnapshot();
        }
        this?.removeStoreListener();
        return await super.close();
    }

    async _onDrop({ originalEvent }: any) {
        const data = JSON.parse(originalEvent.dataTransfer?.getData('text/plain') ?? '');
        const shape = getShapeByDataTransferType(data?.type);
        debugService.log('Dropping Foundry Document', data, shape);
        if (!shape) {
            return;
        }
        const shapeId = this.tldrawApp.createShapeId();
        this.tldrawApp.createShapes([
            {
                id: shapeId,
                type: shape.type,
                x: originalEvent.clientX,
                y: originalEvent.clientY,
                props: {
                    id: data.uuid,
                    type: data.type,
                },
            },
        ]);
        this.tldrawApp.setSelectedIds([shapeId]);
        this.tldrawApp.setSelectedTool('select.idle');
    }
}
