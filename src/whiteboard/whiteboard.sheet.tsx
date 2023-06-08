import React from 'react';
import { WhiteboardPage } from './whiteboard-page';
import './whiteboard.style.css';
import {
    App,
    TLInstance,
    TLInstanceId,
    TLInstancePageState,
    TLPage,
    TLPageId,
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
import { collaborativeStore } from '../collaboration/collaboration.module';

export class JournalWhiteboardPageSheet extends JournalPageSheetReact {
    store: any;
    tldrawApp: App;
    tldrawConfig: TldrawEditorConfig;
    userId: TLUserId;
    user: TLUser;
    userPresence: TLUserPresence
    instanceId: TLInstanceId;
    instance: TLInstance;
    instancePageState: TLInstancePageState
    pageId: TLPageId
    page: TLPage
    removeStoreListener: any;

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 960,
            height: 800,
            classes: ['sheet', 'journal-entry-page', 'journal-sheet', 'journal-whiteboard.whiteboard'],
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
        this.pageId = TLPage.createCustomId(this.object.id)
        this.page = TLPage.create({ id: this.pageId, name: sheet.title, index: 'a0' })
        this.store = this.tldrawConfig.createStore({
            initialData: {
                [this.pageId]: this.page
            },
            userId: this.userId,
            instanceId: this.instanceId,
        })
        collaborativeStore.registerStore(this.instanceId, this.store)
        if (this.isEditable) {
            $(this.form).on('drop', this._onDrop.bind(this));
        }
        const whiteboard = this.object.system?.whiteboard;
        if (whiteboard) {
            collaborativeStore.restoreSnapshot(this.instanceId, whiteboard);
        }
    }

    handleMount = async (app: App) => {
        this.tldrawApp = app;
        if (tldrawSettings.theme === 'dark') {
            this.tldrawApp.setDarkMode(true);
        } else {
            this.tldrawApp.setDarkMode(false);
        }
        if (!this.isEditable) {
            this.tldrawApp.enableReadOnlyMode();
        }
        app.updateUserPresence({color: game.user.color})
        await this.enableCollaborativeEditing(app);
    };

    async enableCollaborativeEditing(app: App) {
        if (!collaborativeStore || !this.rendered) {
            return
        }

        debugService.log('Collaborative editing is enabled.');
        await collaborativeStore.restoreFromRemote(this.instanceId)
        debugService.log('Listening for remote changes.');
        this.removeStoreListener = app.store.listen(entry => {
            collaborativeStore.put(this.instanceId, entry.changes, entry.source)
        });
    }

    reactComponent() {
        return (
            <WhiteboardPage
                store={this.store}
                config={this.tldrawConfig}
                onMount={this.handleMount}
                userId={this.userId}
                instanceId={this.instanceId}
            />
        );
    }

    async saveSnapshot() {
        const snapshot = collaborativeStore.getSnapshot(this.instanceId);
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
                x: this.tldrawApp.viewportPageBounds.center.x,
                y: this.tldrawApp.viewportPageBounds.center.y,
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
