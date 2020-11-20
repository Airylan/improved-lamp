import { createStore, createHook } from 'react-sweet-state';
import { LifepathRoller } from './lifepathRoller';
import { characterSkeleton } from './getCharacterSkeleton';
import stages from './lifepathStages.json';

const replaceArrayValueByName = (list, value) => {
    return list.map(x => (x.name === value.name) ? value : x);
}

const getSkillPoints = (list) => {
    return list.reduce((current, next) => current + (((next?.double ?? "") === "") ? 1 : 2) * (next.value - ((next.granted) ? next.granted : 0)), 0);
}

const getGrantedSkillPoints = (list) => {
    return list.reduce((current, next) => current + ((next.granted) ? next.granted : 0), 0);
}

const valuesActions = {
    setCharacter: (character) => ({ setState }) => {
        setState({ character: character });
    },
    setSkill: (name, value) => ({ getState, setState }) => {
        const initial = getState();
        const skill = { ...initial.character.skills.find(x => x.name === name), value: +value };
        const modifiedSkills = replaceArrayValueByName(initial.character.skills, skill);
        const modifiedCharacter = {
            ...initial.character,
            skills: [...modifiedSkills]
        };
        setState({ character: modifiedCharacter });
    },
    setStat: (name, value) => ({ getState, setState }) => {
        const initial = getState();
        const stat = { ...initial.character.stats.find(x => x.name === name), value: +value };
        const modifiedStats = replaceArrayValueByName(initial.character.stats, stat);
        const modifiedCharacter = {
            ...initial.character,
            stats: [...modifiedStats]
        };
        setState({ character: modifiedCharacter });
    },
    getStat: name => ({ getState }) => {
        return getState().character.stats.find(x => x.name === name);
    },
    getStatPoints: (list) => ({ getState }) => {
        return (list || getState().character.stats).reduce((current, next) => current + next.value, 0);
    },
    getSkillPoints: (list) => ({ getState }) => {
        return getSkillPoints(list || getState().character.skills);
    },
    getGrantedSkillPoints: (list) => ({ getState }) => {
        return getGrantedSkillPoints(list || getState().character.skills);
    }
};


const loadLifePath = () => {
    return {
        stages: stages["General"],
        results: {},
        roleStages: [],
        currentStage: stages["General"][0].title
    };
}

