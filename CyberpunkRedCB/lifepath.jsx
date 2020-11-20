import React from 'react';
import Button from '@material-ui/core/Button';
import { LifepathStage } from './LifepathStage';
import { LifepathRoller } from './LifepathRoller';
import { saveAs } from 'file-saver';
import Stepper from '@material-ui/core/Stepper';
import { useLifepath } from './character';

export function Lifepath(props) {
    const [lifepath, { setLifepath, resetLifepath, hasResult }] = useLifepath();

    const rollAll = () => {
        const roller = new LifepathRoller;
        while (!lifepathIsDone()) {
        }
    };

    const stages = lifepath.stages.map(
        (stage, index) =>
            <LifepathStage
                key={stage.title}
                active={(lifepath.currentStage === stage.title) || ((index === 0) && (lifepath.currentStage === "__start__"))}
                visible={true || (lifepath.currentStage === stage.title) || hasResult(stage.title)}
                stage={stage}
                asStepper="true"
            />
    );
    const roleStages = lifepath.roleStages.map(
        (stage) =>
            <LifepathStage
                key={stage.title}
                active={(lifepath.currentStage === stage.title)}
                visible={true || (lifepath.currentStage === stage.title) || hasResult(stage.title)}
                stage={stage}
                asStepper="true"
            />
    );
    return (
        <div class="lifepath">
            <Button variant="contained" color="secondary" onClick={resetLifepath}>Reset</Button>
            <Button variant="contained" color="primary" onClick={rollAll}>Roll All</Button>
            <Stepper activeStep={lifepath.currentStage} orientation="vertical">{stages}{roleStages}</Stepper>
        </div>
    );
}