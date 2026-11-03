export const calculateResults = (
  typedText: string, 
  targetText: string, 
  timeElapsedSeconds: number
) => {
  // 1. Calculate time in minutes (prevent division by zero)
  const timeInMinutes = Math.max(timeElapsedSeconds / 60, 0.01); 

  // 2. Word-based calculation
  const typedWords = typedText.trim().split(/\s+/).filter(w => w !== "");
  const totalWords = typedWords.length;
  
  if (totalWords === 0) {
    return { grossWpm: 0, accuracy: 0, netWpm: 0, correctWords: 0, totalWords: 0 };
  }

  const masterWords = targetText.split(" ");
  let correctWords = 0;

  for (let i = 0; i < totalWords; i++) {
    if (typedWords[i].toLowerCase() === masterWords[i]?.toLowerCase()) {
      correctWords++;
    }
  }

  // 3. Standard Formulas
  const grossWpm = Math.round(totalWords / timeInMinutes);
  const accuracy = Math.round((correctWords / totalWords) * 100);
  const netWpm = Math.round(grossWpm * (accuracy / 100));

  return { grossWpm, accuracy, netWpm, correctWords, totalWords };
};