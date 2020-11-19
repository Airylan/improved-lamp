import React from 'react';
import { Grid } from '@material-ui/core';
import { BaseStatsPanel } from './BaseStatsPanel';
import { DerivedStatsPanel } from './DerivedStatsPanel';
import { SkillsPanel } from './SkillsPanel';

export function CharacterStats(props) {

    // TODO: I'm betting I probably want to have the totals calculate here and push down
    // as I've got the maxStats and maxSkills props here, and I want to ensure that the
    // total stat and skill points does not exceed the max values (in create mode)

    return (<Grid container spacing={1}>
        <Grid item xs={12}>
            <BaseStatsPanel
                value={props.character.stats}
                maxStats={props.character.maxStats}
                onUpdate={(stats) => props.onUpdate({ ...props.character, stats })} />
        </Grid>
        <Grid item xs={12}>
            <DerivedStatsPanel value={props.character.stats} />
        </Grid>
        <Grid item xs={12}>
            <SkillsPanel
                character={props.character}
                maxSkills={props.character.maxSkills}
                onUpdate={(skills) => props.onUpdate({ ...props.character, skills })} />
        </Grid>
    </Grid>);
}
