﻿import React, { useState } from 'react';
import { AccordionDetails, AccordionSummary, Typography, Grid, Paper, Accordion, Box } from '@material-ui/core';
import { NumericValue } from './NumericValue';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useSkills, useCharacter } from './character';

function SkillGroupPanel(props) {
    const [, { getStat, setSkill, getSkillPoints, getGrantedSkillPoints }] = useCharacter();
    const { group, items, skillGroupExpansion, handleExpansionChange } = { ...props };
    const skillPoints = getSkillPoints(items);
    const grantedSkillPoints = getGrantedSkillPoints(items);
    const basedOnValue = (basedOn) => getStat(basedOn).value;
    return (
        <Accordion
            expanded={skillGroupExpansion === group}
            onChange={handleExpansionChange(group)}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container spacing={1}>
                    <Grid item xs={4}><Typography variant="subtitle2">{group}</Typography></Grid>
                    <Grid item xs={2}><Typography variant="body2">{items.length} skills</Typography></Grid>
                    <Grid item><Typography variant="body2">{skillPoints} skill points {(grantedSkillPoints > 0) && `(+ ${grantedSkillPoints} granted)`}</Typography></Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container>
                    {items.map((skill) => <Grid item xs={12}><NumericValue
                        label={skill.name + ((skill.double) ? " (x2)" : "")}
                        value={skill.value}
                        min={(skill.basic) ? 2 : (skill.granted) ? skill.granted : 0}
                        max={6}
                        basedOnLabel={skill.basedOn}
                        basedOn={basedOnValue(skill.basedOn)}
                        onChange={(e) => setSkill(skill.name, e.target.value)}
                        bold={skill.basic}
                    /></Grid>
                    )}
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
}

function SkillGroupsPanel() {
    const [skills] = useSkills();

    const skillGroups = skills.reduce((groups, item) => ({
        ...groups,
        [item.category]: [...(groups[item.category] || []), item]
    }), {});

    const [skillGroupExpansion, setSkillGroupExpansion] = useState(null);
    const handleExpansionChange = (group) => (event, isExpanded) => {
        setSkillGroupExpansion(isExpanded ? group : false)
    };

    return Object.entries(skillGroups).map(([group, items]) =>
        <SkillGroupPanel
            group={group}
            items={items}
            skillGroupExpansion={skillGroupExpansion}
            handleExpansionChange={handleExpansionChange}
        />
    );

}

export function SkillsPanel(props) {
    const [, { getSkillPoints }] = useSkills();

    const skillPoints = getSkillPoints();

    return (<Box maxWidth="50%">
        <Grid container>
            <Grid item xs={11}><Typography variant="subtitle1">Character Skills</Typography></Grid>
            <Grid item><Typography variant="body2">{skillPoints}/{props.maxSkills}</Typography></Grid>
        </Grid>
        <Paper><div><SkillGroupsPanel {...props} /></div></Paper>
    </Box>);
}
