export default class CustomProperties {
    constructor(create, elementFactory, palette, translate, lassoTool, spaceTool, bpmnFactory, elementRegistry) {
        this.create = create;
        this.lassoTool = lassoTool;
        this.elementFactory = elementFactory;
        this.spaceTool = spaceTool;
        this.specializedServiceTaskFactory = new SpecializedServiceTaskFactory(this.create, bpmnFactory, elementFactory);
        this.translate = translate;
        this.bpmnFactory = bpmnFactory;
        this.elementRegistry = elementRegistry;

        console.log(`registering custom palette plugin!`);
        console.log(palette._providers);

        for (let entry in palette._providers) {
            console.log(`palette entry: ` + entry);
        }
        palette._providers = [];
        palette.registerProvider(this);
    }

    createParticipant(event) {
        this.create.start(event, this.elementFactory.createParticipantShape());
    }

    createAction(type, group, className, title, options) {

        let _ = require('lodash');

        const {
            create,
            elementFactory,
            translate
        } = this;

        function createListener(event) {
            let shape = elementFactory.createShape(_.assign({type: type}, options));

            if (options) {
                shape.businessObject.di.isExpanded = options.isExpanded;
            }

            create.start(event, shape);
        }

        let shortType = type.replace(/^bpmn\:/, '');

        return {
            group: group,
            className: className,
            title: title || 'Create ' + shortType,
            action: {
                dragstart: createListener,
                click: createListener
            }
        };
    }

    getPaletteEntries(element) {
        const {
            create,
            elementFactory,
            bpmnFactory,
            translate
        } = this;

        return {
            'lasso-tool': {
                group: 'tools',
                className: 'bpmn-icon-lasso-tool',
                title: 'Activate the lasso tool',
                action: {
                    click: (function (event) {
                        this.lassoTool.activateSelection(event);
                    }).bind(this)
                }
            },
            'space-tool': {
                group: 'tools',
                className: 'bpmn-icon-space-tool',
                title: 'Activate the create/remove space tool',
                action: {
                    click: (function (event) {
                        this.spaceTool.activateSelection(event);
                    }).bind(this)
                }
            },
            'tasks-seperator': {
                group: 'tasks',
                separator: true
            },
            'create.swrl-task': {
                group: 'activity',
                className: 'bpmn-icon-service-task fraunhofer-red',
                title: translate('Create SWRL Task'),
                action: {
                    dragstart: this.specializedServiceTaskFactory.createSpecializedServiceTask(this.specializedServiceTaskFactory.swrlOptions),
                    click: this.specializedServiceTaskFactory.createSpecializedServiceTask(this.specializedServiceTaskFactory.swrlOptions)
                }
            },
            'create.jena-task': {
                group: 'activity',
                className: 'bpmn-icon-service-task fraunhofer-blue',
                title: translate('Create Apache Jena Task'),
                action: {
                    dragstart: this.specializedServiceTaskFactory.createSpecializedServiceTask(this.specializedServiceTaskFactory.jenaOptions),
                    click: this.specializedServiceTaskFactory.createSpecializedServiceTask(this.specializedServiceTaskFactory.jenaOptions)
                }
            },
            'create.start-event': this.createAction(
                'bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none'
            ),
            'create.end-event': this.createAction(
                'bpmn:EndEvent', 'event', 'bpmn-icon-end-event-none',
                translate('Create EndEvent')
            ),
            'custom-separator': {
                group: 'gateway',
                separator: true
            },
            'create.exclusive-gateway': this.createAction(
                'bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-xor'
            ),
            'custom-separator2': {
                group: 'artifact',
                separator: true
            },
            'create.group': this.createAction(
                'bpmn:Group', 'artifact', 'bpmn-icon-group',
                translate('Create Group')
            ),
            'create.participant-expanded': {
                group: 'artifact',
                className: 'bpmn-icon-participant',
                title: translate('Create Pool/Participant'),
                action: {
                    dragstart: this.createParticipant.bind(this),
                    click: this.createParticipant.bind(this)
                }
            },
        };
    }
}

CustomPalette.$inject = [
    'create',
    'elementFactory',
    'palette',
    'translate',
    'lassoTool',
    'spaceTool',
    'bpmnFactory',
    'elementRegistry'
];
