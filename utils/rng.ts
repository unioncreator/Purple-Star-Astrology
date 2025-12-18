
/**
 * A simple seeded random number generator (Linear Congruential Generator).
 * We use this to ensure the "randomness" is explicitly tied to the click timestamp.
 */
export class SeededRNG {
  private state: number;

  constructor(seed: number) {
    this.state = seed;
  }

  // Returns a random float between 0 and 1
  next(): number {
    this.state = (this.state * 16807) % 2147483647;
    return (this.state - 1) / 2147483646;
  }

  // Returns a random integer in [min, max]
  nextInt(min: number, max: number): number {
    //return Math.floor(1.0*this.state * (max - min + 1)) + min;
    return this.state % (max -min + 1) + min
  }
}
