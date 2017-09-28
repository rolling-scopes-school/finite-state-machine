class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) { throw new Error('Config should be not empty!'); }

        this.currentState = config.initial;
        this.prevState = null;
        this.states = config.states;
        this.history = [];
        this.initialState = true;
        this.redoEnabled = false;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!(state in this.states)) { throw new Error('This state does not exist!'); }

        this.prevState = this.currentState;
        this.currentState = state;

        this.history.push(this.prevState);
        this.initialState = false;

        this.redoEnabled = false;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let newState = this.states[this.currentState].transitions[event];
        this.changeState(newState);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeState('normal');
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let states = [];
        if (!event) { return Object.keys(this.states); }

        for (let key in this.states) {
            if (event in this.states[key].transitions) {
                states.push(key);
            }
        }

        return states;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (!this.history.length) { return false; }

        this.changeState(this.history.pop());

        this.redoEnabled = true;
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (!this.history.length || !this.redoEnabled) { return false; }

        this.changeState(this.history.pop());

        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
