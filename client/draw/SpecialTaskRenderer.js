import inherits from 'inherits';

import {
    attr as svgAttr
} from 'tiny-svg';

import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer';

import {
    is
} from 'bpmn-js/lib/util/ModelUtil';


export default function SpecialTaskRenderer(
    config, eventBus, styles,
    pathMap, canvas, textRenderer) {

    BpmnRenderer.call(
        this,
        config, eventBus, styles,
        pathMap, canvas, textRenderer,
        1400
    );

    this.canRender = function(element) {
        return is(element, 'bpmn:BaseElement') && element.subType;
    };

    this.drawShape = function(parent, shape) {

        var bpmnShape = this.drawBpmnShape(parent, shape);

        svgAttr(bpmnShape, { fill: "#1fff12" });

        return bpmnShape;
    };
}

inherits(SpecialTaskRenderer, BpmnRenderer);

SpecialTaskRenderer.prototype.drawBpmnShape = BpmnRenderer.prototype.drawShape;


SpecialTaskRenderer.$inject = [
    'config.bpmnRenderer',
    'eventBus',
    'styles',
    'pathMap',
    'canvas',
    'textRenderer'
];
