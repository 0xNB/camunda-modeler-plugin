import CustomContextPad from "./CustomContextPad";
import CustomPalette from "./CustomPalette";

/**
 * A bpmn-js module, defining all extension services and their dependencies.
 *
 * --------
 *
 * --------
 *
 */
export default {
    __init__: [ 'CUSTOM_CONTEXT_PAD_MODULE', 'CUSTOM_PALETTE_MODULE' ],
    CUSTOM_CONTEXT_PAD_MODULE: [ 'type', CustomContextPad ],
    CUSTOM_PALETTE_MODULE: ['type', CustomPalette]
};
