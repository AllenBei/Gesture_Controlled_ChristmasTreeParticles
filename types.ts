export enum GestureType {
  NONE = 'NONE',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED'
}

export interface HandControllerProps {
  onGestureChange: (gesture: GestureType) => void;
  active: boolean;
}
