import { App } from '@tldraw/tldraw';
import React, { ReactElement, createContext, useCallback, useContext, useState } from 'react';

type WhiteboardState = {
    app: App | null;
    setApp(app: App): void;
    save(): void;
};

const defaultWhiteboardState = {
    app: null,
    setApp: (_: App) => null,
    save: () => null,
};

const WhiteboardContext = createContext<WhiteboardState>(defaultWhiteboardState);

export const useWhiteboard = () => useContext(WhiteboardContext);

export const WhiteboardProvider = ({ onSave, children }): ReactElement => {
    const [app, setApp] = useState<App | null>(null);
    const save = useCallback(() => {
        onSave()
    }, [onSave])
    return (
        <WhiteboardContext.Provider value={{ app, setApp, save }}>{children}</WhiteboardContext.Provider>
    );
};
