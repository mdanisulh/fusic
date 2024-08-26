export const decodeHtmlEntities = (str: string): string => {
  const entities: { [key: string]: string } = {
    "&quot;": '"',
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&apos;": "'",
    "&nbsp;": " ",
  };

  return str.replace(
    /&quot;|&amp;|&lt;|&gt;|&apos;|&nbsp;/g,
    (match) => entities[match],
  );
};
