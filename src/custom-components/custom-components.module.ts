import { debugService } from "../debug/debug.module";
import { registerComponent } from "../whiteboard/whiteboard-components";
import { ActorShape, ActorTool } from "./foundry/actor";
import { MacroShape, MacroTool } from "./foundry/macro";
import { PlaylistShape, PlaylistTool } from "./foundry/playlist";
import { PlaylistSoundShape, PlaylistSoundTool } from "./foundry/playlist-sound";

export default {
    hooks: {
        init() {
            debugService.log('registering custom components');
            registerComponent({
                shape: ActorShape,
                tool: ActorTool,
                dataTransferType: 'Actor',
            })
            registerComponent({
                shape: MacroShape,
                tool: MacroTool,
                dataTransferType: 'Macro',
            })
            registerComponent({
                shape: PlaylistShape,
                tool: PlaylistTool,
                dataTransferType: 'Playlist',
            })
            registerComponent({
                shape: PlaylistSoundShape,
                tool: PlaylistSoundTool,
                dataTransferType: 'PlaylistSound',
            })
        },
    },
};
