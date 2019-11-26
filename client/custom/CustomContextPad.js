import SpecializedServiceTaskFactory from "./SpecializedServiceTaskFactory";
import {isAny} from "bpmn-js/lib/features/modeling/util/ModelingUtil";
import {isExpanded} from "bpmn-js/lib/util/DiUtil";

var actions = {};

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
        for(let provider of contextPad._providers) {
            provider.__proto__.getContextPadEntries = this.wrapActionsProxy(provider.__proto__.getContextPadEntries);
        }
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
        for (let filter of filterList) {
            delete actionsToFilter[filter];
        }
        return actionsToFilter;
    }


    getContextPadEntries(element) {
        const {
            autoPlace,
        } = this;

        let businessObject = element.businessObject;

        console.log(`our actions ` + JSON.stringify(actions));

        let actionsToBeAdded = {};
        if (!(isAny(businessObject, ['bpmn:Lane', 'bpmn:Participant']) && isExpanded(businessObject))) {
            actionsToBeAdded = {
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
        return {
            ...this.filterActions(actions, this.filterList), ...actionsToBeAdded
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
