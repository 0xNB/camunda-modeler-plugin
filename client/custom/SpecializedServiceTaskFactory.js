export default class SpecializedServiceTaskFactory {

    constructor(create, bpmnFactory, elementFactory) {
        this.bpmnFactory = bpmnFactory;
        this.create = create;
        this.elementFactory = elementFactory;
        this.jenaOptions = {
            expressionName: "myExampleClass1.test()",
            actionGuiName: "Apache Jena Task",
            resultVariable: "jena1",
            docsId: "JENA"
        };

        this.swrlOptions = {
            expressionName: "myExampleClass2.test()",
            actionGuiName: "SWRL Task",
            resultVariable: "swrl1",
            docsId: "SWRL"
        };
    }

    createSpecializedServiceTask(options = this.jenaOptions) {
        const shape = this.createSpecializedShape(options);
        let innerCreate = this.create;
        return function () {
            innerCreate.start(event, shape);
        }
    }

    appendSpecializedServiceTask(options, autoPlace, outerElement) {
        const shape = this.createSpecializedShape(options);
        return function (event, element) {
            if (autoPlace) {
                autoPlace.append(element, shape);
            } else {
                this.appendSpecializedServiceTaskStart(event, shape, outerElement);
            }
        }
    }

    appendSpecializedServiceTaskStart(event, shape, outerElement) {
        this.create.start(event, shape, outerElement);
    }

    createSpecializedShape(options) {
        let ownDocs = this.bpmnFactory.create('bpmn:Documentation', {
            text: options.docsId
        });

        const businessObject = this.bpmnFactory.create('bpmn:ServiceTask', {
            implementation: "Expression",
            expression: "${" + options.expressionName + "}",
            name: options.actionGuiName,
            documentation: [ownDocs],
            resultVariable: options.resultVariable,
        });

        const shape = this.elementFactory.createShape({
            type: 'bpmn:ServiceTask',
            subType: 'FRAUNHOFER',
            businessObject: businessObject
        });
        return shape;
    }

}

SpecializedServiceTaskFactory.$inject = [
    'create',
    'bpmnFactory',
    'elementFactory'
];
