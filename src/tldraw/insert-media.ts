import { ACCEPTED_ASSET_TYPE, createShapesFromFiles } from '@tldraw/editor';
import {
    App,
    TLAsset,
    TLAssetId,
    getHashForString,
    getImageSizeFromSrc,
    getVideoSizeFromSrc,
} from '@tldraw/tldraw';

const getFileByPath = async (path: string) => {
    const result = await (await fetch(path)).blob();
    const file = new File([result], path, {
        lastModified: new Date().getTime(),
        type: result.type,
    });
    return file
}

export const insertMediaFromFoundry = async (app: App) => {
    const filePicker = new FilePicker({
        type: 'imagevideo',
        displayMode: 'tiles',
        async callback(path: string) {
            createShapesFromFiles(app, [await getFileByPath(path)], app.viewportPageBounds.center, false)
        },
    });
    filePicker.render();
};
