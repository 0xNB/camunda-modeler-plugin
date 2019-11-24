/**
 * A bpmn-js service that provides the actual plug-in feature.
 *
 * Checkout the bpmn-js examples to learn about its capabilities
 * and the extension points it offers:
 *
 * https://github.com/bpmn-io/bpmn-js-examples
 */

export default function ExampleExtensionService(eventBus) {

    console.log(`loading example extension service`);

    eventBus.on('shape.added', function (context) {
        let element = context.element;

        // console.log('🎉 A shape was added! Yay!', element);
    });

    eventBus.on('connection.added', function (context) {
        let element = context.element;

        //  console.log('🎊 A connection was added!', element);
    });

    eventBus.on('element.click', log);

    function log(e) {
        let element = e.element;
        let documentations = element.businessObject && element.businessObject.get('documentation');
        let text = (documentations && documentations.length > 0) ? documentations[0].text : '';
        console.log('element.hover', 'on', e.element.id);
        console.log(`${e.element.id}`);
    }
}

ExampleExtensionService.$inject = [
    'eventBus'
];
