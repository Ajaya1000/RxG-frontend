import React, { useEffect, useRef, useState } from 'react';

import { useHistory, useLocation } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import Game from '../component/game.component';
import Lobby from '../component/lobby.component';

const ENDPOINT = 'http://127.0.0.1:4000';

const useQuery = () => new URLSearchParams(useLocation().search);

const Entry = () => {
    const [isGameStarted, setGameStarted] = useState(false);
    const socket = useRef(socketIOClient(ENDPOINT)).current;
    const history = useHistory();

    useEffect(() => {
        // if (history.location.state === undefined) history.replace('/');

        const historyState = history.location.state;
        console.log(historyState);

        socket.emit('joinRoom', historyState);

        socket.on('error', (e) => {
            console.log('error', e);
            if (e.type === 'sessionError')
                history.push('/', {
                    error: e.val,
                });
        });

        socket.on('readytoStartGame', () => setGameStarted(true));

        return () => socket.disconnect();
    }, []);

    const handleLeave = () => {
        history.push('/');
    };
    const handleLeaveGame = () => {
        setGameStarted(false);
        socket.emit('exitGame', history.location.state.room);
    };

    return (
        <>
            {isGameStarted && (
                <Game
                    socket={socket}
                    roomCode={history.location.state.room}
                    requestLeaveGame={() => handleLeaveGame()}
                />
            )}
            {!isGameStarted && (
                <Lobby
                    socket={socket}
                    roomCode={history.location.state.room}
                    requestLeave={() => handleLeave()}
                />
            )}
        </>
    );
};
export default Entry;
