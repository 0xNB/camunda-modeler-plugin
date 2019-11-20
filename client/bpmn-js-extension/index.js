import ExampleExtensionService from './ExampleExtensionService';

/**
 * A bpmn-js module, defining all extension services and their dependencies.
 *
 * --------
 *
 * --------
 *
 */
export default {
  __init__: [ 'FRAUNHOFER_MODELER_PLUGIN' ],
  FRAUNHOFER_MODELER_PLUGIN: [ 'type', ExampleExtensionService ]
};
