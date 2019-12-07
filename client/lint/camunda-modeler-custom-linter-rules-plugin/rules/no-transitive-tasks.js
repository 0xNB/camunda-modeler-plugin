const {
  is
} = require('bpmnlint-utils');

import getOutgoingNodes from '../util/nodeAggregation';

const MAX_DEPTHS = 3;

/**
 * Rule that reports the use of transitive tasks
 */
export default function() {

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
    nodeMap.forEach((val, key, map) => {
      if (key === node) {
        return;
      }
      if (outgoing.some(r => {
        if (val.map(nodeTuple => nodeTuple.node || {}).includes(r.node || {})) {
          reporter.report(r.node.id, 'Has transitive incoming dependency.');
          markTransitiveFlows(reporter, r.node, node);
          return true;
        }
        return false;
      })) {
        hasTransitive = true;
      }
    });
    if (hasTransitive) {
      reporter.report(node.id, 'Has transitive outgoing dependency.');
    }
    node.wasChecked = true;
  }


  return {
    check: check
  };
}

function markTransitiveFlows(reporter, node, nodeParent) {
  for (let flow of getIncomingFlowFromParentNode(node, nodeParent)) {
    reporter.report(flow.id, 'Is transitive!');
    flow.transitive = true;
  }
}

function getIncomingFlowFromParentNode(node, nodeParent) {
  let incoming = node.incoming || [];
  incoming = incoming.filter(flow => flow.sourceRef === nodeParent);
  return incoming;
}

function expandNode(node, nodeMap) {
  if (nodeMap.has(node)) {
    return;
  }
  let outgoing = getOutgoingNodes(node);
  nodeMap.set(node, outgoing);
}

function isChanged(node, nodeMap) {
  for (let { node: newNode } of nodeMap.get(node)) {
    if (!nodeMap.has(newNode))
      return true;
  }
  return false;
}

function getChangedNodes(node, nodeMap) {
  return nodeMap.get(node).map(tuple => tuple.node || {}).filter(newNode => !nodeMap.has(newNode));
}


function isForking(node) {
  const outgoing = node.outgoing || [];
  return outgoing.length > 1;
}
