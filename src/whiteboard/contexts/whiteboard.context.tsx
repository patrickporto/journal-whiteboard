import { App, TLUser, TLUserPresence } from '@tldraw/tldraw';
import React, { ReactElement, createContext, useContext, useEffect,  useRef, useState } from 'react';
import { collaborativeStore } from '../../collaboration/collaboration.module';
import { ConcurrentUser } from '../../collaboration/collaborative-store';


type WhiteboardState = {
    app: App | null;
    setApp(app: App): void;
    save(): void;
    concurrentUsers: ConcurrentUser[]
};

const defaultWhiteboardState = {
    app: null,
    setApp: (_: App) => null,
    save: () => null,
    concurrentUsers: []
};

const WhiteboardContext = createContext<WhiteboardState>(defaultWhiteboardState);

export const useWhiteboard = () => useContext(WhiteboardContext);

export const WhiteboardProvider = ({ instanceId, onSave, children }): ReactElement => {
    const [app, setApp] = useState<App | null>(null);
    const listenerRef = useRef<any>()
    const [concurrentUsers, setConcurrentUsers] = useState<ConcurrentUser[]>([])
    useEffect(() => {
        if (!app) return
        listenerRef.current = collaborativeStore.listen(instanceId, () => {
            const nextConcurrentUsers = collaborativeStore.getConcurrentUsers(instanceId)
            if (!foundry.utils.objectsEqual(concurrentUsers.map(u => u.id), nextConcurrentUsers.map(u => u.id))) {
                setConcurrentUsers(nextConcurrentUsers)
            }
        })
        return () => {
            listenerRef.current()
        }
    }, [app?.store, concurrentUsers, setConcurrentUsers])
    return (
        <WhiteboardContext.Provider value={{ app, setApp, save: onSave, concurrentUsers }}>{children}</WhiteboardContext.Provider>
    );
};
