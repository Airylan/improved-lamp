import React, { useEffect, useState } from 'react';
var ReactDOM = require('react-dom');
import stages from './lifepathStages.json';
import { saveAs } from 'file-saver';

import { Lifepath } from './lifepath.jsx';
import { TabPanel } from './TabPanel';
import { CharacterStats } from './CharacterStats';
import { getCharacterSkeleton } from './getCharacterSkeleton';

import { TextField, Button, Tabs, Tab, AppBar, Grid } from '@material-ui/core';
import GoogleLoginButton from './GoogleLoginButton';

import { useDetails, useCharacterValues } from './character';

function BasicInformation(props) {
    // TODO: Expand this, but at least we have names.
    return <TextField label="Name" value={props.details.name} onChange={(e) => props.onUpdate({ ...props.details, "name": e.target.value })} />
}

function loadLifePath() {
    return {
        stages: stages["General"],
        results: {},
        roleStages: [],
        onStage: 0
    };
}

function handleSave(details, lifepath, character) {
    const savePacket = {
        details: details,
        lifepath: { results: lifepath.results, onStage: lifepath.onStage },
        character: character
    };
    const filename = ((details.name) ? details.name : "default") + ".json";
    const resultString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savePacket));
    saveAs(resultString, filename);
}

function handleUpload(setDetails, setLifepath, setCharacter) {
    return event => {
        const file = event.target.files[0];
        const fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onload = e => {
            const decoded = JSON.parse(e.target.result);

            const details = getDetailsSkeleton();
            const lifepath = loadLifePath();
            const character = getCharacterSkeleton();

            // Here, it's awkward to get the prop names so using Object.assign rather than the spread operator
            // (otherwise would need to have {...detailsSkeleton, details} for example, and I think this is slightly clearer)
            setDetails(Object.assign(details, decoded.details));
            setLifepath(Object.assign(lifepath, { roleStages: stages[decoded.lifepath.results.Role] }, decoded.lifepath));
            setCharacter(Object.assign(character, decoded.character));
        };
    }
}

function getDetailsSkeleton() {
    return { "name": "" };
}

function App(props) {
    const [activeTab, setActiveTab] = useState(0);
    //const [character, setCharacter] = useState(() => { return getCharacterSkeleton() });
    const [character, { setCharacter }] = useCharacterValues();
    const [lifepath, setLifepath] = useState(() => { return loadLifePath() });
    //const [details, setDetails] = useState(() => { return getDetailsSkeleton() });
    const [details, { setDetails }] = useDetails();

    useEffect(() => { document.title = "Cyberpunk RED Charcter " + (details?.name ?? "") }, [details?.name]);

    // Todo: 
    //  * additional character basic details (beyond just "name")
    //  * skill specialties
    //  * better skill display
    //  * have the login button in the AppBar
    //  * have a list of characters available and tied to login ID
    //  * use some GUID or something to have a character ID (implies having a "New Character" button)
    //  * ensure that login ID persists only where it needs to (figure out what that means for persistence to DB)
    //  * equipment tabs (equipment, fashion, cyberware) including displaying equipment mods
    //  * PDF export
    //  * Roll20 API export?
    //  * accessibility everywhere
    return (<div>
        <AppBar position="static">
            <Grid container>
                <Grid item>
                    <Tabs value={activeTab} onChange={(e, tab) => setActiveTab(tab)} aria-label="Character Generation Tabs">
                        <Tab label="Basic Information" />
                        <Tab label="Lifepath" />
                        <Tab label="Stats" />
                    </Tabs>
                </Grid>
                <Grid item>
                    <Button color="inherit" right onClick={(e) => handleSave(details, lifepath, character)}>Save</Button>
                    <input type="file" onChange={handleUpload(setDetails, setLifepath, setCharacter)} accept="application/json" style={{ display: "none" }} id="file-upload" />
                    <label htmlFor="file-upload">
                        <Button color="inherit" right component="span">Load</Button>
                    </label>
                </Grid>
            </Grid>
        </AppBar>
        <TabPanel value={activeTab} index={0}>
            <BasicInformation details={details} onUpdate={(details) => setDetails(details)} />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
            <Lifepath
                lifepath={lifepath}
                onUpdate={(lifepath) => setLifepath(lifepath)}
                resetLifepath={() => setLifepath(loadLifePath())}
                loadRole={(role) => { return stages[role] }}
            />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
            <CharacterStats character={character} onUpdate={(stats) => setCharacter(stats)} />
        </TabPanel>
        <GoogleLoginButton />
    </div>);
}

ReactDOM.render(<App />, document.querySelector('#root'));