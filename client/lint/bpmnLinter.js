const LINTING_STATE_KEY = 'camunda-modeler.linter-lugin.active';

export default class BpmnLinter {

    constructor(eventBus) {
        window.localStorage.setItem(LINTING_STATE_KEY, JSON.stringify(true));
        eventBus.on('linting.toggle', (event) => {
            console.log(`Linting toggled`);
            const {
                active
            } = event;
            this.setLintingActive(active);
        });
    }

    static getLintingActive(active) {
        const str = window.localStorage.getItem(LINTING_STATE_KEY);
        return str && JSON.parse(str) || false;
    }

    setLintingActive(active) {
        window.localStorage.setItem(LINTING_STATE_KEY, JSON.stringify(active));
    }
}

BpmnLinter.$inject = [
    'eventBus'
];
