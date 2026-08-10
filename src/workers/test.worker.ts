self.onmessage = (e: MessageEvent) => {
  const { data } = e;
  self.postMessage({ result: `Processed: ${data}` });
};
