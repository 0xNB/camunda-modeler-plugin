import {
  registerBpmnJSPlugin
} from 'camunda-modeler-plugin-helpers';

import BpmnExtensionModule from './bpmn-js-extension';
import CustomExtensionModule  from "./custom";

registerBpmnJSPlugin(BpmnExtensionModule);
registerBpmnJSPlugin(CustomExtensionModule);
