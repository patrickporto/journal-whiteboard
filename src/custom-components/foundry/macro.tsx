import React, { useEffect, useState } from 'react'
import { HTMLContainer, TLBaseShape, TLBoxTool, TLBoxUtil, TLOpacityType, defineShape } from "@tldraw/tldraw"
import styled from 'styled-components'

const DEFAULT_IMAGE = '/icons/svg/dice-target.svg'

export type MacroShape = TLBaseShape<
	'macro',
	{
		opacity: TLOpacityType // necessary for all shapes at the moment, others can be whatever you want!
		w: number
		h: number,
        id: string,
	}
>

export const MacroShape = defineShape<MacroShape>({
	type: 'macro',
	getShapeUtil: () => MacroUtil,
})

export class MacroUtil extends TLBoxUtil<MacroShape> {
	static type = 'macro'

	override isAspectRatioLocked = (_shape: MacroShape) => false
	override canResize = (_shape: MacroShape) => true
	override canBind = (_shape: MacroShape) => true

	// Default props — used for shapes created with the tool
	override defaultProps(): MacroShape['props'] {
		return {
			opacity: '1',
			w: 200,
			h: 48,
            id: '',
		}
	}

    onClick = async (shape: MacroShape) => {
        const document = await fromUuid(shape.props.id);
        document?.execute()
    }

	// Render method — the React component that will be rendered for the shape
	render(shape: MacroShape) {
        const [document, setDocument] = useState<{
            name: string
            img: string
        }>({
            name: 'Macro',
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
            <MacroImage src={document.img} />
            <MacroName>{document.name}</MacroName>
			</HTMLContainer>
		)
	}

	// Indicator — used when hovering over a shape or when it's selected; must return only SVG elements here
	indicator(shape: MacroShape) {
		return <rect width={shape.props.w} height={shape.props.h} />
	}
}


const MacroName = styled.div`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const MacroImage = styled.img`
    width: 36px;
    height: 36px;
    margin-left: 8px;
    margin-right: 8px;
    border: none;
`;

export class MacroTool extends TLBoxTool {
	static override id = 'macro'
	static override initial = 'idle'
	override shapeType = 'macro'
}
