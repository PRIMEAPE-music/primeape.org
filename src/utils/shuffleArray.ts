/**
 * Fisher-Yates shuffle algorithm
 * Creates a new shuffled array without modifying the original
 * 
 * @param array - Array to shuffle
 * @returns New shuffled array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Get next item from shuffled queue
 * If current item is last in queue, reshuffle and start over
 * 
 * @param currentItem - Current item
 * @param originalArray - Original unshuffled array
 * @param shuffledQueue - Current shuffled queue
 * @returns Object with nextItem and newQueue
 */
export function getNextShuffledItem<T>(
  currentItem: T,
  originalArray: T[],
  shuffledQueue: T[]
): { nextItem: T; newQueue: T[] } {
  const currentIndex = shuffledQueue.findIndex(item => item === currentItem);
  
  // If at end of queue, reshuffle
  if (currentIndex === -1 || currentIndex >= shuffledQueue.length - 1) {
    const newQueue = shuffleArray(originalArray);
    return {
      nextItem: newQueue[0],
      newQueue,
    };
  }
  
  // Return next item in current queue
  return {
    nextItem: shuffledQueue[currentIndex + 1],
    newQueue: shuffledQueue,
  };
}

/**
 * Get previous item from shuffled queue
 * 
 * @param currentItem - Current item
 * @param shuffledQueue - Current shuffled queue
 * @returns Previous item or current if at start
 */
export function getPreviousShuffledItem<T>(
  currentItem: T,
  shuffledQueue: T[]
): T {
  const currentIndex = shuffledQueue.findIndex(item => item === currentItem);
  
  if (currentIndex <= 0) {
    return currentItem; // Stay at first item
  }
  
  return shuffledQueue[currentIndex - 1];
}