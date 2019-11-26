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

        let outgoingFromBase = node.outgoing;

        let outgoingFromBaseReachable = new Array(outgoingFromBase.length);
        for(let i = 0; i < outgoingFromBaseReachable.length; i++) {
            outgoingFromBaseReachable[i] = [];
        }

        for(let [i, outgoingFlowFromBase] of outgoingFromBase.entries()) {
                let intermediateTarget = outgoingFlowFromBase.targetRef || {};
                let intermediateTargetFlows = intermediateTarget.outgoing || [];
                for(let endFlow of intermediateTargetFlows) {
                    let endTarget = endFlow.targetRef;
                    outgoingFromBaseReachable[i].push(endTarget);
                }
        }

        let hasTransitiveDependency = false;
        let transitiveFlows = [];

        for(let i = 0; (i < outgoingFromBaseReachable.length) && (i < outgoingFromBase.length); i++) {
            for(let j = 0; j < outgoingFromBaseReachable.length; j++) {
                if(i === j)
                    continue;
                if(outgoingFromBaseReachable[j].includes(outgoingFromBase[i].targetRef)) {
                    hasTransitiveDependency = true;
                    transitiveFlows.push(outgoingFromBase[i]);
                }
            }
        }

      console.log(outgoingFromBaseReachable);

        if (hasTransitiveDependency) {
            reporter.report(node.id, 'Element has transitive dependency');
            for(let transitiveFlow of transitiveFlows) {
                transitiveFlow.hasError = true;
                reporter.report(transitiveFlow.id, 'Flow is transitive');
            }
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
