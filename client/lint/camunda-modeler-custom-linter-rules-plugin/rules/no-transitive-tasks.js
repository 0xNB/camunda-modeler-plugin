const {
    is
} = require('bpmnlint-utils');

const MAX_DEPTHS = 3;

/**
 * Rule that reports manual tasks being used.
 */
module.exports = function () {

    function check(node, reporter) {

        let nodeMap = new Map();
        let nodeToBeExpandedQueue = [node];

        if (!isForking(node))
            return;

        while (nodeToBeExpandedQueue.length) {
            let currentNode = nodeToBeExpandedQueue.pop();
            expandNode(currentNode, nodeMap);
            if (isChanged(currentNode, nodeMap)) {
                nodeToBeExpandedQueue = nodeToBeExpandedQueue.concat(getChangedNodes(currentNode, nodeMap));
            }
        }

        let hasTransitive = false;
        let outgoing = getOutgoingNodes(node);
        nodeMap.forEach((val, key) => {
            if (key === node) {
                return;
            }
            if (outgoing.some(r => {
                if (val.includes(r)) {
                    reporter.report(r.id, "Has transitive incoming dependency!");
                    return true;
                }
                return false;
            })) {
                hasTransitive = true;
            }
        });

        if (hasTransitive) {
            reporter.report(node.id, "Has transitive dependency!");
        }

    }

    return {
        check: check
    };
};

function expandNode(node, nodeMap) {
    if (nodeMap.has(node)) {
        return;
    }
    let outgoing = getOutgoingNodes(node);
    nodeMap.set(node, outgoing);
}

function isChanged(node, nodeMap) {
    for (let newNode of nodeMap.get(node)) {
        if (!nodeMap.has(newNode))
            return true;
    }
    return false;
}

function getChangedNodes(node, nodeMap) {
    return nodeMap.get(node).filter(newNode => !nodeMap.has(newNode));
}

function getOutgoingNodes(node) {
    let outgoing = node.outgoing || [];
    outgoing = outgoing.filter(flow => flow.targetRef !== undefined);
    return outgoing.map(flow => flow.targetRef);
}


function isForking(node) {
    const outgoing = node.outgoing || [];
    return outgoing.length > 1;
}
