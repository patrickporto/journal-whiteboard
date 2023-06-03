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
            document.parent.stopSound(document)
        }
        else {
            document.parent.playSound(document)
        }
    }

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
                    setDocument(prev => ({...prev, playing: true}));
                });
                document.sound.on('stop', async () => {
                    setDocument(prev => ({...prev, playing: false}))
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
                <PlaylistSoundIcon playing={document.playing} onClick={() => {
                    console.log('click');
                }}>
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
}

const PlaylistSoundName = styled.div`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const PlaylistSoundIcon = styled.div<{playing: boolean}>`
    font-size: 24px;
    padding: 16px;
    color: ${props => (props.playing ? 'var(--color-text-hyperlink)' : 'var(--color-text)')};
`;

export class PlaylistSoundTool extends TLBoxTool {
    static override id = 'playlist_sound';
    static override initial = 'idle';
    override shapeType = 'playlist_sound';
}
