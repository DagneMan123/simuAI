export enum IntegrityViolation {
  TAB_SWITCH = 'TAB_SWITCH',
  COPY_PASTE = 'COPY_PASTE',
  SCREENSHOT = 'SCREENSHOT',
  MULTIPLE_INSTANCES = 'MULTIPLE_INSTANCES',
  TIME_EXCEEDED = 'TIME_EXCEEDED',
  UNAUTHORIZED_ASSISTANCE = 'UNAUTHORIZED_ASSISTANCE',
}

export const INTEGRITY_RULES = {
  MAX_TAB_SWITCHES: 3,
  ALLOW_COPY: false,
  ALLOW_PASTE: false,
  ALLOW_SCREENSHOT: false,
  ALLOW_MULTIPLE_TABS: false,
  MONITOR_IDLE_TIME: true,
  MAX_IDLE_TIME: 30000, // 30 seconds
  RECORD_AUDIO: false,
  RECORD_VIDEO: false,
  MONITOR_NETWORK: true,
};

export const VIOLATION_PENALTIES = {
  [IntegrityViolation.TAB_SWITCH]: {
    points: -10,
    message: 'Tab switching detected',
    warning: 'Please remain in the test window',
    action: 'WARNING'
  },
  [IntegrityViolation.COPY_PASTE]: {
    points: -20,
    message: 'Copy-paste detected',
    warning: 'Copying content is not allowed',
    action: 'DISABLE_TEST'
  },
  [IntegrityViolation.SCREENSHOT]: {
    points: -30,
    message: 'Screenshot attempt detected',
    warning: 'Screenshots are prohibited',
    action: 'TERMINATE_TEST'
  },
  [IntegrityViolation.MULTIPLE_INSTANCES]: {
    points: -50,
    message: 'Multiple test instances detected',
    warning: 'Only one test session allowed',
    action: 'TERMINATE_TEST'
  },
  [IntegrityViolation.TIME_EXCEEDED]: {
    points: 0,
    message: 'Time limit exceeded',
    warning: 'Test time has ended',
    action: 'SUBMIT_TEST'
  },
  [IntegrityViolation.UNAUTHORIZED_ASSISTANCE]: {
    points: -100,
    message: 'Unauthorized assistance detected',
    warning: 'External help is prohibited',
    action: 'TERMINATE_TEST_AND_BAN'
  },
};

export const INTEGRITY_MESSAGES = {
  WARNING: {
    title: 'Integrity Warning',
    description: 'Your action has been flagged. Continued violations may result in test termination.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    icon: '⚠️'
  },
  VIOLATION: {
    title: 'Integrity Violation',
    description: 'A serious violation has been detected. Your test may be terminated.',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    icon: '🚫'
  },
  TERMINATED: {
    title: 'Test Terminated',
    description: 'Your test has been terminated due to multiple integrity violations.',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: '❌'
  }
};

export const INTEGRITY_EVENTS = {
  TAB_VISIBILITY_CHANGE: 'visibilitychange',
  FULLSCREEN_CHANGE: 'fullscreenchange',
  CONTEXT_MENU: 'contextmenu',
  COPY: 'copy',
  PASTE: 'paste',
  KEYDOWN: 'keydown',
  KEYPRESS: 'keypress',
  KEYUP: 'keyup',
  MOUSEDOWN: 'mousedown',
  MOUSEUP: 'mouseup',
  MOUSEMOVE: 'mousemove',
  BLUR: 'blur',
  FOCUS: 'focus',
  BEFORE_UNLOAD: 'beforeunload',
};

export const ALLOWED_KEYS = [
  'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
  'Tab', 'Enter', 'Escape', 'Home', 'End', 'PageUp', 'PageDown',
  ...Array.from({ length: 10 }, (_, i) => `Digit${i}`),
  ...Array.from({ length: 26 }, (_, i) => `Key${String.fromCharCode(65 + i)}`),
  'Space', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight',
  'AltLeft', 'AltRight', 'CapsLock', 'NumLock', 'ScrollLock'
];