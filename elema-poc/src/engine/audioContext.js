// audioContext.js - WebRenderer singleton and render function
import WebRenderer from '@elemaudio/web-renderer';
import { el } from '@elemaudio/core';

let core = null;
let ctx = null;
let initialized = false;

export async function initAudio() {
  if (initialized) return core;

  ctx = new AudioContext();
  core = new WebRenderer();

  const node = await core.initialize(ctx, {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [2],
  });

  node.connect(ctx.destination);
  initialized = true;

  // Resume context if suspended (browser autoplay policy)
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  return core;
}

export function render(left, right) {
  if (!core || !initialized) return;

  // Handle case where we have no signal - render silence
  const leftSignal = left ?? el.const({ value: 0 });
  const rightSignal = right ?? leftSignal;

  core.render(leftSignal, rightSignal);
}

export function getCore() {
  return core;
}

export function getAudioContext() {
  return ctx;
}

export function isInitialized() {
  return initialized;
}
