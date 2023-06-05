import React from 'react';
import {
    App,
    Canvas,
    ContextMenu,
    TLInstanceId,
    TLStore,
    TLUserId,
    TldrawEditor,
    TldrawEditorConfig,
    TldrawUi,
} from '@tldraw/tldraw';
import '@tldraw/tldraw/editor.css';
import '@tldraw/tldraw/ui.css';
import { getEditorAssetUrls, getUiAssetUrls } from '../tldraw/assets';
import { menuOverrides } from '../tldraw/menu-overrides';

type WhiteBoardPageProps = {
    sheet: any;
    store: TLStore;
    config: TldrawEditorConfig;
    userId: TLUserId
    instanceId: TLInstanceId
    onMount: (app: App) => void;
};

const editorAssetUrls = getEditorAssetUrls();
const uiAssetUrls = getUiAssetUrls();

export const WhiteBoardPage = ({ sheet, store, config, onMount, userId, instanceId }: WhiteBoardPageProps) => {
    return (
        <TldrawEditor assetUrls={editorAssetUrls} config={config} store={store} onMount={onMount} userId={userId} instanceId={instanceId}>
            <TldrawUi assetUrls={uiAssetUrls} overrides={menuOverrides}>
                <ContextMenu>
                    <Canvas />
                </ContextMenu>
            </TldrawUi>
        </TldrawEditor>
    );
};
