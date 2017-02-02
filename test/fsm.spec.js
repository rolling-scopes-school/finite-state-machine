const FSM = require('../src/fsm');

/** Good luck! :) **/

/** visualisation https://i.imgur.com/07IO6TE.png **/
const config = {
    initial: 'normal',
    states: {
        normal: {
            transitions: {
                study: 'busy',
            }
        },
        busy: {
            transitions: {
                get_tired: 'sleeping',
                get_hungry: 'hungry',
            }
        },
        hungry: {
            transitions: {
                eat: 'normal'
            },
        },
        sleeping: {
            transitions: {
                get_hungry: 'hungry',
                get_up: 'normal',
            },
        },
    }
};

describe('FSM', () => {
    describe('#constructor', () => {
        it('throws an exception if config isn\'t passed', () => {
            expect(() => new FSM()).to.throw(Error);
        });
    });

    describe('#getState', () => {
        it('returns initial state after creation', () => {
            const student = new FSM(config);

            expect(student.getState()).to.equal('normal');
        });
    });

    describe('#changeState', () => {
        it('changes state', () => {
            const student = new FSM(config);

            student.changeState('hungry');
            expect(student.getState()).to.equal('hungry');
        });

        it('throws an exception if state isn\'t exist', () => {
            const student = new FSM(config);

            expect(() => student.changeState('hmmm... exception?')).to.throw(Error);
        });
    });

    describe('#trigger', () => {
        it('changes initial state according to event', () => {
            const student = new FSM(config);

            student.trigger('study');
            expect(student.getState()).to.equal('busy');
        });

        it('correctly changes states [3 in row]', () => {
            const student = new FSM(config);

            student.trigger('study');
            student.trigger('get_tired');
            expect(student.getState()).to.equal('sleeping');

            student.trigger('get_hungry');
            expect(student.getState()).to.equal('hungry');
        });

        it('correctly changes states [circular]', () => {
            const student = new FSM(config);

            student.trigger('study');
            student.trigger('get_hungry');
            expect(student.getState()).to.equal('hungry');

            student.trigger('eat');
            expect(student.getState()).to.equal('normal');
        });

        it('throws an exception if event in current state isn\'t exist', () => {
            const student = new FSM(config);
            student.trigger('study');

            expect(() => student.trigger('hmmm... exception?')).to.throw(Error);
            expect(() => student.trigger('eat')).to.throw(Error);
            expect(() => student.trigger('get_up')).to.throw(Error);
        });
    });

    describe('#reset', () => {
        it('resets current state to initial', () => {
            const student = new FSM(config);
            student.trigger('study');
            student.trigger('get_hungry');
            student.reset();

            expect(student.getState()).to.equal('normal');
        });
    });

    describe('#getStates', () => {
        it('returns all states if argument is empty', () => {
            const student = new FSM(config);

            expect(student.getStates()).to.deep.equal(['normal', 'busy', 'hungry', 'sleeping']);
        });

        it('returns correct states for event', () => {
            const student = new FSM(config);

            expect(student.getStates('get_hungry')).to.deep.equal(['busy', 'sleeping']);
            expect(student.getStates('study')).to.deep.equal(['normal']);
        });

        it('returns empty array for not valid array', () => {
            const student = new FSM(config);

            expect(student.getStates('hmmm... empty array?')).to.deep.equal([]);
        });

    });

    describe('#undo', () => {
        it('returns false for initial FSM', () => {
            const student = new FSM(config);

            expect(student.undo()).to.be.false;
        });

        it('goes back to prev step after trigger', () => {
            const student = new FSM(config);

            student.trigger('study');
            student.undo();
            expect(student.getState()).to.equal('normal');

            student.trigger('study');
            student.trigger('get_hungry');
            student.undo();
            expect(student.getState()).to.equal('busy');
        });

        it('goes back to prev after changeState', () => {
            const student = new FSM(config);

            student.changeState('hungry');
            student.undo();
            expect(student.getState()).to.equal('normal');
        });

        it('returns true if transition was successful', () => {
            const student = new FSM(config);

            student.trigger('study');
            expect(student.undo()).to.be.true;
        });

        it('returns false if undo is not available', () => {
            const student = new FSM(config);

            student.trigger('study');
            student.undo();
            expect(student.undo()).to.be.false;
        });

    });

    describe('#redo', () => {
        it('returns false for initial FSM', () => {
            const student = new FSM(config);

            expect(student.redo()).to.be.false;
        });

        it('cancels undo', () => {
            const student = new FSM(config);

            student.trigger('study');
            student.undo();
            student.redo();
            expect(student.getState()).to.equal('busy');

            student.trigger('get_tired');
            student.trigger('get_hungry');

            student.undo();
            student.undo();

            student.redo();
            student.redo();

            expect(student.getState()).to.equal('hungry');
        });

        it('returns true if transition was successful', () => {
            const student = new FSM(config);

            student.trigger('study');
            student.undo();
            expect(student.redo()).to.be.true;
        });

        it('returns false if redo is not available', () => {
            const student = new FSM(config);

            student.trigger('study');
            student.undo();
            student.redo();
            expect(student.redo()).to.be.false;
        });

        it('correct cancels multiple undos ', () => {
            const student = new FSM(config);

            student.trigger('study');
            student.undo();
            student.redo();
            student.undo();
            student.redo();
            student.undo();
            student.redo();
            student.undo();
            student.redo();
            student.undo();
            student.redo();

            expect(student.getState()).to.equal('busy');

        });

        it('disables redo after trigger call', () => {
            const student = new FSM(config);

            student.trigger('study');
            student.undo();
            student.trigger('study');
            student.undo();
            student.trigger('study');
            student.redo();

            expect(student.redo()).to.be.false;
        });

        it('disables redo after changeState call', () => {
            const student = new FSM(config);

            student.changeState('hungry');
            student.undo();
            student.changeState('normal');
            student.undo();
            student.changeState('busy');
            student.redo();

            expect(student.redo()).to.be.false;
        });

    });

    describe('#clearHistory', () => {
        it('clears transition history', () => {
            const student = new FSM(config);

            student.trigger('study');
            student.trigger('get_hungry');
            student.clearHistory();

            expect(student.undo()).to.be.false;
            expect(student.redo()).to.be.false;
        });
    });
});
