export class LifepathRoller {
    constructor() {
        this.diceroll = this.diceroll.bind(this);
        this.rollTable = this.rollTable.bind(this);
        this.handleRoll = this.handleRoll.bind(this);
    }

    diceroll(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    rollTable(table) {
        const result = this.diceroll(1, table.length) - 1; // -1 to convert to an array index.
        return table[result];
    }

    handleRoll(stage) {
        let iterations = 1;
        let resultArray = [];
        if (stage.iterations == "1d10-7") {
            iterations = Math.max(0, this.diceroll(1, 10) - 7);
        }
        if (iterations <= 0) {
            return ["None"];
        }
        for (let i = 0; i < iterations; i++) {
            if (Array.isArray(stage.options)) {
                resultArray[i] = this.rollTable(stage.options);
            }
            else {
                let result = {};
                // is an object, have multiple tables.
                for (let tableName in stage.options) {
                    result[tableName] = this.rollTable(stage.options[tableName]);
                }
                resultArray[i] = result;
            }
        }
        return resultArray;
    }
}
