import { createStore, createHook } from 'react-sweet-state';
import { characterSkeleton } from './getCharacterSkeleton';

function replaceArrayValueByName(list, value) {
    return list.map(x => (x.name === value.name) ? value : x);
}

function getSkillPoints(list) {
    return list.reduce((current, next) => current + (((next?.double ?? "") === "") ? 1 : 2) * (next.value - ((next.granted) ? next.granted : 0)), 0);
}

function getGrantedSkillPoints(list) {
    return list.reduce((current, next) => current + ((next.granted) ? next.granted : 0), 0);
}

const Store = createStore({
    initialState: {
        "character": { ...characterSkeleton },
        "lifepath": {},
        "details": { "name": "" }
    },
    actions: {
        setDetails: (details) => ({ setState }) => {
            setState({ details: details });
        },
        setCharacter: (character) => ({ setState }) => {
            setState({ character: character });
        },
        setSkill: (name, value) => ({ getState, setState }) => {
            const initial = getState();
            const skill = { ...initial.character.skills.find(x => x.name === name), value: +value };
            const modifiedSkills = replaceArrayValueByName(initial.character.skills, skill);
            const modifiedCharacter = {
                ...initial.character,
                skills: [ ...modifiedSkills ]
            };
            setState({ character: modifiedCharacter });
        },
        setStat: (name, value) => ({ getState, setState }) => {
            const initial = getState();
            const stat = { ...initial.character.stats.find(x => x.name === name), value: +value };
            const modifiedStats = replaceArrayValueByName(initial.character.stats, stat);
            const modifiedCharacter = {
                ...initial.character,
                stats: [ ...modifiedStats ]
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
        },
        setLifepath: (lifepath) => ({ setState }) => {
            setState({ lifepath: lifepath });
        }
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