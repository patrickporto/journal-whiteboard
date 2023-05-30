import debugModule from './debug/debug.module';
import whiteboard from './whiteboard/whiteboard.module';

type Module = {
    hooks: {
        init?: () => Promise<void> | void;
        ready?: () => Promise<void> | void;
    };
};

const modules: Module[] = [debugModule, whiteboard];

Hooks.on('init', async () => {
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
