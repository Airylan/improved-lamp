import React from 'react';
import Button from '@material-ui/core/Button';
import { LifepathStage } from './LifepathStage';
import { LifepathRoller } from './LifepathRoller';
import { saveAs } from 'file-saver';
import Stepper from '@material-ui/core/Stepper';

export default class Lifepath extends React.Component {
    constructor(props) {
        super(props);
        this.handleStageCompleted = this.handleStageCompleted.bind(this);
        this.resetLifepath = this.resetLifepath.bind(this);
        this.handleStageValueChanged = this.handleStageValueChanged.bind(this);
        this.rollAll = this.rollAll.bind(this);
        this.export = this.export.bind(this);
        this.handleBack = this.handleBack.bind(this);

        //this.state = {
        //    stages: stages["General"],
        //    roleStages: [],
        //    results: {},
        //    onStage: 0
        //}
    }

    rollAll() {
        // TODO: this should handle "then" properties.
        const roller = new LifepathRoller;
        let values = {};
        this.props.lifepath.stages.forEach((stage) => values[stage.title] = roller.handleRoll(stage));
        let roleStages = this.props.loadRole(values["Role"]); // this should really look for "loadAdditional".
        roleStages.forEach((stage) => values[stage.title] = roller.handleRoll(stage));
        this.set({
            results: values,
            roleStages: roleStages,
            onStage: this.props.lifepath.stages.length + roleStages.length + 1
        });
    }

    handleStageValueChanged(key, value) {
        let values = { ...this.props.lifepath.results };
        values[key] = value;
        if ((this.props.lifepath.stages?.[this.props.lifepath.stages.findIndex(item => item.title === key)]?.["loadAdditional"] ?? "") == "true") {
            this.set({ roleStages: this.props.loadRole(value[0]), results: values });
        }
        else {
            this.set(
                {
                    results: values
                }
            );
        }
    }

    handleBack(key, next) {
        if ((next ?? "") === "") {
            this.set({
                onStage: Math.max(0, key - 1)
            });
        }
        else {
            let value = this.props.lifepath.stages.findIndex(item => item.title === next);
            if (!value) {
                value = this.props.lifepath.roleStages.findIndex(item => item.title === next);
            }
            this.set({
                onStage: value
            });
        }
    }

    handleStageCompleted(key, next) {
        if ((next ?? "") === "") {
            this.set({
                onStage: Math.max(0, key + 1)
            });
        }
        else {
            let value = this.props.lifepath.stages.findIndex(item => item.title === next);
            if (value === -1) {
                value = this.props.lifepath.roleStages.findIndex(item => item.title === next) + this.props.lifepath.stages.length;
            }
            this.set({
                onStage: value
            });
        }
    }

    set(values) {
        // Need Object.assign here otherwise we get a {values: values} property added to the object, which isn't what we want here.
        this.props.onUpdate(Object.assign({ ...this.props.lifepath }, values ));
    }

    resetLifepath() {
        this.props.resetLifepath();
    }

    export() {
        const resultString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.props.lifepath.results));
        saveAs(resultString, 'results.json');
    }

    render() {
        const roller = new LifepathRoller;
        const generalStageCount = this.props.lifepath.stages.length;
        // TODO: need to figure out visibility of "skipped" stages due to "then" properties.
        const stages = this.props.lifepath.stages.map(
            (stage, index) =>
                <LifepathStage
                    stageNumber={index}
                    key={stage.title}
                    visible={this.props.lifepath.onStage >= index}
                    stage={stage}
                    stageValueChanged={this.handleStageValueChanged}
                    value={this.props.lifepath.results[stage.title] ?? ""}
                    asStepper="true"
                    stageCompleted={this.handleStageCompleted}
                    handleRoll={roller.handleRoll}
                    handleBack={this.handleBack}
                />
        );
        const roleStages = this.props.lifepath.roleStages.map(
            (stage, index) =>
                <LifepathStage
                    stageNumber={index + generalStageCount}
                    key={stage.title}
                    visible={this.props.lifepath.onStage >= (index + generalStageCount)}
                    stage={stage}
                    stageValueChanged={this.handleStageValueChanged}
                    value={this.props.lifepath.results[stage.title] ?? ""}
                    asStepper="true"
                    stageCompleted={this.handleStageCompleted}
                    handleRoll={roller.handleRoll}
                    handleBack={this.handleBack}
                />
        );
        // <Button variant="contained" color="secondary" onClick={this.export} disabled={(this.props.lifepath.results.length <= 0)}>Export</Button>
        return (
            <div class="lifepath">
                <Button variant="contained" color="secondary" onClick={this.resetLifepath}>Reset</Button>
                <Button variant="contained" color="primary" onClick={this.rollAll}>Roll All</Button>
                <Stepper activeStep={this.props.lifepath.onStage} orientation="vertical">{stages}{roleStages}</Stepper>
            </div>
        );
    }
}