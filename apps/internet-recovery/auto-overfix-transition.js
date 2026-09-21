export const AUTO_OVERFIX_DURATION = 5000;

// The storyboard stays green underneath while AUTO reveals the overfixed art.
export async function playAutoOverfixTransition({ stage, source, siteName, signal }) {
  const scene = document.createElement('section');
  scene.className = 'site-auto-overfix';
  scene.setAttribute('aria-label', `AUTO is updating ${siteName}`);
  const reveal = document.createElement('div');
  reveal.className = 'site-auto-overfix-reveal';
  const frame = new Image();
  frame.className = 'site-auto-overfix-frame';
  frame.alt = '';
  frame.src = source;
  const rig = document.createElement('div');
  rig.className = 'auto-working-rig';
  rig.innerHTML = '<div class="auto-dust" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><img class="auto-working" src="/walkthroughs/endgame/portraits/auto-working-cutout-v1.png" alt="">';
  const caption = document.createElement('p');
  caption.className = 'site-auto-overfix-caption';
  caption.setAttribute('role', 'status');
  caption.textContent = `AUTO is “improving” ${siteName}…`;
  reveal.append(frame);
  scene.append(reveal, rig, caption);
  const siblings = [...stage.querySelectorAll("#readingCompanion")].map(node => [node, node.inert]);
  const cancel = () => { for (const animation of animations) animation.cancel(); scene.remove(); };
  const animations = [];
  signal?.addEventListener("abort", cancel, { once: true });
  try {
    for (const [node] of siblings) node.inert = true;
    await Promise.allSettled([frame.decode(), rig.querySelector('img').decode()]);
    if (signal?.aborted) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) rig.classList.add('reduced-motion');
    // Hide the incoming artwork before insertion, including its first paint.
    if (!reduced) reveal.setAttribute('style', 'height:0');
    stage.append(scene);
    animations.push(reveal.animate(reduced ? [{ opacity: 0 }, { opacity: 1 }] : [
      { height: '0px' },
      { height: '825px' },
    ], { duration: AUTO_OVERFIX_DURATION, fill: 'both', easing: 'linear' }));
    if (!reduced) animations.push(rig.animate([
      { left: '140px', top: '30px' },
      { left: '640px', top: '160px' },
      { left: '150px', top: '315px' },
      { left: '640px', top: '475px' },
      // Leave room for the full 230px cutout, its bob, and the caption below.
      { left: '350px', top: '520px' },
    ], { duration: AUTO_OVERFIX_DURATION, fill: 'both', easing: 'ease-in-out' }));
    await Promise.allSettled(animations.map(animation => animation.finished));
  } finally {
    signal?.removeEventListener("abort", cancel);
    for (const animation of animations) animation.cancel();
    scene.remove();
    for (const [node, inert] of siblings) node.inert = inert;
  }
}
