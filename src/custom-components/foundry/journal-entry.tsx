import React, { useEffect, useState } from 'react'
import { HTMLContainer, TLBaseShape, TLBoxTool, TLBoxUtil, TLOpacityType, defineShape } from "@tldraw/tldraw"
import styled from 'styled-components'

const componentType = 'journal_entry';

export type JournalEntryShape = TLBaseShape<
	'journal_entry',
	{
		opacity: TLOpacityType // necessary for all shapes at the moment, others can be whatever you want!
		w: number
		h: number,
        id: string,
	}
>

export const JournalEntryShape = defineShape<JournalEntryShape>({
	type: componentType,
	getShapeUtil: () => JournalEntryUtil,
})

export class JournalEntryUtil extends TLBoxUtil<JournalEntryShape> {
	static type = componentType

	override isAspectRatioLocked = (_shape: JournalEntryShape) => false
	override canResize = (_shape: JournalEntryShape) => true
	override canBind = (_shape: JournalEntryShape) => true

	// Default props — used for shapes created with the tool
	override defaultProps(): JournalEntryShape['props'] {
		return {
			opacity: '1',
			w: 200,
			h: 48,
            id: '',
		}
	}

    onClick = async (shape: JournalEntryShape) => {
        const document = await fromUuid(shape.props.id);
        document?.sheet?.render()
    }

	// Render method — the React component that will be rendered for the shape
	render(shape: JournalEntryShape) {
        const [document, setDocument] = useState<{
            name: string
        }>({
            name: 'Journal Entry',
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
            <JournalEntryIcon><i className="fas fa-book-open"></i></JournalEntryIcon>
            <JournalEntryName>{document.name}</JournalEntryName>
			</HTMLContainer>
		)
	}

	// Indicator — used when hovering over a shape or when it's selected; must return only SVG elements here
	indicator(shape: JournalEntryShape) {
		return <rect width={shape.props.w} height={shape.props.h} />
	}
}


const JournalEntryName = styled.div`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;


const JournalEntryIcon = styled.div`
    font-size: 24px;
    padding: 8px;
    padding-left: 16px;
`;

export class JournalEntryTool extends TLBoxTool {
	static override id = componentType
	static override initial = 'idle'
	override shapeType = componentType
}
