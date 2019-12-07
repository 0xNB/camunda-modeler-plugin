import inherits from 'inherits';

import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer';

import { is } from 'bpmn-js/lib/util/ModelUtil';


export default function SpecialTaskRenderer(
    config, eventBus, styles,
    pathMap, canvas, textRenderer) {

  BpmnRenderer.call(
    this,
    config, eventBus, styles,
    pathMap, canvas, textRenderer,
    1400
  );

  function getTextFromDocumentation(element) {
    let documentations = element.businessObject && element.businessObject.get('documentation');
    return (documentations && documentations.length > 0) ? documentations[0].text : '';
  }

  this.canRender = function(element) {
    let text = getTextFromDocumentation(element);
    if (is(element, 'bpmn:SequenceFlow'))
      return true;
    return (is(element, 'bpmn:BaseElement') && (text === 'JENA' || text === 'SWRL'));
  };

  this.drawShape = function(parent, shape) {
    if (is(shape.businessObject, 'bpmn:SequenceFlow')) {
      if (shape.businessObject.transitive !== undefined) {
        let shape = this.drawBpmnShape(parent, shape);
        shape.classList.add('fraunhofer-red');
        return shape;
      }
    }


    let bpmnShape = this.drawBpmnShape(parent, shape);
    let text = getTextFromDocumentation(shape);
    if (text === 'JENA') {
      bpmnShape.classList.add('fraunhofer-blue');
    } else {
      bpmnShape.classList.add('fraunhofer-red');
    }

    //  svgAttr(bpmnShape, { fill: color});
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
