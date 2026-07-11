const MIN_CHUNK_SIZE = 512;
let pointer = 0;
let chunk = new Float32Array(MIN_CHUNK_SIZE);

class MoonshineVadProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0]?.[0];
    if (!input) return true;

    let offset = 0;
    while (offset < input.length) {
      const count = Math.min(MIN_CHUNK_SIZE - pointer, input.length - offset);
      chunk.set(input.subarray(offset, offset + count), pointer);
      pointer += count;
      offset += count;
      if (pointer === MIN_CHUNK_SIZE) {
        this.port.postMessage({ buffer: chunk }, [chunk.buffer]);
        chunk = new Float32Array(MIN_CHUNK_SIZE);
        pointer = 0;
      }
    }
    return true;
  }
}

registerProcessor("moonshine-vad-processor", MoonshineVadProcessor);
