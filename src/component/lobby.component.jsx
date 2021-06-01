import React from 'react';
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
        maxWidth: 600,
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

const StatusIcon = ({ isReady }) => {
    const classes = useStyle();

    return (
        <span
            className={
                isReady ? classes.activeStatusIcon : classes.inActiveStatusIcon
            }
        />
    );
};

const Lobby = ({ users, isAdmin }) => {
    const classes = useStyle();

    return (
        <Container className={classes.root}>
            <Grid container className={classes.content}>
                <Grid container item xs={12} className={classes.userContainer}>
                    {users &&
                        users.map((user) => (
                            <Grid
                                item
                                xs={12}
                                key={user.socketId}
                                className={classes.userItem}
                            >
                                <StatusIcon isReady={user.status} />
                                <Typography component='span'>
                                    {user.name}
                                </Typography>
                            </Grid>
                        ))}
                </Grid>
                <Grid item xs={12} className={classes.button}>
                    <Button variant='outlined' color='primary'>
                        {isAdmin ? 'Start Game' : 'Ready'}
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};
export default Lobby;
