import React, { useState, useMemo } from 'react';
import { AccordionDetails, AccordionSummary, Typography, Grid, Paper, Divider, Accordion, Box } from '@material-ui/core';
import { NumericValue } from './NumericValue';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

function getSkillPoints(list) {
    return list.reduce((current, next) => current + (((next?.double ?? "") === "") ? 1 : 2) * (next.value - ((next.granted)? next.granted : 0)), 0);
}

function getGrantedSkillPoints(list) {
    return list.reduce((current, next) => current + ((next.granted) ? next.granted : 0), 0);
}

function SkillListPanel(props) {
}

function SkillGroupPanel(props) {
    const { group, items, skillGroupExpansion, handleExpansionChange, updateSkill } = { ...props };
    const skillPoints = useMemo(() => getSkillPoints(items), [items]);
    const grantedSkillPoints = useMemo(() => getGrantedSkillPoints(items), [items]);
    const basedOnValue = (basedOn) => useMemo(() => props.character.stats.find(x => x.name === basedOn).value, [basedOn, props.character.stats]);
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
                        onChange={(e) => updateSkill(skill.name, e.target.value)}
                        bold={skill.basic}
                    /></Grid>
                    )}
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
}

function SkillGroupsPanel(props) {

    function updateSkill(name, value) {
        const toUpdate = props.character.skills.map(x => (x.name === name) ? { ...x, "value": +value } : x);
        props.onUpdate(toUpdate);
    }

    const skillGroups = props.character.skills.reduce((groups, item) => ({
        ...groups,
        [item.category]: [...(groups[item.category] || []), item]
    }), {});

    const [skillGroupExpansion, setSkillGroupExpansion] = useState(null);
    const handleExpansionChange = (group) => (event, isExpanded) => {
        setSkillGroupExpansion(isExpanded ? group : false)
    };

    return Object.entries(skillGroups).map(([group, items]) =>
        <SkillGroupPanel character={props.character} group={group} items={items} skillGroupExpansion={skillGroupExpansion} handleExpansionChange={handleExpansionChange} updateSkill={updateSkill} />
    );

}

export function SkillsPanel(props) {

    const skillPoints = useMemo(() => getSkillPoints(props.character.skills));

    return (<Box maxWidth="50%">
        <Grid container>
            <Grid item xs={11}><Typography variant="subtitle1">Character Skills</Typography></Grid>
            <Grid item><Typography variant="body2">{skillPoints}/{props.maxSkills}</Typography></Grid>
        </Grid>
        <Paper><div><SkillGroupsPanel {...props} /></div></Paper>
    </Box>);
}
