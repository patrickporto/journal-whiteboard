import { App } from "@tldraw/tldraw";
import { MenuSchema, TldrawUiOverrides, ToolbarSchemaContextType } from "@tldraw/ui";
import { debugService } from "../debug/debug.module";

export const menuOverrides: Partial<TldrawUiOverrides> = {
    contextMenu: (app: App, schema: MenuSchema, helpers) => {
        debugService.log('contextMenu', app, schema, helpers);
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
        return schema;
    },
};

function unregisterConversionsFromContextMenu(schema: MenuSchema) {
    schema.splice(
        schema.findIndex(item => item.id === 'conversions'),
        1
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
                    disabled: false
                },
            ],
        });
    }
}

function registerFoundryDocumentContextMenu(app: App, schema: MenuSchema, helpers: any) {
    const selectedShapes = app.selectedShapes
    const selectedShape = selectedShapes?.[0]
    debugService.log('registerFoundryDocumentContextMenu', selectedShapes, selectedShape);
    if (selectedShapes.length !== 1 || !['document', 'actor'].includes(selectedShape.type)) {
        return
    }
    schema.unshift({
        id: 'foundry-document-group',
        type: 'group',
        checkbox: false,
        disabled: false,
        readonlyOk: true,
        children: [
            {
                id: 'render-sheet',
                type: 'item',
                actionItem: {
                    id: 'action.toggle-grid',
                    label: game.i18n.localize('JW.OpenSheet'),
                    readonlyOk: true,
                    onSelect: async () => {
                        const document = await fromUuid(selectedShape.props.id)
                        document.sheet.render(true)
                    },
                },
                checked: true,
                readonlyOk: true,
                disabled: !selectedShape?.props?.id
            },
        ],
    });
}
