import React, { useEffect, useState } from 'react';
import {
    Button,
    Container,
    FormControlLabel,
    Grid,
    makeStyles,
    Paper,
    Radio,
    RadioGroup,
    Typography,
    Snackbar,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

const useStyle = makeStyles({
    root: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '30vw',
        height: '30vw',
        maxWidth: 200,
        maxHeight: 200,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    selectedCard: {
        width: '30vw',
        height: '30vw',
        maxWidth: 200,
        maxHeight: 200,
        cursor: 'pointer',
        boxShadow: '19px 24px 23px rgba(40, 152, 234, 0.25)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    greenCard: {
        width: '30vw',
        height: '30vw',
        maxWidth: 200,
        maxHeight: 200,
        cursor: 'pointer',
        backgroundColor: '#46A661',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    gridContainer: {
        width: '100%',
        height: '97%',
        marginTop: '3%',
    },
    cardContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    paper: {
        width: '100%',
        height: '100%',
        maxWidth: 900,
        maxHeight: 700,
    },
    paperTextWhite: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 600,
    },
    paperTextBlack: {
        color: '#000',
        fontSize: 20,
        fontWeight: 600,
    },
    selectedRadioButton: {
        backgroundColor: '#1D54E1',
        margin: 2,
        borderRadius: 7,
        boxShadow: '7px 7px 32px 4px rgba(0, 0, 0, 0.25)',
        '&:hover': {
            backgroundColor: '#597acc',
        },
    },
    unSelectedRadioButton: {
        backgroundColor: '#090808',
        margin: 2,
        borderRadius: 7,
        '&:hover': {
            backgroundColor: '#595959',
        },
    },
    radioButtonText: {
        color: '#fff',
    },
    bottomContainer: {
        marginTop: 30,
    },
    leaveButtonGrid: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const Alert = (props) => <MuiAlert elevation={6} variant='filled' {...props} />;

const RevealCard = ({ value, onClick, isSelected }) => {
    const classes = useStyle();

    return (
        <Paper
            className={
                // eslint-disable-next-line no-nested-ternary
                value !== '?'
                    ? classes.greenCard
                    : isSelected
                    ? classes.selectedCard
                    : classes.card
            }
            onClick={onClick}
        >
            <Typography
                className={
                    value !== '?'
                        ? classes.paperTextWhite
                        : classes.paperTextBlack
                }
            >
                {value}
            </Typography>
        </Paper>
    );
};

const CustomRadioButtons = ({ dataList, value, onChange }) => {
    const classes = useStyle();

    return (
        <div>
            {dataList?.map((item, index) => (
                <Button
                    className={
                        index + 1 === value
                            ? classes.selectedRadioButton
                            : classes.unSelectedRadioButton
                    }
                    onClick={() => onChange(index + 1)}
                >
                    <Typography className={classes.radioButtonText}>
                        {index + 1}
                    </Typography>
                </Button>
            ))}
        </div>
    );
};

const Game = ({ socket, roomCode, requestLeaveGame }) => {
    const [currentUser, setCurrentUser] = useState();
    const [selectedCard, setSelectedCard] = useState(0);
    const [value, setValue] = useState(1);
    const [openToast, setOpenToast] = useState(false);

    const [errorText, setErrorText] = useState('');
    const [severity, setSeverity] = useState('error');

    useEffect(() => {
        socket.on('currentUser', (data) => {
            console.log('current User', data);
            setCurrentUser(data);
            if (data.log.length > 0) {
                if (data.log[data.log.length - 1].result === 0) {
                    setErrorText('Hurray! You got it right');
                    setSeverity('success');
                } else {
                    setErrorText(
                        `Sorry! Card ${
                            data.log[data.log.length - 1].value
                        } is in ${
                            data.log[data.log.length - 1].result === 1
                                ? 'right'
                                : 'left'
                        } of the current card`
                    );
                    setSeverity('error');
                }
                setOpenToast(true);
            }
        });

        return () => {
            socket.off('currentUser');
        };
    }, []);

    const classes = useStyle();

    const giveCardCount = (n) => {
        if (n === 0) return 3;
        return 5;
    };

    const requestGuess = () => {
        socket.emit('move', { room: roomCode, index: selectedCard, value });
    };

    return (
        <Container className={classes.root}>
            <Snackbar
                open={openToast}
                autoHideDuration={6000}
                onClose={() => setOpenToast(false)}
                anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
            >
                <Alert onClose={() => setOpenToast(false)} severity={severity}>
                    {errorText}
                </Alert>
            </Snackbar>
            <Grid container className={classes.gridContainer}>
                <Grid item xs={12}>
                    <Typography style={{ textAlign: 'end' }}>
                        Remianing Moves: {currentUser?.remainingMove}
                    </Typography>
                </Grid>
                <Grid item xs={12} className={classes.cardContainer}>
                    {currentUser?.answer.map((item, index) => (
                        <RevealCard
                            // eslint-disable-next-line react/no-array-index-key
                            key={index}
                            value={item}
                            onClick={() => setSelectedCard(index)}
                            isSelected={index === selectedCard}
                        />
                    ))}
                </Grid>
                <Grid
                    container
                    item
                    xs={12}
                    className={classes.bottomContainer}
                >
                    <Grid
                        container
                        item
                        xs={12}
                        md={4}
                        justify='center'
                        alignItems='center'
                    >
                        <Typography style={{ textAlign: 'center' }}>
                            Select the value for card {selectedCard + 1}
                        </Typography>
                    </Grid>
                    <Grid
                        container
                        item
                        xs={12}
                        md={4}
                        justify='center'
                        alignItems='center'
                    >
                        <CustomRadioButtons
                            dataList={currentUser?.answer}
                            value={value}
                            onChange={(val) => setValue(val)}
                        />
                    </Grid>
                    <Grid
                        container
                        item
                        xs={12}
                        md={4}
                        justify='center'
                        alignItems='center'
                    >
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={() => requestGuess()}
                        >
                            Guess
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={12} className={classes.leaveButtonGrid}>
                    <Button
                        variant='contained'
                        color='secondary'
                        onClick={() => requestLeaveGame()}
                    >
                        Leave
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Game;
