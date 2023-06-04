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

const componentType = 'playlist'

export type PlaylistShape = TLBaseShape<
    'playlist',
    {
        opacity: TLOpacityType; // necessary for all shapes at the moment, others can be whatever you want!
        w: number;
        h: number;
        id: string;
    }
>;

export const PlaylistShape = defineShape<PlaylistShape>({
    type: componentType,
    getShapeUtil: () => PlaylistUtil,
});


export class PlaylistUtil extends TLBoxUtil<PlaylistShape> {
    static type = componentType;

    override isAspectRatioLocked = (_shape: PlaylistShape) => false;
    override canResize = (_shape: PlaylistShape) => true;
    override canBind = (_shape: PlaylistShape) => true;

    // Default props — used for shapes created with the tool
    override defaultProps(): PlaylistShape['props'] {
        return {
            opacity: '1',
            w: 200,
            h: 48,
            id: '',
        };
    }

    onClick = async (shape: PlaylistShape) => {
        const document = await fromUuid(shape.props.id);
        if (document.playing) {
            document.stopAll()
        }
        else {
            document.playAll()
        }
    }

    // Render method — the React component that will be rendered for the shape
    render(shape: PlaylistShape) {
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
                for (const playistSound of document.sounds) {
                    playistSound.sound.on('start', async () => {
                        const document = await fromUuid(shape.props.id);
                        setDocument(prev => ({...prev, playing: document.playing}));
                    });
                    playistSound.sound.on('stop', async () => {
                        const document = await fromUuid(shape.props.id);
                        setDocument(prev => ({...prev, playing: document.playing}));
                    });
                }
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
    indicator(shape: PlaylistShape) {
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
    padding: 8px;
    padding-left: 16px;
    color: ${props => (props.playing ? 'var(--color-text-hyperlink)' : 'var(--color-text)')};
`;

export class PlaylistTool extends TLBoxTool {
    static override id = componentType;
    static override initial = 'idle';
    override shapeType = componentType;
}
