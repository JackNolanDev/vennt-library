export const titleText = (text: string): string =>
  text
    .toLowerCase()
    .replaceAll(/^[a-z]|(?<=_)[a-z]/gm, (match) => match.toUpperCase())
    .replaceAll("_", " ");
