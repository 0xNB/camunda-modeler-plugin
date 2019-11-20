/**
 * A bpmn-js service that provides the actual plug-in feature.
 *
 * Checkout the bpmn-js examples to learn about its capabilities
 * and the extension points it offers:
 *
 * https://github.com/bpmn-io/bpmn-js-examples
 */

import customModule from '../custom';

export default function ExampleExtensionService(eventBus) {

  console.log(`loading example extension service`);

  eventBus.on('shape.added', function(context) {
    let element = context.element;

   // console.log('🎉 A shape was added! Yay!', element);
  });

  eventBus.on('connection.added', function(context) {
    let element = context.element;

  //  console.log('🎊 A connection was added!', element);
  });
}

ExampleExtensionService.$inject = [
  'eventBus'
];
