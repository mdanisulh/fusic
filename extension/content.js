(async () => {
  const songs = [];
  const title = document.querySelector('[data-testid="entityTitle"]');
  const n = parseInt(
    title.parentElement.parentElement.children[3].children[4].children[0]?.innerText.split(
      " ",
    )[0] ?? 0,
  );
  if (n === 0) {
    return;
  }
  const name = title?.innerText;

  for (let i = 2; i <= n + 1; i++) {
    const div = document.querySelector(`[aria-rowindex="${i}"]`);
    if (div == null) {
      i--;
      const prevDiv = document.querySelector(`[aria-rowindex="${i}"]`);
      prevDiv.scrollIntoView();
      await new Promise((resolve) => setTimeout(resolve, 500));
      continue;
    }
    const text = div.innerText.split("\n");
    songs.push([text[1], text[2], text[3]]);
  }

  const json = JSON.stringify({ name, songs });
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.fusic`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
})();
