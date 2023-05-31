import React from 'react';
import {
    Canvas,
    ContextMenu,
    TLStore,
    TldrawEditor,
    TldrawEditorConfig,
    TldrawUi,
} from '@tldraw/tldraw';
import '@tldraw/tldraw/editor.css';
import '@tldraw/tldraw/ui.css';
import { getEditorAssetUrls, getUiAssetUrls } from '../tldraw/assets';

type WhiteBoardPageProps = {
    sheet: any;
    store: TLStore;
    config: TldrawEditorConfig;
};

const editorAssetUrls = getEditorAssetUrls();
const uiAssetUrls = getUiAssetUrls();


export const WhiteBoardPage = ({ sheet, store, config }: WhiteBoardPageProps) => {
    return (
        <TldrawEditor assetUrls={editorAssetUrls} config={config} store={store}>
            {sheet?.editable ? (
                <TldrawUi assetUrls={uiAssetUrls}>
                    <ContextMenu>
                        <Canvas />
                    </ContextMenu>
                </TldrawUi>
            ) : (
                <Canvas />
            )}
        </TldrawEditor>
    );
};
