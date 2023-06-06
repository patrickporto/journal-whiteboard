import React from 'react';
import {
    App,
    Canvas,
    ContextMenu,
    TLInstanceId,
    TLStore,
    TLUserId,
    TldrawEditor,
    TldrawEditorConfig,
    TldrawUi,
} from '@tldraw/tldraw';
import '@tldraw/tldraw/editor.css';
import '@tldraw/tldraw/ui.css';
import { getEditorAssetUrls, getUiAssetUrls } from '../tldraw/assets';
import { menuOverrides } from '../tldraw/menu-overrides';
import styled from 'styled-components';
import { useDocumentSheet } from '../foundry/document-sheet.context';

type WhiteBoardPageProps = {
    sheet: any;
    store: TLStore;
    config: TldrawEditorConfig;
    userId: TLUserId;
    instanceId: TLInstanceId;
    onMount: (app: App) => void;
};

const editorAssetUrls = getEditorAssetUrls();
const uiAssetUrls = getUiAssetUrls();

export const WhiteboardPage = ({
    store,
    config,
    onMount,
    userId,
    instanceId,
}: WhiteBoardPageProps) => {
    const { sheet, update } = useDocumentSheet()
    const [showTitle, setShowTitle] = React.useState(sheet?.data?.title?.show);
    console.log('sheet', sheet)
    return (
        <Whiteboard className={sheet.cssClass}>
            {sheet?.editable && (
                <header className="journal-header">
                    <input
                        className="title"
                        type="text"
                        defaultValue={sheet?.data?.name}
                        key={sheet.id}
                        onChange={(e) => {
                            update({ name: e.target.value });
                        }}
                        placeholder="Page Name"
                    />
                    <aside className="page-level flexcol">
                        <div className="heading-level flexrow">
                            <label className="flex0" data-tooltip="Heading Level">
                                <i className="fa-solid fa-list-tree"></i>
                            </label>
                            <select
                                name="title.level"
                                onChange={({ currentTarget }) => {
                                    sheet.document.update(
                                        { title: { level: currentTarget.value } },
                                        { render: false },
                                    );
                                }}
                                value={sheet.data.title.level}
                            >
                                {Object.entries(sheet.headingLevels).map(([key, value]) => (
                                    <option
                                        key={key}
                                        value={key}
                                    >
                                        {value as String}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="show-title">
                            <label className="checkbox">
                                Display Page Title
                                <input
                                    type="checkbox"
                                    name="title.show"
                                    checked={showTitle}
                                    onChange={({ currentTarget }) => {
                                        sheet.document.update(
                                            { title: { show: currentTarget.checked } },
                                            { render: false },
                                        );
                                        setShowTitle(currentTarget.checked);
                                    }}
                                />
                            </label>
                        </div>
                    </aside>
                </header>
            )}
            {(showTitle && !sheet?.editable) && (
                <header className="journal-page-header">
                    <h1>{sheet?.data?.name}</h1>
                </header>
            )}
            <TldrawEditor
                assetUrls={editorAssetUrls}
                config={config}
                store={store}
                onMount={onMount}
                userId={userId}
                instanceId={instanceId}
            >
                <TldrawUi assetUrls={uiAssetUrls} overrides={menuOverrides}>
                    <ContextMenu>
                        <Canvas />
                    </ContextMenu>
                </TldrawUi>
            </TldrawEditor>
        </Whiteboard>
    );
};

const Whiteboard = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;
