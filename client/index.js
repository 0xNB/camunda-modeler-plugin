import {registerBpmnJSPlugin, registerClientPlugin} from 'camunda-modeler-plugin-helpers';

import BpmnExtensionModule from './bpmn-js-extension';
import CustomExtensionModule from "./custom";
import DrawingModule from "./draw";
import lintingModule from 'bpmn-js-bpmnlint';
import defaultConfig from '../.bpmnlintrc';
import persistentStateLintingModule from './lint';
import BpmnLinter from "./lint/bpmnLinter";

registerBpmnJSPlugin(BpmnExtensionModule);
registerBpmnJSPlugin(CustomExtensionModule);
registerBpmnJSPlugin(DrawingModule);
registerClientPlugin(config => {

    const {
        additionalModules,
        ...rest
    } = config;

    return {
        ...rest,
        additionalModules: [
            ...(additionalModules || []),
            lintingModule,
            persistentStateLintingModule
        ],
        linting: {
            bpmnlint: defaultConfig,
            active: BpmnLinter.getLintingActive()
        }
    }
}, 'bpmn.modeler.configure');
