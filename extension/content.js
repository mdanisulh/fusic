(async () => {
  const songs = [];
  const n = parseInt(
    document
      .querySelector(
        "#main > div > div.ZQftYELq0aOsg6tPbVbV > div.jEMA2gVoLgPQqAFrPhFw > div > div.main-view-container__scroll-node.main-view-container__scroll-node--offset-topbar > div:nth-child(2) > div > main > section > div.NXiYChVp4Oydfxd7rT5r.NxEINIJHGytq4gF1r2N1.or84FBarW2zQhXfB9VFb.odS2IW9wfNVHhkhc0l_X.XNjgtSbyhshr7YQcVvry.O0AN8Ty_Cxd4iLwyKATB.JYKKZFIXuf9lIHVeszuS > div.iWTIFTzhRZT0rCD0_gOK.contentSpacing > div.RP2rRchy4i8TIp1CTmb7 > div > div.GI8QLntnaSCh2ONX_y2c > span:nth-child(1)",
      )
      ?.innerText.split(" ")[0] ?? 0,
  );
  if (n === 0) {
    return;
  }
  const name = document.querySelector(
    "#main > div > div.ZQftYELq0aOsg6tPbVbV > div.jEMA2gVoLgPQqAFrPhFw > div > div.main-view-container__scroll-node.main-view-container__scroll-node--offset-topbar > div:nth-child(2) > div > main > section > div.NXiYChVp4Oydfxd7rT5r.NxEINIJHGytq4gF1r2N1.or84FBarW2zQhXfB9VFb.odS2IW9wfNVHhkhc0l_X.XNjgtSbyhshr7YQcVvry.O0AN8Ty_Cxd4iLwyKATB.JYKKZFIXuf9lIHVeszuS > div.iWTIFTzhRZT0rCD0_gOK.contentSpacing > div.RP2rRchy4i8TIp1CTmb7 > span.rEN7ncpaUeSGL9z0NGQR",
  )?.innerText;

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
