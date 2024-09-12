chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes("spotify.com/playlist/")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
  } else {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "logo.png",
      title: "Error",
      message: "This extension only works on Spotify playlist pages",
    });
  }
});
