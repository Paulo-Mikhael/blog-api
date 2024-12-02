export function itHas(text: string, stringArray: string[]) {
  for (let i = 0; i < stringArray.length; i++) {
    if (text.includes(stringArray[i])) {
      return true;
    }
  }

  return false;
}
