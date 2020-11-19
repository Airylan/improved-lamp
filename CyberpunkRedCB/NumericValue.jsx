import React from 'react';
import { Typography } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { Grid } from '@material-ui/core';

export function NumericValue(props) {
    const min = props.min ?? 1;
    const max = props.max ?? 10;

    if ((props?.basedOn ?? "") !== "") {
        const { label, bold, ...p } = { ...props }; // TODO: figure out bold.
        return (
            <Grid container spacing={1}>
                <Grid item xs={4}><Typography variant="body2">{label}</Typography></Grid>
                <Grid item xs={2}><Typography variant="body2">{props.basedOnLabel} ({props.basedOn})</Typography></Grid>
                <Grid item xs={2}><TextField inputProps={{ step: 1, min: min, max: max, type: 'number' }} {...p} /></Grid>
                <Grid item xs={1}><Typography variant="body2"> = </Typography></Grid>
                <Grid item><Typography variant="body">{props.value + props.basedOn}</Typography></Grid>
            </Grid>
            );
    }
    else {
        return <TextField inputProps={{ step: 1, min: min, max: max, type: 'number' }} {...props} />;
    }
}
