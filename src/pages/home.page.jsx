import React, { useState } from 'react';
import {
    Typography,
    Container,
    makeStyles,
    Paper,
    Grid,
    TextField,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import * as randomString from 'randomstring';
import {
    uniqueNamesGenerator,
    NumberDictionary,
    adjectives,
    names,
} from 'unique-names-generator';

const numberDictionary = NumberDictionary.generate({ min: 100, max: 999 });
const charDictionary = ['@', '#', '_'];

/**
 * Creates a random user name
 */
const giveRandomUserName = () =>
    uniqueNamesGenerator({
        dictionaries: [adjectives, names, charDictionary, numberDictionary],
        separator: '',
        style: 'capital',
        length: 4,
    });

/**
 * Creates a random 7 character sting code
 */
const giveRandomRoomCode = () =>
    randomString.generate({ length: 7, capitalization: 'uppercase' });

const useStyles = makeStyles({
    root: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paper: {
        width: '95%',
        maxWidth: 1200,
        padding: 50,
    },
    item: {
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'start',
    },
    inputGroup: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
        alignItems: 'center',
    },
    inputGroupCentered: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        padding: '0 10px',
    },
    button: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: '30px 10px',
    },
});

const Home = () => {
    const classes = useStyles();

    const [userName, setUserName] = useState(giveRandomUserName());

    const [existingRoomCode, setExistingRoomCode] = useState('');

    const [newRoomCode, setNewRoomCode] = useState(giveRandomRoomCode());

    const [level, setLevel] = useState(0);

    const history = useHistory();

    const requestJoin = () => {
        history.push('/game/', {
            type: 'join',
            username: userName,
            room: existingRoomCode,
        });
    };
    const requestCreate = () => {
        history.push('/game/', {
            type: 'create',
            username: userName,
            room: newRoomCode,
            level,
        });
    };

    return (
        <Container className={classes.root}>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid className={classes.item} item xs={12}>
                        <div
                            className={classes.inputGroupCentered}
                            component='div'
                        >
                            <Typography className={classes.label}>
                                User Name :
                            </Typography>
                            <TextField
                                variant='outlined'
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                    </Grid>

                    <Grid className={classes.item} item xs={12} md={6}>
                        <div
                            className={classes.inputGroupCentered}
                            component='div'
                        >
                            <Typography className={classes.label}>
                                Existing Room Code :
                            </Typography>
                            <TextField
                                variant='outlined'
                                value={existingRoomCode}
                                onChange={(e) =>
                                    setExistingRoomCode(e.target.value)
                                }
                            />
                        </div>
                        <div className={classes.button}>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={() => requestJoin()}
                            >
                                Join
                            </Button>
                        </div>
                    </Grid>
                    <Grid className={classes.item} item xs={12} md={6}>
                        <div
                            className={classes.inputGroupCentered}
                            component='div'
                        >
                            <Typography className={classes.label}>
                                New Room Code :
                            </Typography>
                            <TextField
                                variant='outlined'
                                value={newRoomCode}
                                onChange={(e) => setNewRoomCode(e.target.value)}
                            />
                        </div>
                        <div
                            className={classes.inputGroupCentered}
                            component='div'
                        >
                            <Typography className={classes.label}>
                                Level :
                            </Typography>
                            <RadioGroup
                                value={level}
                                onChange={(e) =>
                                    setLevel(parseInt(e.target.value, 10))
                                }
                            >
                                <FormControlLabel
                                    value={0}
                                    control={<Radio />}
                                    label='easy'
                                />
                                <FormControlLabel
                                    value={1}
                                    control={<Radio />}
                                    label='medium'
                                />
                                <FormControlLabel
                                    value={2}
                                    control={<Radio />}
                                    label='hard'
                                />
                            </RadioGroup>
                        </div>
                        <div className={classes.button}>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={() => requestCreate()}
                            >
                                Create
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default Home;
