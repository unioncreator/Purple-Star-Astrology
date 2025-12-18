
export enum BallType {
  WHITE = 'WHITE',
  POWERBALL = 'POWERBALL'
}

export interface DrawnNumber {
  value: number;
  type: BallType;
  timestamp: number;
}

export interface DrawState {
  currentNumbers: DrawnNumber[];
  isComplete: boolean;
}
