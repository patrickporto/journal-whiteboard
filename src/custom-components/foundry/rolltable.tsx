import React, { useEffect, useState } from 'react'
import { HTMLContainer, TLBaseShape, TLBoxTool, TLBoxUtil, TLOpacityType, defineShape } from "@tldraw/tldraw"
import styled from 'styled-components'

const DEFAULT_IMAGE = '/icons/svg/dice-target.svg'

const componentType = 'rolltable'

export type RolltableShape = TLBaseShape<
	'rolltable',
	{
		opacity: TLOpacityType // necessary for all shapes at the moment, others can be whatever you want!
		w: number
		h: number,
        id: string,
	}
>

export const RolltableShape = defineShape<RolltableShape>({
	type: componentType,
	getShapeUtil: () => RolltableUtil,
})

export class RolltableUtil extends TLBoxUtil<RolltableShape> {
	static type = componentType

	override isAspectRatioLocked = (_shape: RolltableShape) => false
	override canResize = (_shape: RolltableShape) => true
	override canBind = (_shape: RolltableShape) => true

	// Default props — used for shapes created with the tool
	override defaultProps(): RolltableShape['props'] {
		return {
			opacity: '1',
			w: 200,
			h: 48,
            id: '',
		}
	}

	// Render method — the React component that will be rendered for the shape
	render(shape: RolltableShape) {
        const [document, setDocument] = useState<{
            name: string
            img: string
        }>({
            name: componentType,
            img: DEFAULT_IMAGE,
        })
        useEffect(() => {
            async function getDocument() {
                const document = await fromUuid(shape.props.id)
                setDocument(document)

            }
            getDocument()
        }, [shape.props.id])
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
            <RolltableImage src={document.img} />
            <RolltableName>{document.name}</RolltableName>
			</HTMLContainer>
		)
	}

	// Indicator — used when hovering over a shape or when it's selected; must return only SVG elements here
	indicator(shape: RolltableShape) {
		return <rect width={shape.props.w} height={shape.props.h} />
	}

    getContextMenuItems = (shape: RolltableShape) => {
        return {
            id: 'rolltable-context-menu',
            type: 'group',
            checkbox: false,
            disabled: false,
            readonlyOk: true,
            children: [
                {
                    id: 'draw',
                    type: 'item',
                    actionItem: {
                        id: 'draw',
                        label: game.i18n.localize('Roll'),
                        readonlyOk: true,
                        onSelect: async () => {
                            const document = await fromUuid(shape.props.id);
                            document?.draw()
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
    }
}


const RolltableName = styled.div`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const RolltableImage = styled.img`
    width: 36px;
    height: 36px;
    margin-left: 8px;
    margin-right: 8px;
    border: none;
`;

export class RolltableTool extends TLBoxTool {
	static override id = componentType
	static override initial = 'idle'
	override shapeType = componentType
}
