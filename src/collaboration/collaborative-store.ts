import { TLInstanceId, TLRecord, TLStore } from "@tldraw/tldraw";
import { RecordsDiff, SerializedSchema, StoreSnapshot, compareSchemas } from "@tldraw/tlstore";
import { debugService } from "../debug/debug.module";
import { useSnapshot } from "../tldraw/store";

type Diff = {
    instanceId: TLInstanceId ,
    changes: RecordsDiff<TLRecord>,
    schema: SerializedSchema,
}


export type Snapshot = {
    store: StoreSnapshot<TLRecord>,
    schema: SerializedSchema,
};

export class CollaborativeStore {
    stores: Map<TLInstanceId, TLStore> = new Map();
    socket: SocketModule;

    activateSocketListeners(socket: SocketModule) {
        this.socket = socket;
        this.socket.register('tldraw.getSnapshot', this.getSnapshot.bind(this));
        this.socket.register('tldraw.events', this.handleEvents.bind(this));
    }

    registerStore(instanceId: TLInstanceId, store: TLStore) {
        this.stores.set(instanceId, store);
    }

    getStore(instanceId: TLInstanceId) {
        const store = this.stores.get(instanceId);
        if (!store) {
            throw new Error(`No store found for instance ${instanceId}`);
        }
        return store;
    }

    handleEvents(diff: Diff) {
        let store: TLStore;
        try {
            store = this.getStore(diff.instanceId);
        } catch (e) {
            return
        }
        const comparison = compareSchemas(
            store.schema.serialize(),
            diff.schema
        )
        if (comparison === -1) {
            debugService.error("Schema mismatch. Can't apply changes.")
            return
        } else if (comparison === 1) {
            debugService.warn("Schema mismatch. Applying changes anyway.")
        }
        store.mergeRemoteChanges(() => {
            store.applyDiff(diff.changes)
        });
    }

    async restoreFromRemote(instanceId: TLInstanceId) {
        debugService.log('Restoring remote snapshot.', instanceId);
        const snapshot = await this.socket.executeForOthers('tldraw.getSnapshot', instanceId) as Snapshot;
        if (!snapshot) {
            debugService.log('No remote snapshot found.');
            return
        }
        debugService.log('Remote snapshot found.', snapshot);
        const store = this.getStore(instanceId);
        const migrationResult = store.schema.migrateStoreSnapshot(snapshot.store, snapshot.schema);

        if (migrationResult.type === 'error') {
            debugService.error(`Failed to migrate snapshot: ${migrationResult.reason}`);
            return;
        }
        store.mergeRemoteChanges(() => {
            store.put(Object.values(migrationResult.value), 'initialize')
        });
        debugService.log('Remote snapshot restored.');
    }

    getSnapshot(instanceId: TLInstanceId): Snapshot {
        const store = this.getStore(instanceId);
        const documentState = store.serialize(r => {
            return ![
                'instance',
                'camera',
                'instance_page_state',
                'user',
                'instance_presence',
                'user_document',
                'user_presence',
            ].includes(r.typeName);
        });
        const snapshot = {
            store: documentState,
            schema: store.schema.serialize(),
        };
        return snapshot;
    }

    restoreSnapshot(instanceId: TLInstanceId, snapshot: any) {
        const store = this.getStore(instanceId);
        const migrationResult = store.schema.migrateStoreSnapshot(snapshot.store, snapshot.schema);

        if (migrationResult.type === 'error') {
            debugService.error(`Failed to migrate snapshot: ${migrationResult.reason}`);
            return;
        }
        store.deserialize(migrationResult.value);
    }

    put(instanceId: TLInstanceId, changes: RecordsDiff<TLRecord>, source: string) {
        if (source !== 'user') {
            return;
        }
        const store = this.getStore(instanceId);
        this.socket.executeForOthers('tldraw.events', {
            instanceId,
            changes: changes,
            schema: store.schema.serialize(),
        });
    }
}
