import React from 'react';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';

const classes = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    p: {
        fontSize: theme.typography.pxToRem(10),
        fontWeight: theme.typography.fontWeightRegular
    }
}));

class LifepathDetailedResult extends React.Component {
    constructor(props) {
        super(props);
        this.getRender = this.getRender.bind(this);
    }

    getRender(value) {
        if (typeof value === "array" || Array.isArray(value)) {
            const results = value.map((value) => this.getRender(value));
            return <div>{results}</div>;
        }
        else if (typeof value === "object" && !(value instanceof String)) {
            let objResults = [];
            for (let prop in value) {
                objResults.push(<div><Typography className={classes.heading}>{prop}</Typography>{this.getRender(value[prop])}</div>);
            }
            return <div>{objResults}</div>;
        }
        return <p>{value}</p>;
    }

    render() {
        return this.getRender(this.props.value);
    }
}

export class LifepathStage extends React.Component {
    constructor(props) {
        super(props);
        this.handleNext = this.handleNext.bind(this);
        this.handleRoll = this.handleRoll.bind(this);
        this.handleBack = this.handleBack.bind(this);
    }

    handleNext(e) {
        //this.props.stageCompleted(this.props.stageNumber);
        //return;

        // The following code has an error somewhere, and it might be in the handler.
        if (typeof this.props.stage["then"] === "undefined") {
            this.props.stageCompleted(this.props.stageNumber);
        }
        else if (typeof this.props.stage["then"] === "string" || this.props.stage["then"] instanceof String) {
            this.props.stageCompleted(this.props.stageNumber, this.props.stage["then"]);
        }
        else {
            this.props.stageCompleted(this.props.stageNumber, this.props.stage["then"][this.props.value]);
        }
    }

    handleBack(e) {
        this.props.handleBack(this.props.stageNumber);
    }

    stringify(o) {
        if (typeof o === "array" || Array.isArray(o)) {
            return o.map((result) => this.stringify(result)).join(". ");
        }
        if (typeof o === "object" && !(o instanceof String)) {
            let result = "";
            for (let prop in o) {
                result += prop + ": " + o[prop] + "; ";
            }
            return result;
        }
        else return o;
    }

    handleRoll(e) {
        const resultArray = this.props.handleRoll?.(this.props.stage) ?? ["None"];
        this.props.stageValueChanged?.(this.props.stage.title, resultArray);
    }

    render() {
        // TODO: what kind of UX do I want on this? None are great so far
        if (!this.props.visible) {
            return null;
        }

        if ((this.props.asStepper ?? "") == "true") {
            return (
                <Step>
                    <StepLabel>{this.props.stage.title} {this.stringify(this.props.value)}</StepLabel>
                    <StepContent {...this.props}>
                        <Button disabled={this.props.stageNumber === 0} onClick={this.handleBack}>Back</Button>
                        <Button variant="contained" color="primary" onClick={this.handleRoll}>Roll</Button>
                        <Button variant="contained" color="secondary" onClick={this.handleNext} disabled={(this.props?.value ?? "") == ""}>Next</Button>
                        <p>{this.props.stage.description}</p>
                        <LifepathDetailedResult value={this.props.value} />
                    </StepContent>
                </Step>
            );
        }

        if ((this.props.asAccordion ?? "") == "") {
            return (
                <div class="lifepathStage">
                    <h2>{this.props.stage.title}</h2>
                    <p>{this.props.stage.description}</p>
                    <p>Selected {this.props.value}</p>
                    <Button variant="contained" color="primary" onClick={this.handleRoll}>Roll</Button>
                    <Button variant="contained" color="primary" onClick={this.handleNext} disabled={(this.props?.value ?? "") == ""}>Next</Button>
                </div>
            );
        }

        return (
            <div>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>{this.props.stage.title} {this.stringify(this.props.value)}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div>
                            <p>{this.props.stage.description}</p>
                            <LifepathDetailedResult value={this.props.value} />
                        </div>
                    </AccordionDetails>
                </Accordion>
                <Button variant="contained" color="primary" onClick={this.handleRoll}>Roll</Button>
                <Button variant="contained" color="primary" onClick={this.handleNext} disabled={(this.props?.value ?? "") == ""}>Next</Button>
            </div>
        );
    }
}
