import React, { useEffect, useState } from 'react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from 'react-apollo';
import {
    Box,
    Collapse,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    CircularProgress,
} from '@material-ui/core';
import moment from 'moment';
import SnackMessage from './components/SnackMessage';
import { GET_CONFIRM_RESERVATION_FROM_CLIENT } from '../queries';

const useRowStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
    tableWrapper: {
        marginTop: theme.spacing(5),
    },
}));

function Row(props) {
    const { row } = props;
    const [open, setOpen] = useState(false);
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell align="center">
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" align="center">
                    {moment(row.createdAt).format('YYYY-MM-DD')}
                </TableCell>
                <TableCell align="center">{row.start}</TableCell>
                <TableCell align="center">{row.end}</TableCell>
                <TableCell align="center">{row.os}</TableCell>
                <TableCell align="center">
                    {row.applyOk === 0 ? (
                        <span style={{ color: 'crimson' }}>미승인</span>
                    ) : (
                        <span style={{ color: 'green' }}>승인</span>
                    )}
                </TableCell>
            </TableRow>
            {/* <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                상세 내역
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">날짜</TableCell>
                                        <TableCell align="center">이슈</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.history.map((historyRow, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell component="th" scope="row" align="center">
                                                {historyRow.date}
                                            </TableCell>
                                            <TableCell align="center">{historyRow.issue}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow> */}
        </React.Fragment>
    );
}

export default function ConfirmReservation() {
    const classes = useRowStyles();
    const [reservations, setConfirmReservation] = useState([]);
    const { loading, error, data } = useQuery(GET_CONFIRM_RESERVATION_FROM_CLIENT);

    useEffect(() => {
        if (data) {
            setConfirmReservation(
                data.getConfirmReservationFromClient.map((c) => {
                    return { ...c };
                }),
            );
        }
    }, [data, setConfirmReservation]);

    if (loading) return <CircularProgress />;
    if (error) return `${error}`;

    return (
        <TableContainer component={Paper} className={classes.tableWrapper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">상세내역</TableCell>
                        <TableCell align="center">예약 신청일</TableCell>
                        <TableCell align="center">시작일</TableCell>
                        <TableCell align="center">반납일</TableCell>
                        <TableCell align="center">OS</TableCell>
                        <TableCell align="center">승인여부</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reservations.map((row, idx) => (
                        <Row key={idx} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
