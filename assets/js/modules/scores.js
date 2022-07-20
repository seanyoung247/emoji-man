/*jshint esversion: 6 */

// Should probably do something better than this if we have time:
export let currentScore = 0;

export function incScore(amount) {
    currentScore += amount;
}

export function resetScore() {
    currentScore = 0;
}