const lifepathActions = {
    setLifepath: (lifepath) => ({ setState }) => {
        setState({ lifepath: lifepath });
    },
    getRole: () => ({ getState }) => {
        const state = getState();
        return state.lifepath.results?.Role ?? "Unknown";
    },
    resetLifepath: () => ({ setState }) => {
        setState({
            lifepath: loadLifePath()
        });
    },
    setLifepathStageValue: (stage, value) => ({ getState, setState }) => {
        const state = getState();
        const stageDefinition = lifepathActions.getStageDefinition(stage)({ getState });
        const oldRoleStages = state.lifepath.roleStages;
        let oldRoleResults = {};
        for (const stage in oldRoleStages) {
            oldRoleResults[stage.title] = null;
        }
        const roleStages = (stageDefinition.loadAdditional) ? stages[value] : state.lifepath.roleStages;
        setState({
            lifepath: {
                ...state.lifepath,
                results: { ...state.lifepath.results, ...oldRoleResults, [stage]: value },
                roleStages
            }
        });
    },
    getStageDefinition: (stage) => ({ getState }) => {
        const state = getState();
        return state.lifepath.stages.find(x => x.title === stage) || state.lifepath?.roleStages?.find(x => x.title === stage);
    },
    getStageResult: (stage) => ({ getState }) => {
        const state = getState();
        return state.lifepath.results?.[stage];
    },
    hasResult: (stage) => ({ getState }) => {
        const state = getState();
        return state.lifepath.results?.[stage]? true : false;
    },
    currentStage: () => ({ getState }) => {
        const state = getState();
        return state.lifepath.currentStage;
    },
    currentStageDefinition: () => ({ getState }) => {
        const state = getState();
        const currentStage = state.lifepath.currentStage;
        return lifepathActions.getStageDefinition(currentStage)({ getState });
    },
    nextStage: (stage) => ({ getState, setState }) => {
        const currentStageDefinition = lifepathActions.getStageDefinition(stage)({ getState }) || lifepathActions.currentStageDefinition()({ getState });
        const state = getState();
        const currentStage = currentStageDefinition.title;
        const then = currentStageDefinition?.["then"]?.[state.lifepath.results?.[currentStage]];
        const generalIndex = state.lifepath.stages.findIndex(x => x.title === currentStage);
        const nextGeneralIndex = (generalIndex >= 0 && generalIndex < state.lifepath.stages.length) ? generalIndex + 1 : null;
        const roleIndex = state.lifepath.roleStages?.findIndex(x => x.title === currentStage);
        const nextRoleIndex = (roleIndex >= 0 && roleIndex < state.lifepath.roleStages?.length) ? roleIndex + 1 : null;
        const startRole = (generalIndex === state.lifepath.stages.length - 1) ? state.lifepath.roleStages[0].title : null;
        const nextStage = then ||
            startRole ||
            (nextGeneralIndex && state.lifepath.stages[nextGeneralIndex].title) ||
            (nextRoleIndex && state.lifepath.roleStages[nextRoleIndex].title) ||
            "__final__";
        setState({
            lifepath: { ...state.lifepath, currentStage: nextStage }
        });
    },
    previousStage: (stage) => ({ getState, setState }) => {
        const currentStageDefinition = lifepathActions.getStageDefinition(stage)({ getState }) || lifepathActions.currentStageDefinition()({ getState });
        const state = getState();
        const currentStage = currentStageDefinition.title;
        const generalIndex = state.lifepath.stages.findIndex(x => x.title === currentStage);
        const nextGeneralIndex = (generalIndex >= 0 && generalIndex < state.lifepath.stages.length) ? generalIndex - 1 : null;
        const roleIndex = state.lifepath.roleStages?.findIndex(x => x.title === currentStage);
        const nextRoleIndex = (roleIndex >= 0 && roleIndex < state.lifepath.roleStages?.length) ? roleIndex - 1 : null;
        const endGeneral = (roleIndex === 0) ? state.lifepath.stages[state.lifepath.stages.length-1].title : null;
        const nextStage = endGeneral ||
            ((nextRoleIndex || (roleIndex > 0)) && state.lifepath.roleStages[nextRoleIndex]?.title) ||
            ((nextGeneralIndex || (generalIndex > 0)) && state.lifepath.stages[nextGeneralIndex]?.title) ||
            (state.lifepath.stages[0]?.title ?? "__start__");
        setState({
            lifepath: { ...state.lifepath, currentStage: nextStage }
        });
        // TODO: "then" on previous entries. Check for if there's a Result?
    },
    handleRoll: (stage) => ({ getState }) => {
        const stageDefinition = (stage) ? lifepathActions.getStageDefinition(stage)({ getState }) : lifepathActions.currentStageDefinition()({ getState });

        const roller = new LifepathRoller;

        return roller.handleRoll(stageDefinition);
    }
};

const Store = createStore({
    initialState: {
        "character": { ...characterSkeleton },
        "lifepath": loadLifePath(),
        "details": { "name": "" }
    },
    actions: {
        setDetails: (details) => ({ setState }) => {
            setState({ details: details });
        },
        ...valuesActions,
        ...lifepathActions
    }
});

const getStats = state => state.character.stats;
const getSkills = state => state.character.skills;
const getLifepath = state => state.lifepath;
const getDetails = state => state.details;
const getCharacter = state => state.character;

export const useCharacter = createHook(Store);
export const useCharacterValues = createHook(Store, { selector: getCharacter });
export const useStats = createHook(Store, { selector: getStats });
export const useSkills = createHook(Store, { selector: getSkills });
export const useDetails = createHook(Store, { selector: getDetails });
export const useLifepath = createHook(Store, { selector: getLifepath });