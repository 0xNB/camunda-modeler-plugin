import {
  registerBpmnJSPlugin
} from 'camunda-modeler-plugin-helpers';

import BpmnExtensionModule from './bpmn-js-extension';
import CustomExtensionModule  from "./custom";
import DrawingModule from "./draw";

registerBpmnJSPlugin(BpmnExtensionModule);
registerBpmnJSPlugin(CustomExtensionModule);
registerBpmnJSPlugin(DrawingModule);
