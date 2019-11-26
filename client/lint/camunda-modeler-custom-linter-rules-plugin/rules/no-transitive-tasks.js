const {
    is
} = require('bpmnlint-utils');

const MAX_DEPTHS = 3;

/**
 * Rule that reports manual tasks being used.
 */
module.exports = function() {

    function check(node, reporter) {
        if(!isForking(node))
            return;

        const outgoingFromBase = node.outgoing;

        let outgoingFromBaseReachable = new Array(outgoingFromBase.length);
        for(let i = 0; i < outgoingFromBaseReachable.length; i++) {
            outgoingFromBaseReachable[i] = [];
        }

        for(let [i, node] of outgoingFromBase.entries()) {
                let nodeOutgoing = node.outgoing || [];
                outgoingFromBaseReachable[i].concat(nodeOutgoing);
        }

        let hasTransitiveDependency = true;

      /*  for(let i = 0; i < outgoingFromBaseReachable.length; i++) {
            for(let j = 0; j < outgoingFromBaseReachable.length; i++) {
                if(i === j)
                    continue;
                if(outgoingFromBaseReachable[j].includes(outgoingFromBase[i])) {
                    hasTransitiveDependency = true;
                }
            }
        }*/

      console.log(outgoingFromBaseReachable);

        if (hasTransitiveDependency) {
            reporter.report(node.id, 'Element has transitive dependency');
        }
    }

    return {
        check: check
    };
};

function isForking(node) {
    const outgoing = node.outgoing || [];
    return outgoing.length > 1;
}
