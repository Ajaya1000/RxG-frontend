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
        width: 12,
        height: 12,
        borderRadius: '50%',
        backgroundColor: 'green',
        marginRight: 10,
    },
    inActiveStatusIcon: {
        width: 12,
        height: 12,
        borderRadius: '50%',
        backgroundColor: 'red',
        marginRight: 10,
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
    tableContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    table: {
        border: '1px solid #000',
    },
    tableRow: {
        // border: '1px solid #000'
    },
    tableHead: {
        border: '1px solid #000',
    },
    tableData: {
        border: '1px solid #000',
    },
});

const StatusIcon = ({ status }) => {
    const classes = useStyle();

    return (
        <div
            className={
                status === 'ready'
                    ? classes.activeStatusIcon
                    : classes.inActiveStatusIcon
            }
        />
    );
};

const Leaderboard = ({ data }) => {
    const classes = useStyle();

    const sortedData = (arr) => {
        arr.sort(
            (a, b) =>
                100 * (b.bestReveal - a.bestReveal) - (b.bestMove - a.bestMove)
        );
        console.log(
            '🚀 ~ file: lobby.component.jsx ~ line 84 ~ sortedData ~ arr',
            arr
        );
        return arr;
    };

    return (
        <div>
            <h2 style={{ textAlign: 'center' }}>Leader Board</h2>

            {data?.length > 0 ? (
                <div className={classes.tableContainer}>
                    <table className={classes.table}>
                        <tr className={classes.tableRow}>
                            <th className={classes.tableHead}> User</th>
                            <th className={classes.tableHead}>Best Reveal </th>
                            <th className={classes.tableHead}>Best Move</th>
                        </tr>

                        {sortedData([...data]).map((item) => (
                            <tr
                                className={classes.tableRow}
                                key={`${item.user}${item.bestReveal}${item.bestMove}`}
                            >
                                <td className={classes.tableData}>
                                    {item.user}
                                </td>
                                <td
                                    className={classes.tableData}
                                    style={{ marginLeft: 20 }}
                                >
                                    {item.bestReveal}
                                </td>
                                <td
                                    className={classes.tableData}
                                    style={{ marginLeft: 20 }}
                                >
                                    {item.bestMove}
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>
            ) : (
                <p
                    style={{
                        textAlign: 'center',
                        color: 'gray',
                        fontWeight: 'bold',
                        marginTop: 40,
                    }}
                >
                    Nothing to show
                </p>
            )}
        </div>
    );
};

const Lobby = ({ socket, roomCode, requestLeave }) => {
    console.log('roomcode', roomCode);
    const classes = useStyle();

    const [room, setRoom] = useState();
    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {
        console.log('use effect called', roomCode);
        socket.on('update', (data) => {
            setRoom(data);
            console.log('update', data);
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
        console.log('Start Game called', roomCode, currentUser);
        socket.emit('readytoStartGame', {
            room: roomCode,
            user: currentUser,
        });
    };

    return (
        <Container className={classes.root}>
            <Grid container className={classes.content}>
                <Grid container item xs={12}>
                    <Grid
                        item
                        xs={6}
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <h2>Room Code : {room?.code}</h2>
                    </Grid>
                    <Grid
                        item
                        xs={6}
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'end',
                        }}
                    >
                        <Button
                            variant='contained'
                            color='secondary'
                            onClick={() => requestLeave()}
                        >
                            Leave Room
                        </Button>
                    </Grid>
                </Grid>
                <Grid container item xs={12} justify='center'>
                    <Grid item sm={12} md={4} />
                    <Grid item sm={12} md={4}>
                        <div className={classes.userContainer}>
                            {room &&
                                room.users.map((user) => (
                                    <div
                                        key={user.socketId}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <StatusIcon status={user.status} />
                                        <Typography style={{ marginRight: 40 }}>
                                            {user.name}
                                        </Typography>
                                        <Typography
                                            style={{
                                                fontStyle: 'italic',
                                            }}
                                        >
                                            {user.status}
                                        </Typography>
                                    </div>
                                ))}
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                marginTop: 30,
                            }}
                        >
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={() => startGame()}
                            >
                                {currentUser?.isAdmin ? 'Start Game' : 'Ready'}
                            </Button>
                        </div>
                    </Grid>
                    <Grid
                        item
                        sm={12}
                        md={4}
                        className={classes.leaderboardGrid}
                    >
                        <Leaderboard data={room?.leaderboard} />
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};
export default Lobby;
