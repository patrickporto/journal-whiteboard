import { TLInstanceId, TLStore, TLUserId } from "@tldraw/tldraw";
import { SerializedSchema, compareSchemas } from "@tldraw/tlstore";
import { debugService } from "../debug/debug.module";

type Diff = {
    instanceId: TLInstanceId ,
    changes: any,
    schema: SerializedSchema,
    userId: TLUserId,
}

export class CollaborativeStore {
    stores: Map<TLInstanceId, TLStore> = new Map();

    activateSocketListeners(socket: SocketModule) {
        socket.register('handleEvents', this.handleEvents.bind(this));
    }

    registerStore(instanceId: TLInstanceId, store: TLStore) {
        this.stores.set(instanceId, store);
    }

    handleEvents(diff: Diff) {
        // debugService.log(`[${diff.userId}][${diff.instanceId}]`, diff);
        const store = this.stores.get(diff.instanceId);
        if (!store) {
            debugService.error(`No store found for instance ${diff.instanceId}`);
            return;
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
}
