class FSM {
   
    constructor(config) {
		this.currentState = config.initial;
		this.states = config.states;
		this.initial = config.initial;
		this._initHistory();
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
		for( let item in this.states){
			if(item === state){
				this._setStateWithHistory(state);
				return;
			}
		}
		
		throw new Error('');
	}

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
		let transition = this.states[this.currentState].transitions;
		for(let item in transition){
			if(item === event){
				this._setStateWithHistory(transition[event]);				
				return;
			}
		}
		throw new Error('');
	}

    /**
     * Resets FSM state to initial.
     */
    reset() {
		this.changeState(this.initial);
	}

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
		var arrStates=[];
		for(var itemStates in this.states){
			if(!event){
				arrStates.push(itemStates);
			}else{
				for(var itemTransition in this.states[itemStates].transitions){
					if(event === itemTransition){
						arrStates.push(itemStates);
					}
				}
			}
			
		}
		return arrStates;
	}

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
		if(this.historyIndex == 0){return false}
		this.currentState=this.statesHistory[--this.historyIndex];
		return true;		
	}

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
		if(this.statesHistory.length-1 <= this.historyIndex){return false}
		this.currentState=this.statesHistory[++this.historyIndex];
		return true;
	}

    /**
     * Clears transition history
     */
    clearHistory() {
		this._initHistory();
	}
		
	_initHistory() {
		this.statesHistory=[this.initial];
		this.historyIndex=0;
	}
	
	_setStateWithHistory(state) {
		this.currentState = state;
		this.statesHistory[++this.historyIndex]=this.currentState;
	}
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
