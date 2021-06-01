import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import socketIOClient from 'socket.io-client';

const ENDPOINT = 'http://127.0.0.1:4000';

const useQuery = () => new URLSearchParams(useLocation().search);

const Entry = () => {
    const [isGame, setGame] = useState(false);
    const query = useQuery();
    const history = useHistory();

    useEffect(() => {
        if (history.location.state === undefined) history.replace('/');

        const socket = socketIOClient(ENDPOINT);

        const data = history.location.state;

        socket.emit('joinRoom', data);

        socket.on('joined', (room) => {
            console.log(room);
        });

        socket.on('error', (val) => {
            console.log(val);
            history.push('/', {
                error: val,
            });
        });

        return () => socket.disconnect();
    }, []);

    return <div>Entry page</div>;
};
export default Entry;
