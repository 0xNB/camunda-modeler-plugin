export default function(node) {
  let outgoing = node.outgoing || [];
  outgoing = outgoing.filter(flow => flow.targetRef !== undefined);
  return outgoing.map(flow => {
    return {
      node: flow.targetRef,
      flow: flow
    };
  });
}
