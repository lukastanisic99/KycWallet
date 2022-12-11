function addNewLines(str: string, n: number) {
    let newString = "";
    let currentLineLength = 0;
  
    for (const ch of str) {
      if (currentLineLength === n) {
        newString += "\n"
        currentLineLength = 0;
      }
  
      newString += ch;
      currentLineLength++;
    }
  
    return newString;
  }

export { addNewLines }