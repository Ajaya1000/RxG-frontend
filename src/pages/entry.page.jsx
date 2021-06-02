import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import Game from '../component/game.component';
import Lobby from '../component/lobby.component';

const ENDPOINT = 'http://127.0.0.1:4000';

const useQuery = () => new URLSearchParams(useLocation().search);

const Entry = () => {
    const [isGameStarted, setGameStarted] = useState(true);
    const socket = useRef(socketIOClient(ENDPOINT)).current;
    const history = useHistory();

    useEffect(() => {
        // if (history.location.state === undefined) history.replace('/');

        const historyState = history.location.state;

        socket.emit('joinRoom', historyState);

        socket.on('error', (e) => {
            if (e.type === 'sessionError')
                history.push('/', {
                    error: e.val,
                });
        });

        socket.on('startGame', () => setGameStarted(true));

        return () => socket.disconnect();
    }, []);

    return (
        <>
            {isGameStarted && <Game socket={socket} />}
            {!isGameStarted && <Lobby socket={socket} />}
        </>
    );
};
export default Entry;
