import React, { useEffect, useState } from 'react'
import { HTMLContainer, TLBaseShape, TLBoxTool, TLBoxUtil, TLOpacityType, defineShape } from "@tldraw/tldraw"

export type DocumentShape = TLBaseShape<
	'document',
	{
		opacity: TLOpacityType // necessary for all shapes at the moment, others can be whatever you want!
		w: number
		h: number,
        id: string,
	}
>

export const DocumentShape = defineShape<DocumentShape>({
	type: 'document',
	getShapeUtil: () => DocumentUtil,
})

export class DocumentUtil extends TLBoxUtil<DocumentShape> {
	static type = 'document'

	override isAspectRatioLocked = (_shape: DocumentShape) => false
	override canResize = (_shape: DocumentShape) => true
	override canBind = (_shape: DocumentShape) => true

	// Default props — used for shapes created with the tool
	override defaultProps(): DocumentShape['props'] {
		return {
			opacity: '1',
			w: 200,
			h: 48,
            id: '',
		}
	}

    onClick = async (shape: DocumentShape) => {
        const document = await fromUuid(shape.props.id);
        document?.sheet?.render(true)
    }

	// Render method — the React component that will be rendered for the shape
	render(shape: DocumentShape) {
        const [document, setDocument] = useState<{
            name: string
        }>({
            name: 'Document'
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
					justifyContent: 'center',
					pointerEvents: 'all',
				}}
			>
                {document.name}
			</HTMLContainer>
		)
	}

	// Indicator — used when hovering over a shape or when it's selected; must return only SVG elements here
	indicator(shape: DocumentShape) {
		return <rect width={shape.props.w} height={shape.props.h} />
	}
}

export class DocumentTool extends TLBoxTool {
	static override id = 'document'
	static override initial = 'idle'
	override shapeType = 'document'
}
