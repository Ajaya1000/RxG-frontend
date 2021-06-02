import React, { useEffect, useState } from 'react';
import {
    Button,
    Container,
    Grid,
    makeStyles,
    Typography,
} from '@material-ui/core';

const useStyle = makeStyles({
    root: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '90%',
        height: '90%',
    },
    activeStatusIcon: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: 'green',
    },
    inActiveStatusIcon: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: 'red',
    },
    userContainer: {},
    userItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
});

const StatusIcon = ({ status }) => {
    const classes = useStyle();

    return (
        <span
            className={
                status === 'ready'
                    ? classes.activeStatusIcon
                    : classes.inActiveStatusIcon
            }
        />
    );
};

const Leaderboard = ({ data }) => <div>Leaderboard</div>;

const Lobby = ({ socket }) => {
    const classes = useStyle();

    const [room, setRoom] = useState();
    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {
        socket.on('update', (data) => {
            setRoom(data);
        });

        socket.on('currentUser', (data) => {
            setCurrentUser(data);
        });

        return () => {
            socket.off('update');
            socket.off('currentUser');
        };
    }, []);

    const startGame = () => {
        socket.emit('readytoStartGame');
    };

    const handleLeaveRoom = () => {};

    return (
        <Container className={classes.root}>
            <Grid container className={classes.content}>
                <Grid container item xs={12}>
                    <Grid item xs={6}>
                        <Typography>Room Code : {room?.code}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant='contained'
                            color='secondary'
                            onClick={() => handleLeaveRoom()}
                        >
                            Leave Room
                        </Button>
                    </Grid>
                </Grid>
                <Grid container item xs={12}>
                    <Grid sm={0} md={4} />
                    <Grid sm={12} md={4}>
                        <div className={classes.userContainer}>
                            {room &&
                                room.users.map((user) => (
                                    <div key={user.socketId}>
                                        <StatusIcon status={user.status} />
                                        <Typography> {user.name}</Typography>
                                        <Typography>{user.status}</Typography>
                                    </div>
                                ))}
                        </div>
                        <div>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={() => startGame()}
                            >
                                {currentUser?.isAdmin ? 'Start Game' : 'Ready'}
                            </Button>
                        </div>
                    </Grid>
                    <Grid sm={12} md={4} className={classes.leaderboardGrid}>
                        <Leaderboard data={room?.leaderboard} />
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};
export default Lobby;
