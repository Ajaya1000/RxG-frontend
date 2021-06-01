import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import Lobby from '../component/lobby.component';

const ENDPOINT = 'http://127.0.0.1:4000';

const useQuery = () => new URLSearchParams(useLocation().search);

const Entry = () => {
    const [isGame, setGame] = useState(false);
    const [data, setData] = useState({});
    const socket = useRef(socketIOClient(ENDPOINT)).current;
    const [currentUser, setcurrentUser] = useState({});
    const query = useQuery();
    const history = useHistory();

    useEffect(() => {
        if (history.location.state === undefined) history.replace('/');
        console.log(socket);
        const historyState = history.location.state;

        socket.emit('joinRoom', historyState);

        socket.on('joined', (room) => {
            console.log(room);

            setData(room);
        });

        socket.on('currentUser', (user) => {
            setcurrentUser(user);
            console.log(user);
        });

        socket.on('error', (val) => {
            console.log(val);
            history.push('/', {
                error: val,
            });
        });

        return () => socket.disconnect();
    }, []);

    return (
        <Lobby
            users={data.users}
            isAdmin={currentUser && currentUser.isAdmin}
        />
    );
};
export default Entry;
