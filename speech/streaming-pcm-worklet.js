class StreamingPcmTapProcessor extends AudioWorkletProcessor {
  process(inputs, outputs) {
    const samples = inputs[0]?.[0];
    if (samples?.length) {
      const copy = new Float32Array(samples);
      this.port.postMessage(copy, [copy.buffer]);
    }
    for (const output of outputs) {
      for (const channel of output) channel.fill(0);
    }
    return true;
  }
}

registerProcessor("reading-companion-pcm-tap", StreamingPcmTapProcessor);
