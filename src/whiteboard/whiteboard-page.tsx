import React from 'react';
import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/editor.css';
import '@tldraw/tldraw/ui.css';
import { getAssetUrlsByImport } from './assets';

const assetUrls = getAssetUrlsByImport()


export const WhiteBoardPage = () => {
    return (
        <Tldraw assetUrls={assetUrls} />
    );
};
