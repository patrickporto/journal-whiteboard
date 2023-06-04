import { TLBoxTool, TLShapeDef, TLUnknownShape } from "@tldraw/tldraw"

export type WhiteboardComponent = {
    shape: TLShapeDef<TLUnknownShape>,
    tool: typeof TLBoxTool,
    dataTransferType: string,
}

const _components: WhiteboardComponent[] = []

export const registerComponent = (component: WhiteboardComponent) => {
    _components.push(component)
}

export const getShapes = () => {
    return _components.map(c => c.shape)
}

export const getTools = () => {
    return _components.map(c => c.tool)
}

export const getShapeByDataTransferType = (dataTransferType: string) => {
    return _components.find(c => c.dataTransferType === dataTransferType)?.shape
}
