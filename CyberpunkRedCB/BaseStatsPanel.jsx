import React from 'react';
import { NumericValue } from './NumericValue';
import { Grid, Divider, Paper, Typography, Box } from '@material-ui/core';


export function BaseStatsPanel(props) {

    function updateStat(name, value) {
        const toUpdate = props.value.map(x => (x.name === name) ? { "name": name, "value": +value } : x);
        props.onUpdate(toUpdate);
    }

    const statPoints = props.value.reduce((current, next) => current + next.value, 0);
    return (<Box maxWidth="50%">
        <Grid container>
            <Grid item xs={11}><Typography variant="subtitle1">Character Statistics</Typography></Grid>
            <Grid item><Typography variant="body2">{statPoints}/{props.maxStats}</Typography></Grid>
        </Grid>
        <Paper>
        <Grid container spacing={1}>
            {props.value.map((stat) => <Grid item><NumericValue min={2} max={8} label={stat.name} value={stat.value} onChange={(e) => { updateStat(stat.name, e.target.value); }} /></Grid>)}
        </Grid>
    </Paper></Box>);
}
