import { debugService } from "../debug/debug.module";
import { registerComponent } from "./custom-components.service";
import { ActorShape, ActorTool } from "./foundry/actor";
import { ItemShape } from "./foundry/item";
import { MacroShape, MacroTool } from "./foundry/macro";
import { PlaylistShape, PlaylistTool } from "./foundry/playlist";
import { PlaylistSoundShape, PlaylistSoundTool } from "./foundry/playlist-sound";
import { RolltableShape, RolltableTool } from "./foundry/rolltable";
import { SceneShape, SceneTool } from "./foundry/scene";

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
            registerComponent({
                shape: RolltableShape,
                tool: RolltableTool,
                dataTransferType: 'RollTable',
            })
            registerComponent({
                shape: SceneShape,
                tool: SceneTool,
                dataTransferType: 'Scene',
            })
            registerComponent({
                shape: ItemShape,
                tool: ActorTool,
                dataTransferType: 'Item',
            })
        },
    },
};
