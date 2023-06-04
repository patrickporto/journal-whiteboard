import React, { useEffect, useState } from 'react';
import {
    HTMLContainer,
    TLBaseShape,
    TLBoxTool,
    TLBoxUtil,
    TLOpacityType,
    defineShape,
} from '@tldraw/tldraw';
import styled from 'styled-components';

export type PlaylistSoundShape = TLBaseShape<
    'playlist_sound',
    {
        opacity: TLOpacityType; // necessary for all shapes at the moment, others can be whatever you want!
        w: number;
        h: number;
        id: string;
    }
>;

export const PlaylistSoundShape = defineShape<PlaylistSoundShape>({
    type: 'playlist_sound',
    getShapeUtil: () => PlaylistSoundUtil,
});

export class PlaylistSoundUtil extends TLBoxUtil<PlaylistSoundShape> {
    static type = 'playlist_sound';

    override isAspectRatioLocked = (_shape: PlaylistSoundShape) => false;
    override canResize = (_shape: PlaylistSoundShape) => true;
    override canBind = (_shape: PlaylistSoundShape) => true;

    // Default props — used for shapes created with the tool
    override defaultProps(): PlaylistSoundShape['props'] {
        return {
            opacity: '1',
            w: 200,
            h: 48,
            id: '',
        };
    }

    onClick = async (shape: PlaylistSoundShape) => {
        const document = await fromUuid(shape.props.id);
        if (document.sound.playing) {
            document.parent.stopSound(document);
        } else {
            document.parent.playSound(document);
        }
    };

    // Render method — the React component that will be rendered for the shape
    render(shape: PlaylistSoundShape) {
        const [document, setDocument] = useState<{
            name: string;
            playing: boolean;
            sound: any;
        }>({
            name: 'Playlit Sound',
            playing: false,
            sound: null,
        });
        useEffect(() => {
            async function getDocument() {
                const document = await fromUuid(shape.props.id);
                setDocument(document);
                document.sound.on('start', async () => {
                    setDocument(prev => ({ ...prev, playing: true }));
                });
                document.sound.on('stop', async () => {
                    setDocument(prev => ({ ...prev, playing: false }));
                });
            }
            getDocument();
        }, [shape.props.id]);
        return (
            <HTMLContainer
                id={shape.id}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'start',
                    pointerEvents: 'all',
                }}
            >
                <PlaylistSoundIcon playing={document.playing}>
                    {document.playing ? (
                        <i className="fas fa-square"></i>
                    ) : (
                        <i className="fa-solid fa-play"></i>
                    )}
                </PlaylistSoundIcon>
                <PlaylistSoundName>{document.name}</PlaylistSoundName>
            </HTMLContainer>
        );
    }

    // Indicator — used when hovering over a shape or when it's selected; must return only SVG elements here
    indicator(shape: PlaylistSoundShape) {
        return <rect width={shape.props.w} height={shape.props.h} />;
    }

    getContextMenuItems = (shape: PlaylistSoundShape) => {
        const document = fromUuidSync(shape.props.id);
        const soundContextMenuItems = [
            {
                id: 'render-sheet',
                type: 'item',
                actionItem: {
                    id: 'render-sheet',
                    label: game.i18n.localize('Configure'),
                    readonlyOk: true,
                    onSelect: async () => {
                        const document = await fromUuid(shape.props.id);
                        document.sheet.render(true);
                    },
                },
                checked: true,
                readonlyOk: true,
                disabled: !shape?.props?.id,
            },
        ];
        if (document.sound.playing) {
            soundContextMenuItems.unshift(
                {
                    id: 'playlist-sound-stop',
                    type: 'item',
                    actionItem: {
                        id: 'playlist-sound-stop',
                        label: game.i18n.localize('PLAYLIST.SoundStop'),
                        readonlyOk: true,
                        onSelect: async () => {
                            document.parent.stopSound(document);
                        },
                    },
                    checked: true,
                    readonlyOk: true,
                    disabled: false,
                },
                {
                    id: 'playlist-sound-pause',
                    type: 'item',
                    actionItem: {
                        id: 'playlist-sound-pause',
                        label: game.i18n.localize('PLAYLIST.SoundPause'),
                        readonlyOk: true,
                        onSelect: async () => {
                            document.update({playing: false, pausedTime: document.sound.currentTime});
                        },
                    },
                    checked: true,
                    readonlyOk: true,
                    disabled: false,
                },
            );
        } else {
            soundContextMenuItems.unshift(
                {
                    id: 'playlist-sound-play',
                    type: 'item',
                    actionItem: {
                        id: 'playlist-sound-play',
                        label: game.i18n.localize('PLAYLIST.SoundPlay'),
                        readonlyOk: true,
                        onSelect: async () => {
                            document.parent.playSound(document);
                        },
                    },
                    checked: true,
                    readonlyOk: true,
                    disabled: false,
                }
            )
        }
        return {
            id: 'playlist-sound-context-menu',
            type: 'group',
            checkbox: false,
            disabled: false,
            readonlyOk: true,
            children: soundContextMenuItems,
        };
    };
}

const PlaylistSoundName = styled.div`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const PlaylistSoundIcon = styled.div<{ playing: boolean }>`
    font-size: 24px;
    padding: 8px;
    padding-left: 16px;
    color: ${props => (props.playing ? 'var(--color-text-hyperlink)' : 'var(--color-text)')};
`;

export class PlaylistSoundTool extends TLBoxTool {
    static override id = 'playlist_sound';
    static override initial = 'idle';
    override shapeType = 'playlist_sound';
}
