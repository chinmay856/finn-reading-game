export const AUTO_OVERFIX_DURATION = 5000;

// The storyboard stays green underneath while AUTO reveals the overfixed art.
export async function playAutoOverfixTransition({ stage, source, siteName }) {
  const scene = document.createElement('section');
  scene.className = 'site-auto-overfix';
  scene.setAttribute('aria-label', `AUTO is updating ${siteName}`);
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
  scene.append(frame, rig, caption);
  const siblings = [...stage.children].map(node => [node, node.inert]);
  const animations = [];
  try {
    for (const [node] of siblings) node.inert = true;
    await Promise.allSettled([frame.decode(), rig.querySelector('img').decode()]);
    stage.append(scene);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) rig.classList.add('reduced-motion');
    animations.push(frame.animate(reduced ? [{ opacity: 0 }, { opacity: 1 }] : [
      { clipPath: 'inset(18px 524px 882px 106px)' },
      { clipPath: 'inset(18px 524px 57px 106px)' },
    ], { duration: AUTO_OVERFIX_DURATION, fill: 'forwards', easing: 'linear' }));
    if (!reduced) animations.push(rig.animate([
      { left: '140px', top: '30px' },
      { left: '640px', top: '160px' },
      { left: '150px', top: '315px' },
      { left: '640px', top: '475px' },
      { left: '350px', top: '640px' },
    ], { duration: AUTO_OVERFIX_DURATION, fill: 'forwards', easing: 'ease-in-out' }));
    await Promise.all(animations.map(animation => animation.finished));
  } finally {
    for (const animation of animations) animation.cancel();
    scene.remove();
    for (const [node, inert] of siblings) node.inert = inert;
  }
}
