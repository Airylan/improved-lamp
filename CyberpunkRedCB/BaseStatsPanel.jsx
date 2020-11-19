import React from 'react';
import { NumericValue } from './NumericValue';
import { Grid, Paper, Typography, Box } from '@material-ui/core';
import { useStats } from './character';

export function BaseStatsPanel(props) {
    const [stats, { setStat, getStatPoints }] = useStats();

    const statPoints = getStatPoints();
    return (<Box maxWidth="50%">
        <Grid container>
            <Grid item xs={11}><Typography variant="subtitle1">Character Statistics</Typography></Grid>
            <Grid item><Typography variant="body2">{statPoints}/{props.maxStats}</Typography></Grid>
        </Grid>
        <Paper>
            <Grid container spacing={1}>
                    {stats.map((stat) =>
                        <Grid item>
                            <NumericValue
                                min={2}
                                max={8}
                                label={stat.name}
                                value={stat.value}
                                onChange={(e) => { setStat(stat.name, e.target.value); }}
                            />
                        </Grid>
                    )}
            </Grid>
        </Paper>
    </Box>);
}
