const {
  is
} = require('bpmnlint-utils');

import getOutgoingNodes from '../util/nodeAggregation';

/**
 * Rule that reports manual tasks being used.
 */
export default function() {

  function check(node, reporter) {
    let outgoing = getOutgoingNodes(node);
    reporter.report(node.id, 'test');
  }

  return {
    check: check
  };
}

