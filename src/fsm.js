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
        this.undos = [];
        this.undosShift = 0;
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
    changeState(state, cancel) {
        if (!(state in this.states)) { throw new Error('This state does not exist!'); }

        if (!cancel) {
            this.undos = [];
            this.undosShift = 0;
        }

        this.prevState = this.currentState;
        this.currentState = state;

        this.history.push(this.prevState);
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
        if (!this.undos.length) { this.undosShift = this.history.length; }

        let undoState = this.history[--this.undosShift];

        if (!this.history.length || this.undosShift < 0) { return false; }

        this.undos.push(undoState);
        this.changeState(undoState, true);

        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (!this.undos.length) { return false; }

        this.undos.pop();
        this.changeState(this.history[++this.undosShift], true);

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
