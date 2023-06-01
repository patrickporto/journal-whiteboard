import React from 'react';
import {
    App,
    Canvas,
    ContextMenu,
    MenuSchema,
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

const menuOverrides = {
	menu(_app: App, schema: MenuSchema, _helpers: any) {
		schema.forEach((item) => {
			if (item.id === 'menu' && item.type === 'group') {
				item.children = item.children.filter((menuItem) => {
					if (menuItem.id === 'file' && menuItem.type === 'submenu') {
						return false
					}
					return true
				})
			}
		})

		return schema
	},
    toolbar(_app: App, schema: MenuSchema, _helpers: any) {
        schema.splice(schema.findIndex((item) => item.id === 'embed'), 1)
        return schema
    }
}

export const WhiteBoardPage = ({ sheet, store, config }: WhiteBoardPageProps) => {
    return (
        <TldrawEditor assetUrls={editorAssetUrls} config={config} store={store}>
            {sheet?.editable ? (
                <TldrawUi assetUrls={uiAssetUrls} overrides={menuOverrides}>
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
