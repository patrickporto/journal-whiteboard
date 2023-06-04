import React, { useEffect, useMemo, useState } from 'react';
import {
    HTMLContainer,
    TLBaseShape,
    TLBoxTool,
    TLBoxUtil,
    TLOpacityType,
    defineShape,
} from '@tldraw/tldraw';
import styled from 'styled-components';

const componentType = 'journal_entry_page';

export type JournalEntryPageShape = TLBaseShape<
    'journal_entry_page',
    {
        opacity: TLOpacityType; // necessary for all shapes at the moment, others can be whatever you want!
        w: number;
        h: number;
        id: string;
    }
>;

export const JournalEntryPageShape = defineShape<JournalEntryPageShape>({
    type: componentType,
    getShapeUtil: () => JournalEntryPageUtil,
});

export class JournalEntryPageUtil extends TLBoxUtil<JournalEntryPageShape> {
    static type = componentType;

    override isAspectRatioLocked = (_shape: JournalEntryPageShape) => false;
    override canResize = (_shape: JournalEntryPageShape) => true;
    override canBind = (_shape: JournalEntryPageShape) => true;

    // Default props — used for shapes created with the tool
    override defaultProps(): JournalEntryPageShape['props'] {
        return {
            opacity: '1',
            w: 200,
            h: 48,
            id: '',
        };
    }

    onClick = async (shape: JournalEntryPageShape) => {
        const document = await fromUuid(shape.props.id);
        document?.sheet?.render();
    };

    // Render method — the React component that will be rendered for the shape
    render(shape: JournalEntryPageShape) {
        const contentRef = React.useRef<HTMLDivElement>(null);
        const [document, setDocument] = useState<{
            name: string;
        }>({
            name: 'Journal Entry',
        });
        const [content, setContent] = useState<string>('');

        useEffect(() => {
            async function getDocument() {
                const document = await fromUuid(shape.props.id);
                setDocument(document);
                const output = await TextEditor.enrichHTML(document.text.content, {
                    secrets: document.isOwner,
                    relativeTo: document,
                    async: true,
                });
                setContent(output);
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
                    <JournalEntryPage>
                    <JournalEntryPageHeader>{document.name}</JournalEntryPageHeader>
                    <JournalEntryPageContent ref={contentRef} dangerouslySetInnerHTML={{ __html: content }} />
                    </JournalEntryPage>
                ) : (
                    <>
                        <JournalEntryPageIcon>
                            <i className="fas fa-book-open"></i>
                        </JournalEntryPageIcon>
                        <JournalEntryPageName>{document.name}</JournalEntryPageName>
                    </>
                )}
            </HTMLContainer>
        );
    }

    // Indicator — used when hovering over a shape or when it's selected; must return only SVG elements here
    indicator(shape: JournalEntryPageShape) {
        return <rect width={shape.props.w} height={shape.props.h} />;
    }
}

const JournalEntryPage = styled.div`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: var(--color-text-dark-primary);
    background: url(../ui/parchment.jpg) repeat;
    border: 2px solid #000;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 8px;
`

const JournalEntryPageHeader = styled.h1`
    user-select: text;
    pointer-events: all;
    touch-action: auto;
    overscroll-behavior: none;
`

const JournalEntryPageContent = styled.section`
    user-select: text;
    pointer-events: all;
    touch-action: auto;
    overscroll-behavior: none;
`;

const JournalEntryPageName = styled.div`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const JournalEntryPageIcon = styled.div`
    font-size: 24px;
    padding: 8px;
    padding-left: 16px;
`;

export class JournalEntryPageTool extends TLBoxTool {
    static override id = componentType;
    static override initial = 'idle';
    override shapeType = componentType;
}
