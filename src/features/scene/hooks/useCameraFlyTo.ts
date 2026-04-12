import { useEffect, useRef } from "react";
import type { CameraPose, Vec3 } from "../types";
import { easeInOutCubic } from "../easing";

const DEFAULT_DURATION_MS = 1400;
const REDUCED_MOTION_DURATION_MS = 200;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpVec3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

// Pure pose interpolation. Applies ease-in-out-cubic to the progress value.
// Unit tested; safe to use in render code.
export function interpolatePose(
  from: CameraPose,
  to: CameraPose,
  progress: number,
): CameraPose {
  const eased = easeInOutCubic(progress);
  return {
    position: lerpVec3(from.position, to.position, eased),
    lookAt: lerpVec3(from.lookAt, to.lookAt, eased),
  };
}

export interface FlyToState {
  currentPose: CameraPose;
  isFlying: boolean;
}

interface UseCameraFlyToOptions {
  targetPose: CameraPose;
  reducedMotion?: boolean;
  onArrive?: () => void;
}

/**
 * Tracks a camera pose that animates toward `targetPose` over DEFAULT_DURATION_MS
 * (or REDUCED_MOTION_DURATION_MS when `reducedMotion` is true). Calling with a new
 * `targetPose` while a flight is in progress cancels the current tween and starts a
 * new one from the current interpolated pose.
 *
 * The hook returns a ref-like accessor that callers poll inside useFrame.
 * It does NOT directly touch the three.js camera — that's the CameraRig's job.
 *
 * Call `read(now)` fresh from the useFrame loop each frame; do not capture `read`
 * across renders (its identity is not stable).
 */
export function useCameraFlyTo({
  targetPose,
  reducedMotion = false,
  onArrive,
}: UseCameraFlyToOptions) {
  const onArriveRef = useRef(onArrive);
  useEffect(() => {
    onArriveRef.current = onArrive;
  });

  const stateRef = useRef<{
    fromPose: CameraPose;
    toPose: CameraPose;
    startTime: number | null;
    duration: number;
    arrived: boolean;
  }>({
    fromPose: targetPose,
    toPose: targetPose,
    startTime: null,
    duration: DEFAULT_DURATION_MS,
    arrived: true,
  });

  useEffect(() => {
    const state = stateRef.current;
    // Capture the current pose as the new from-pose by evaluating progress now.
    const now = performance.now();
    const currentPose =
      state.startTime === null
        ? state.toPose
        : interpolatePose(
            state.fromPose,
            state.toPose,
            (now - state.startTime) / state.duration,
          );
    state.fromPose = currentPose;
    state.toPose = targetPose;
    state.startTime = now;
    state.duration = reducedMotion
      ? REDUCED_MOTION_DURATION_MS
      : DEFAULT_DURATION_MS;
    state.arrived = false;
  }, [targetPose, reducedMotion]);

  // Consumers call this each frame to read the current pose.
  function read(now: number): FlyToState {
    const state = stateRef.current;
    if (state.startTime === null) {
      return { currentPose: state.toPose, isFlying: false };
    }
    const rawProgress = (now - state.startTime) / state.duration;
    if (rawProgress >= 1) {
      if (!state.arrived) {
        state.arrived = true;
        onArriveRef.current?.();
      }
      return { currentPose: state.toPose, isFlying: false };
    }
    return {
      currentPose: interpolatePose(state.fromPose, state.toPose, rawProgress),
      isFlying: true,
    };
  }

  return { read };
}
