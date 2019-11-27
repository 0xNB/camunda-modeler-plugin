const {
    is
} = require('bpmnlint-utils');

const MAX_DEPTHS = 3;

/**
 * Rule that reports manual tasks being used.
 */
module.exports = function() {

    function check(node, reporter) {

        let nodeMap = new Map();
        let nodeToBeExpandedQueue = [node];

        if(!isForking(node))
            return;

        while(nodeToBeExpandedQueue.length) {
            let currentNode = nodeToBeExpandedQueue.pop();
            expandNode(currentNode, nodeMap);
            if(isChanged(currentNode, nodeMap)) {
                nodeToBeExpandedQueue.concat(getChangedNodes(currentNode, nodeMap));
            }
        }

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

function expandNode(node, nodeMap) {
    if(nodeMap.has(node)) {
        return;
    }
    let outgoing = getOutgoingNodes(node);
    nodeMap.set(node, outgoing);
}

function isChanged(node, nodeMap) {
    for(let newNode of nodeMap.get(node)) {
        if(!nodeMap.has(newNode))
            return true;
    }
    return false;
}

function getChangedNodes(node, nodeMap) {
    return nodeMap.get(node).filter( newNode => !nodeMap.has(newNode));
}

function getOutgoingNodes(node) {
    let outgoing = node.outgoing;
    outgoing = outgoing.filter( flow => flow.targetRef !== undefined);
    return outgoing.map(flow => flow.targetRef);
}


function isForking(node) {
    const outgoing = node.outgoing || [];
    return outgoing.length > 1;
}
