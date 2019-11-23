var actions = {};

import SpecializedServiceTaskFactory from "./SpecializedServiceTaskFactory";

export default class CustomContextPad {
    constructor(config, contextPad, create, elementFactory, injector, translate, bpmnFactory) {
        this.create = create;
        this.elementFactory = elementFactory;
        this.bpmnFactory = bpmnFactory;
        this.translate = translate;
        this.serviceFactory = new SpecializedServiceTaskFactory(this.create, bpmnFactory, elementFactory);
        this.filterList = [
            "append.append-task",
            "append.text-annotation",
        ];

        if (config.autoPlace !== false) {
            this.autoPlace = injector.get('autoPlace', false);
        }

        contextPad._providers[0].__proto__.getContextPadEntries = this.wrapActionsProxy(contextPad._providers[0].__proto__.getContextPadEntries);
        contextPad.registerProvider(this);
    }

    wrapActionsProxy(f) {
        return new Proxy(f, {
            apply(target, thisArg, args) {
                actions = target.apply(thisArg, args);
                return {};
            }
        });
    }

    filterActions(actionsToFilter, filterList, eventType) {
        for(let filter of filterList) {
            delete actionsToFilter[filter];
        }
        return actionsToFilter;
    }

    getContextPadEntries(element) {
        const {
            autoPlace,
            create,
            elementFactory,
            translate
        } = this;

        console.log(`our actions ` + JSON.stringify(actions));

        return { ...this.filterActions(actions, this.filterList),
            'append.jena-task': {
                group: 'model',
                className: 'bpmn-icon-service-task fraunhofer-blue',
                title: 'Append Apache Jena Task',
                action: {
                    click: this.serviceFactory.appendSpecializedServiceTask(this.serviceFactory.jenaOptions, autoPlace, element),
                    dragstart: this.serviceFactory.appendSpecializedServiceTask(this.serviceFactory.jenaOptions, autoPlace, element)
                }
            },
            'append.swrl-task': {
                group: 'model',
                className: 'bpmn-icon-service-task fraunhofer-red',
                title: 'Append SWRL Task',
                action: {
                    click: this.serviceFactory.appendSpecializedServiceTask(this.serviceFactory.swrlOptions, autoPlace, element),
                    dragstart: this.serviceFactory.appendSpecializedServiceTask(this.serviceFactory.swrlOptions, autoPlace, element)
                }
            }
        };
    }
}

CustomContextPad.$inject = [
    'config',
    'contextPad',
    'create',
    'elementFactory',
    'injector',
    'translate',
    'bpmnFactory'
];
