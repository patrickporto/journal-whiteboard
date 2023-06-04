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

const componentType = 'scene';

export type SceneShape = TLBaseShape<
    'scene',
    {
        opacity: TLOpacityType; // necessary for all shapes at the moment, others can be whatever you want!
        w: number;
        h: number;
        id: string;
    }
>;

export const SceneShape = defineShape<SceneShape>({
    type: componentType,
    getShapeUtil: () => SceneUtil,
});

export class SceneUtil extends TLBoxUtil<SceneShape> {
    static type = componentType;

    override isAspectRatioLocked = (_shape: SceneShape) => false;
    override canResize = (_shape: SceneShape) => true;
    override canBind = (_shape: SceneShape) => true;

    // Default props — used for shapes created with the tool
    override defaultProps(): SceneShape['props'] {
        return {
            opacity: '1',
            w: 200,
            h: 48,
            id: '',
        };
    }

    // Render method — the React component that will be rendered for the shape
    render(shape: SceneShape) {
        const [document, setDocument] = useState<{
            name: string;
            thumb: string;
        }>({
            name: componentType,
            thumb: '',
        });
        useEffect(() => {
            async function getDocument() {
                const document = await fromUuid(shape.props.id);
                setDocument(document);
            }
            getDocument();
        }, [shape.props.id]);
        const bounds = this.bounds(shape);
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
                {bounds.h > 100 ? (
                    <SceneThumb backgroundImage={document.thumb}>
                        <SceneName>{document.name}</SceneName>
                    </SceneThumb>
                ) : (
                    <>
                        <SceneIcon><i className="fas fa-map"></i></SceneIcon>
                        <SceneName>{document.name}</SceneName>
                    </>
                )}
            </HTMLContainer>
        );
    }

    // Indicator — used when hovering over a shape or when it's selected; must return only SVG elements here
    indicator(shape: SceneShape) {
        return <rect width={shape.props.w} height={shape.props.h} />;
    }

    getContextMenuItems = (shape: SceneShape) => {
        return {
            id: 'rolltable-context-menu',
            type: 'group',
            checkbox: false,
            disabled: false,
            readonlyOk: true,
            children: [
                {
                    id: 'scene-activate',
                    type: 'item',
                    actionItem: {
                        id: 'scene-activate',
                        label: game.i18n.localize('Activate'),
                        readonlyOk: true,
                        onSelect: async () => {
                            const document = await fromUuid(shape.props.id);
                            document.activate()
                        },
                    },
                    checked: true,
                    readonlyOk: true,
                    disabled: !shape?.props?.id,
                },
                {
                    id: 'scene-view',
                    type: 'item',
                    actionItem: {
                        id: 'scene-view',
                        label: game.i18n.localize('SCENES.View'),
                        readonlyOk: true,
                        onSelect: async () => {
                            const document = await fromUuid(shape.props.id);
                            document.view()
                        },
                    },
                    checked: true,
                    readonlyOk: true,
                    disabled: !shape?.props?.id,
                },
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
            ],
        };
    };
}

const SceneName = styled.div`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const SceneThumb = styled.div<{ backgroundImage: boolean }>`
    border: none;
    background-image: url(${(props) => props.backgroundImage});
    display: flex;
    justify-content: center;
    align-items: center;    font-size: 1.5em;
    font-weight: normal;
    text-shadow: 1px 1px 3px var(--color-shadow-dark);
    background-position: 50% 50%;
    background-size: cover;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
`;


const SceneIcon = styled.div`
    font-size: 24px;
    padding: 8px;
    padding-left: 16px;
`;

export class SceneTool extends TLBoxTool {
    static override id = componentType;
    static override initial = 'idle';
    override shapeType = componentType;
}
