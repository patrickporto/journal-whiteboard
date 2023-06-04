import React, { useEffect, useState } from 'react'
import { HTMLContainer, TLBaseShape, TLBoxTool, TLBoxUtil, TLOpacityType, defineShape } from "@tldraw/tldraw"

const DEFAULT_ACTOR_IMG = '/icons/svg/mystery-man.svg'

export type ActorShape = TLBaseShape<
	'actor',
	{
		opacity: TLOpacityType // necessary for all shapes at the moment, others can be whatever you want!
		w: number
		h: number,
        id: string,
	}
>

export const ActorShape = defineShape<ActorShape>({
	type: 'actor',
	getShapeUtil: () => ActorUtil,
})

export class ActorUtil extends TLBoxUtil<ActorShape> {
	// Id — the shape util's id
	static type = 'actor'

	// Flags — there are a LOT of other flags!
	override isAspectRatioLocked = (_shape: ActorShape) => false
	override canResize = (_shape: ActorShape) => true
	override canBind = (_shape: ActorShape) => true

	// Default props — used for shapes created with the tool
	override defaultProps(): ActorShape['props'] {
		return {
			opacity: '1',
			w: 200,
			h: 200,
            id: '',
		}
	}

    onClick = async (shape: ActorShape) => {
        const document = await fromUuid(shape.props.id);
        document?.sheet?.render(true)
    }

	// Render method — the React component that will be rendered for the shape
	render(shape: ActorShape) {
        const [actor, setActor] = useState<{
            img: string,
            name: string
        }>({
            img: DEFAULT_ACTOR_IMG,
            name: 'Actor'
        })
        useEffect(() => {
            async function getDocument() {
                const document = await fromUuid(shape.props.id)
                setActor(document)

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
                <img src={actor.img} data-edit="img" alt={actor.name}></img>
			</HTMLContainer>
		)
	}

	// Indicator — used when hovering over a shape or when it's selected; must return only SVG elements here
	indicator(shape: ActorShape) {
		return <rect width={shape.props.w} height={shape.props.h} />
	}
}

export class ActorTool extends TLBoxTool {
	static override id = 'actor'
	static override initial = 'idle'
	override shapeType = 'actor'
}
