import debugModule from './debug/debug.module';
import tldrawModule from './tldraw/tldraw.module';
import whiteboardModule from './whiteboard/whiteboard.module';
import customComponentsModule from './custom-components/custom-components.module';

type Module = {
    hooks: {
        init?: () => Promise<void> | void;
        ready?: () => Promise<void> | void;
    };
};

const modules: Module[] = [debugModule, tldrawModule, customComponentsModule, whiteboardModule];

Hooks.on('init', async () => {
    // ReactDOM.createRoot(document.body);
    for (const module of modules) {
        if (module?.hooks?.init) {
            await module.hooks.init();
        }
    }
});

Hooks.on('ready', async () => {
    for (const module of modules) {
        if (module?.hooks?.ready) {
            await module.hooks.ready();
        }
    }
});
