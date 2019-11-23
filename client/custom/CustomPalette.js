export default class CustomPalette {
    constructor(create, elementFactory, palette, translate, lassoTool, spaceTool, bpmnFactory, elementRegistry) {
        this.create = create;
        this.lassoTool = lassoTool;
        this.elementFactory = elementFactory;
        this.spaceTool = spaceTool;
        this.translate = translate;
        this.bpmnFactory = bpmnFactory;
        this.elementRegistry = elementRegistry;

      //  let exampleObject = this.elementRegistry.get('Task_13vlpcn').businessObject

        console.log(`registering custom palette plugin!`);

       // debugger;


        console.log(palette._providers);

        for (let entry in palette._providers) {
            console.log(`palette entry: ` + entry);
        }
        palette._providers = [];
        palette.registerProvider(this);
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

        function createServiceTask(event) {
            const shape = elementFactory.createShape({type: 'bpmn:ServiceTask'});

            create.start(event, shape);
        }

        function createJenaTask(event) {
            const businessObject = bpmnFactory.create('bpmn:ServiceTask', {
                implementation: "Expression",
                expression: "${myExampleClass1.test()}",
                name: "Apache Jena Task",
                resultVariable: "jena1",
            });

            const shape = elementFactory.createShape({
                type: 'bpmn:ServiceTask',
                businessObject: businessObject
            });

            create.start(event, shape);
        }

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
            'create.service-task': {
                group: 'activity',
                className: 'bpmn-icon-service-task',
                title: translate('Create ServiceTask'),
                action: {
                    dragstart: createServiceTask,
                    click: createServiceTask
                }
            },
            'create.jena-task': {
                group: 'activity',
                className: 'bpmn-icon-service-task fraunhofer-red',
                title: translate('Create SWRL Task'),
                action: {
                    dragstart: createSwrlTask,
                    click: createSwrlTask
                }
            },
            'create.swrl-task': {
                group: 'activity',
                className: 'bpmn-icon-service-task fraunhofer-blue',
                title: translate('Create Apache Jena Task'),
                action: {
                    dragstart: createJenaTask,
                    click: createJenaTask
                }
            },
            'create.start-event': this.createAction(
                'bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none'
            ),
            'custom-separator': {
                group: 'custom',
                separator: true
            },
            'create.exclusive-gateway': this.createAction(
                'bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-xor'
            ),

        }
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
    'elementRegistry',
];
