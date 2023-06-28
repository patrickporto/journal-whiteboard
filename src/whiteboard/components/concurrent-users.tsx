import React from 'react';
import styled from 'styled-components';
import { useWhiteboard } from '../contexts/whiteboard.context';

export const ConcurrentUsers = () => {
    const { concurrentUsers } = useWhiteboard();
    if (concurrentUsers.length < 2) {
        return null
    }
    return (
        <MenuItem data-tooltip={concurrentUsers.map(u => u.name).join(', ')}>
            <i className="fa-solid fa-user-group"></i>
            {concurrentUsers.map(user => (
                <ScenePlayer key={user.id} color={user.color}> {user.name?.[0]} </ScenePlayer>
            ))}
        </MenuItem>
    );
};

const MenuItem = styled.li`
    justify-content: center;
    align-items: center;
    padding: 0 6px;
    background: #d9d8c8;
    border: 1px solid #ff6400;
    border-radius: 3px;
    box-shadow: 0 0 4px #ff6400;
    display: flex;
`;

const ScenePlayer = styled.span`
    background: ${props => props.color};
    border: 1px solid ${props => props.color};
    width: 14px;
    height: 15px;
    border-radius: 50%;
    margin-right: -3px;
    line-height: 0.75rem;
    font-size: 0.625rem;
    text-align: center;
    color: black;
    font-weight: 700;
`;
