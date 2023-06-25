import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useWhiteboard } from '../contexts/whiteboard.context';

export const WhiteboardMenu = () => {
    const { app, save } = useWhiteboard();
    const handleSave = useCallback(() => {
        save()
    }, [app]);

    return (
        <Menu>
            <li>
                <MenuButton type="button" data-tooltip="Save Changes" onClick={handleSave}>
                    <i className="fa-solid fa-save"></i>
                </MenuButton>
            </li>
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
