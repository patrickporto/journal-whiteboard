import React, { useCallback, useState } from 'react';
import styled, { css } from 'styled-components';
import { useWhiteboard } from '../contexts/whiteboard.context';
import { Box2d } from '@tldraw/primitives';
import { compact } from '@tldraw/utils';
import { ConcurrentUsers } from './concurrent-users';

export const WhiteboardMenu = () => {
    const { app, save } = useWhiteboard();
    const [isGridMode, setIsGridMode] = useState(app?.isGridMode)

    const handleSave = useCallback(() => {
        save();
    }, [app]);

    const handleShowGrid = useCallback(() => {
        if (!app || app.currentToolId !== 'select') return;
        app.setGridMode(!app.isGridMode);
        setIsGridMode(app.isGridMode)
    }, [app]);

    const handleDuplicate = useCallback(() => {
        if (!app || app.currentToolId !== 'select') return;
        const ids = app.selectedIds;
        const commonBounds = Box2d.Common(compact(ids.map(id => app.getPageBoundsById(id))));
        const offset = app.canMoveCamera
            ? {
                  x: commonBounds.width + 10,
                  y: 0,
              }
            : {
                  x: 16 / app.zoomLevel,
                  y: 16 / app.zoomLevel,
              };
        app.mark('duplicate shapes');
        app.duplicateShapes(ids, offset);
    }, [app]);

    const handleAlignLeft = useCallback(() => {
        if (!app || app.currentToolId !== 'select') return;
        app.mark('align left');
        app.alignShapes('left', app.selectedIds);
    }, [app]);
    const handleAlignHorizontally = useCallback(() => {
        if (!app || app.currentToolId !== 'select') return;
        app.mark('align center horizontal');
        app.alignShapes('center-horizontal', app.selectedIds);
    }, [app]);
    const handleAlignRight = useCallback(() => {
        if (!app || app.currentToolId !== 'select') return;
        app.mark('align right');
        app.alignShapes('right', app.selectedIds);
    }, [app]);
    const handleAlignTop = useCallback(() => {
        if (!app || app.currentToolId !== 'select') return;
        app.mark('align top');
        app.alignShapes('top', app.selectedIds);
    }, [app]);
    const handleAlignVertically = useCallback(() => {
        if (!app || app.currentToolId !== 'select') return;
        app.mark('align center vertical');
        app.alignShapes('center-vertical', app.selectedIds);
    }, [app]);
    const handleAlignBottom = useCallback(() => {
        if (!app || app.currentToolId !== 'select') return;
        app.mark('align bottom');
        app.alignShapes('bottom', app.selectedIds);
    }, [app]);
    const handleDistributeHorizontally = useCallback(() => {
        if (!app || app.currentToolId !== 'select') return;
        app.mark('distribute horizontal');
        app.distributeShapes('horizontal', app.selectedIds);
    }, [app]);
    const handleDistributeVertically = useCallback(() => {
        if (!app || app.currentToolId !== 'select') return;
        app.mark('distribute vertical');
        app.distributeShapes('vertical', app.selectedIds);
    }, [app]);

    return (
        <Menu>
            <li>
                <MenuButton
                    type="button"
                    data-tooltip={game.i18n.localize('JW.ShowGrid')}
                    onClick={handleShowGrid}
                    active={isGridMode}
                >
                    <i className="fa-solid fa-grid"></i>
                </MenuButton>
            </li>
            <li>
                <MenuButton
                    type="button"
                    data-tooltip={game.i18n.localize('JW.AlignLeft')}
                    onClick={handleAlignLeft}
                >
                    <i className="fa-solid fa-objects-align-left"></i>
                </MenuButton>
            </li>
            <li>
                <MenuButton
                    type="button"
                    data-tooltip={game.i18n.localize('JW.AlignHorizontally')}
                    onClick={handleAlignHorizontally}
                >
                    <i className="fa-solid fa-objects-align-center-horizontal"></i>
                </MenuButton>
            </li>
            <li>
                <MenuButton
                    type="button"
                    data-tooltip={game.i18n.localize('JW.AlignRight')}
                    onClick={handleAlignRight}
                >
                    <i className="fa-solid fa-objects-align-right"></i>
                </MenuButton>
            </li>
            <li>
                <MenuButton
                    type="button"
                    data-tooltip={game.i18n.localize('JW.AlignTop')}
                    onClick={handleAlignTop}
                >
                    <i className="fa-solid fa-objects-align-top"></i>
                </MenuButton>
            </li>
            <li>
                <MenuButton
                    type="button"
                    data-tooltip={game.i18n.localize('JW.AlignVertically')}
                    onClick={handleAlignVertically}
                >
                    <i className="fa-solid fa-objects-align-center-vertical"></i>
                </MenuButton>
            </li>
            <li>
                <MenuButton
                    type="button"
                    data-tooltip={game.i18n.localize('JW.AlignBottom')}
                    onClick={handleAlignBottom}
                >
                    <i className="fa-solid fa-objects-align-bottom"></i>
                </MenuButton>
            </li>
            <li>
                <MenuButton
                    type="button"
                    data-tooltip={game.i18n.localize('JW.DistributeHorizontally')}
                    onClick={handleDistributeHorizontally}
                >
                    <i className="fa-solid fa-distribute-spacing-horizontal"></i>
                </MenuButton>
            </li>
            <li>
                <MenuButton
                    type="button"
                    data-tooltip={game.i18n.localize('JW.DistributeVertically')}
                    onClick={handleDistributeVertically}
                >
                    <i className="fa-solid fa-distribute-spacing-vertical"></i>
                </MenuButton>
            </li>
            <li>
                <MenuButton
                    type="button"
                    data-tooltip={game.i18n.localize('Duplicate')}
                    onClick={handleDuplicate}
                >
                    <i className="fa-solid fa-clone"></i>
                </MenuButton>
            </li>
            <li>
                <MenuButton
                    type="button"
                    data-tooltip={game.i18n.localize('Save Changes')}
                    onClick={handleSave}
                >
                    <i className="fa-solid fa-save"></i>
                </MenuButton>
            </li>
            <ConcurrentUsers />
        </Menu>
    );
};

const Menu = styled.menu`
    display: flex;
    margin: 0;
    padding: 2px 8px;
    background: rgba(0, 0, 0, 0.1);
    flex-wrap: wrap;
    flex: none;
    list-style: none;

    & > li {
        margin: 6px 2px;
    }
    /* height: 42px; */
`;

const MenuButton = styled.button`
    background: transparent;
    cursor: pointer;
    padding: 0 5px;
    margin: 0 1px;
    line-height: 26px;
    border: none;
    border-radius: 4px;
    font-size: 0.875rem;
    font-family: 'Signika', sans-serif;
    width: 100%;
    box-sizing: border-box;
    ${props =>
        props.active &&
        css`
            box-shadow: none;
            background: #f0f0e0;
            color: black;
        `}

    &:hover {
        box-shadow: none;
        background: #f0f0e0;
        color: black;
    }

    i {
        margin: 0;
        font-size: 14px;
    }
`;
