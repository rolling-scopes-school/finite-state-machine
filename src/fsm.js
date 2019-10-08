class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (config == undefined) throw new Error();
        this.config = config;
        this.state = config.initial;
        this.arr = [];
        this.arr2 = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!this.config.states[state]) throw Error('no such state in config');
        this.arr.push(this.state);
        this.state = state;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let newState = this.state;
        if (!this.config.states[newState].transitions[event])throw Error('Error');

        this.arr.push(this._state);
        this.state = this.config.states[newState].transitions[event];


    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = this.config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if (event == undefined) return this.config.states;
        let states = [];
        for(let key in this.config.states){
            if(this.config.states[key].transitions[event] != undefined){
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
        if (this.arr.length) {
            this.arr2.push(this.state);
            this.state = this.arr.pop();
            return true;
        } else {
            return false;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.arr2.length) {
            this.arr.push(this.state);
            this.state = this.arr2.pop();
            return true ;
        } else{
            return false;
        } 
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.arr = [];
        this.arr2 = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
