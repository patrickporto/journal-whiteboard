import React, { useEffect, useState } from 'react'
import { HTMLContainer, TLBaseShape, TLBoxTool, TLBoxUtil, TLOpacityType, defineShape } from "@tldraw/tldraw"
import styled from 'styled-components'

const DEFAULT_IMAGE = '/icons/svg/item-bag.svg'

const componentType = 'item'

export type ItemShape = TLBaseShape<
	'item',
	{
		opacity: TLOpacityType // necessary for all shapes at the moment, others can be whatever you want!
		w: number
		h: number,
        id: string,
	}
>

export const ItemShape = defineShape<ItemShape>({
	type: componentType,
	getShapeUtil: () => ItemUtil,
})

export class ItemUtil extends TLBoxUtil<ItemShape> {
	static type = componentType

	override isAspectRatioLocked = (_shape: ItemShape) => false
	override canResize = (_shape: ItemShape) => true
	override canBind = (_shape: ItemShape) => true

	// Default props — used for shapes created with the tool
	override defaultProps(): ItemShape['props'] {
		return {
			opacity: '1',
			w: 200,
			h: 48,
            id: '',
		}
	}

    onClick = async (shape: ItemShape) => {
        const document = await fromUuid(shape.props.id);
        document?.sheet?.render(true)
    }

	// Render method — the React component that will be rendered for the shape
	render(shape: ItemShape) {
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
            <ItemImage src={document.img} />
            <ItemName>{document.name}</ItemName>
			</HTMLContainer>
		)
	}

	// Indicator — used when hovering over a shape or when it's selected; must return only SVG elements here
	indicator(shape: ItemShape) {
		return <rect width={shape.props.w} height={shape.props.h} />
	}

    getContextMenuItems = (shape: ActorShape) => {
        return {
            id: 'rolltable-context-menu',
            type: 'group',
            checkbox: false,
            disabled: false,
            readonlyOk: true,
            children: [
                {
                    id: 'render-sheet',
                    type: 'item',
                    actionItem: {
                        id: 'render-sheet',
                        label: game.i18n.localize('Sheet'),
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


const ItemName = styled.div`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const ItemImage = styled.img`
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
