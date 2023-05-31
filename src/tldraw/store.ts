import { TLStore } from "@tldraw/tldraw"
import { debugService } from "../debug/debug.module"

export type Snapshot = ReturnType<typeof getSnapshot>

export const getSnapshot = (store: TLStore) => {
    return {
        store: store.serialize(),
        schema: store.schema.serialize(),
    }
}

export const loadSnapshot = (store: TLStore, snapshot: Snapshot) => {
    const migrationResult = store.schema.migrateStoreSnapshot(snapshot.store, snapshot.schema)

    if (migrationResult.type === 'error') {
        debugService.error(`Failed to migrate snapshot: ${migrationResult.reason}`)
        return
    }
    store.deserialize(migrationResult.value)
}

export const useSnapshot = (store: TLStore) => {
    return {
        getSnapshot: () => getSnapshot(store),
        loadSnapshot: (snapshot: Snapshot) => loadSnapshot(store, snapshot),
    }
}
