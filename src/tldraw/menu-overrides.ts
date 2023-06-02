import { App } from "@tldraw/tldraw";
import { MenuSchema } from "@tldraw/ui";

export const menuOverrides = {
    actionsMenu(app: App, schema: MenuSchema) {
        return schema;
    },
    actions(app: App, schema: MenuSchema) {
        return schema;
    },
    contextMenu: (app, schema, helpers) => {
        schema.splice(
            schema.findIndex(item => item.id === 'conversions'),
            1,
        );
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
                    },
                ],
            });
        }
        return schema;
    },
    menu(app: App, schema: MenuSchema, helpers: any) {
        for (const item of schema) {
            if (item.id === 'menu' && item.type === 'group') {
                item.children = item.children.filter(menuItem => {
                    if (menuItem.id === 'file' && menuItem.type === 'submenu') {
                        return false;
                    }
                    return true;
                });
            }
        }

        return schema;
    },
    toolbar(app: App, schema: MenuSchema, helpers: any) {
        schema.splice(
            schema.findIndex(item => item.id === 'embed'),
            1,
        );
        return schema;
    },
};
