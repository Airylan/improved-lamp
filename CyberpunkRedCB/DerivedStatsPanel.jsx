import React from 'react';
import { Paper, Typography, Divider, Box } from '@material-ui/core';


export function DerivedStatsPanel(props) {
    const body = props.value.find(x => x.name === "BODY").value;
    const will = props.value.find(x => x.name === "WILL").value;
    const emp = props.value.find(x => x.name === "EMP").value;
    const hp = 10 + (5 * Math.ceil((body + will) / 2));
    const swt = Math.ceil(hp / 2);
    const ds = body;
    const hum = 10 * emp;
    return (<Box maxWidth="50%">
        <Typography variant="subtitle1">Derived Values</Typography>
        <Paper>
        <Typography variant="body2">HP: {hp}</Typography>
        <Typography variant="body2">Serious Wound Threshold: {swt}</Typography>
        <Typography variant="body2">Death Save {ds}</Typography>
        <Typography variant="body2">Humanity: {hum}</Typography>
    </Paper></Box>);
}
