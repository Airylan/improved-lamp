import React from 'react';
import { Paper, Typography, Box } from '@material-ui/core';
import { useStats } from './character';


export function DerivedStatsPanel(props) {
    const [, { getStat, getRole }] = useStats();

    const body = getStat("BODY").value; //props.value.find(x => x.name === "BODY").value;
    const will = getStat("WILL").value; // props.value.find(x => x.name === "WILL").value;
    const emp = getStat("EMP").value; //props.value.find(x => x.name === "EMP").value;
    const hp = 10 + (5 * Math.ceil((body + will) / 2));
    const swt = Math.ceil(hp / 2);
    const ds = body;
    const hum = 10 * emp;
    const role = getRole();

    return (<Box maxWidth="50%">
        <Typography variant="subtitle1">Derived Values</Typography>
        <Paper>
            <Typography variant="body2">Role: {role}</Typography>
            <Typography variant="body2">HP: {hp}</Typography>
            <Typography variant="body2">Serious Wound Threshold: {swt}</Typography>
            <Typography variant="body2">Death Save {ds}</Typography>
            <Typography variant="body2">Humanity: {hum}</Typography>
        </Paper>
    </Box>);
}
