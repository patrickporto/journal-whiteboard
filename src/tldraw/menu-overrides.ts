import { App } from '@tldraw/tldraw';
import { MenuSchema, TldrawUiOverrides, ToolbarSchemaContextType } from '@tldraw/ui';
import { insertMediaFromFoundry } from './insert-media';

export const menuOverrides: Partial<TldrawUiOverrides> = {
    contextMenu: (app: App, schema: MenuSchema, helpers) => {
        unregisterConversionsFromContextMenu(schema);
        registerWhiteboardContextMenu(app, schema, helpers);
        registerFoundryDocumentContextMenu(app, schema, helpers);
        return schema;
    },
    toolbar(app: App, schema: ToolbarSchemaContextType, helpers: any) {
        schema.splice(
            schema.findIndex(item => item.id === 'embed'),
            1,
        );
        const insertMediaIndex = schema.findIndex(item => item.id === 'asset')
        schema[insertMediaIndex] = {
            ...schema[insertMediaIndex],
            toolItem: {
                ...schema[insertMediaIndex].toolItem,
                onSelect: async () => {
                    await insertMediaFromFoundry(app)
                }
            }
        }
        return schema;
    },
};

function unregisterConversionsFromContextMenu(schema: MenuSchema) {
    schema.splice(
        schema.findIndex(item => item.id === 'conversions'),
        1,
    );
}

function registerWhiteboardContextMenu(app: App, schema: MenuSchema, helpers: any) {
    if (!helpers.oneSelected) {
        schema.push({
            id: 'preferences-group',
            type: 'group',
            checkbox: false,
            disabled: false,
            readonlyOk: true,
            children: [
                {
                    id: 'toggle-grid',
                    type: 'item',
                    actionItem: {
                        id: 'action.toggle-grid',
                        label: 'action.toggle-grid.menu',
                        kbd: "$'",
                        readonlyOk: true,
                        onSelect: () => {
                            app.setGridMode(!app.isGridMode);
                        },
                    },
                    checked: true,
                    readonlyOk: true,
                    disabled: false,
                },
            ],
        });
    }
}

function registerFoundryDocumentContextMenu(app: App, schema: MenuSchema, helpers: any) {
    const selectedShapes = app.selectedShapes;
    const selectedShape = selectedShapes?.[0];
    if (!selectedShape || selectedShapes.length !== 1) {
        return;
    }
    const util = app.getShapeUtil(selectedShape) as any
    if (!util.getContextMenuItems) {
        return;
    }
    schema.unshift(util.getContextMenuItems(selectedShape))
}
