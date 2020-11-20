import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import { useLifepath } from './character';

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

export const LifepathStage = (props) => {
    if (!props.visible) {
        return null;
    }

    const thisStageDefinition = props.stage;
    const title = thisStageDefinition.title;

    const [,
        {
            setLifepathStageValue,
            nextStage,
            previousStage,
            getStageResult,
            handleRoll
        }
    ] = useLifepath();

    const currentStageResult = getStageResult(thisStageDefinition.title);

    const stringify = (o) => {
            if (typeof o === "array" || Array.isArray(o)) {
                return o.map((result) => stringify(result)).join(". ");
            }
            if (typeof o === "object" && !(o instanceof String)) {
                let result = "";
                for (let prop in o) {
                    result += prop + ": " + o[prop] + "; ";
                }
                return result;
            }
            else return o;
    };
    return (
        <Step {...props}>
            <StepLabel>{title} {stringify(currentStageResult)}</StepLabel>
            <StepContent {...props}>
                <Button disabled={thisStageDefinition?.initialState === "true"} onClick={(e) => previousStage(title)}>Back</Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => setLifepathStageValue(title, handleRoll(title))}
                >Roll</Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={(e) => nextStage(title)}
                    disabled={(currentStageResult ?? "") == ""}
                >Next</Button>
                <p>{thisStageDefinition.description}</p>
                <LifepathDetailedResult value={currentStageResult} />
            </StepContent>
        </Step>
    );
};
