// Fade-in/hold/fade-out timing for a single scroll-scrubbed "beat" within a
// pinned scene. 0 before `start`, ramps to 1 over [start, start+rampIn],
// holds at 1 until `end-rampOut` (or through `end` if holdAtEnd), ramps back
// to 0 by `end`. Meant to be called from inside a useTransform() callback,
// not used as a hook itself.
//
// These are plain functions (not the array-form useTransform(progress,
// input, output) pattern) because the array form was observed, empirically,
// to stop syncing its computed value to the DOM after settling on a
// plateau in a scroll-scrubbed pinned scene (confirmed via
// useMotionValueEvent: the motion value itself kept computing correctly,
// but the mounted element's rendered style never received the update).
// The function form doesn't have this problem.
export function beatOpacity(p: number, start: number, rampIn: number, end: number, rampOut: number, holdAtEnd = false) {
  if (p < start) return 0
  if (p < start + rampIn) return (p - start) / rampIn
  if (holdAtEnd || p < end - rampOut) return 1
  if (p < end) return 1 - (p - (end - rampOut)) / rampOut
  return 0
}

// A slide-up-on-entry offset (in px) for the same beat -- distance at
// `start`, settling to 0 by `start+rampIn`, staying at 0 afterward.
export function beatY(p: number, start: number, rampIn: number, distance = 16) {
  return (1 - Math.min(1, Math.max(0, (p - start) / rampIn))) * distance
}
