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
} from '@material-ui/core';
import clsx from 'clsx';

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
        width: 200,
        height: 200,
    },
    selectedCard: {},
    greenCard: {},
    gridContainer: {
        width: '100%',
        height: '100%',
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
});

const RevealCard = ({ value, onClick, isSelected }) => {
    const classes = useState();

    const paperClassName = clsx(
        classes.card,
        isSelected ? classes.selectedCard : null,
        value !== '?' ? classes.greenCard : null
    );
    const paperTextClassName = clsx(
        value !== '?' ? classes.paperTextWhite : classes.paperTextBlack
    );

    return (
        <Paper className={paperClassName} onClick={onClick}>
            <Typography className={paperTextClassName}>{value}</Typography>
        </Paper>
    );
};

const CustomRadioButtons = ({ value, onChange }) => {
    const array = new Array(5);
    const classes = useStyle();

    return (
        <div>
            {array.map((item, index) => (
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

const Game = ({ socket }) => {
    const [currentUser, setCurrentUser] = useState();
    const [selectedCard, setSelectedCard] = useState(0);
    const [value, setValue] = useState(1);

    useEffect(() => {
        socket.on('currentUser', (data) => {
            setCurrentUser(data);
        });

        return socket.off('currentUser');
    }, []);

    const classes = useStyle();

    const giveCardCount = (n) => {
        if (n === 0) return 3;
        return 5;
    };

    const requestGuess = () => {
        socket.emit('move', { index: selectedCard, value });
    };

    return (
        <Container className={classes.root}>
            <Grid container className={classes.gridContainer}>
                <Grid item xs={12}>
                    <Typography>
                        Remianing Moves: {currentUser?.remainingMoves}
                    </Typography>
                </Grid>
                <Grid item xs={12} className={classes.cardContainer}>
                    {currentUser?.answer.map((item, index) => (
                        <RevealCard
                            value={item}
                            onClick={() => setSelectedCard(index)}
                            isSelected={index === selectedCard}
                        />
                    ))}
                </Grid>
                <Grid container item xs={12}>
                    <Grid item sm={12} md={4}>
                        <Typography>
                            Select the value for card {selectedCard + 1}
                        </Typography>
                    </Grid>
                    <Grid item sm={12} md={4}>
                        <CustomRadioButtons
                            value={value}
                            onChange={(val) => setValue(val)}
                        />
                    </Grid>
                    <Grid item sm={12} md={4}>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={() => requestGuess()}
                        >
                            Guess
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Game;
