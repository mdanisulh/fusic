"use client";

export default function getAverageColor(
  data: HTMLImageElement | string,
): Promise<string> {
  let image = new Image(56, 56);
  if (typeof data === "string") {
    image.src = data;
  } else if (data instanceof HTMLImageElement) {
    image = data;
  }
  image.crossOrigin = "Anonymous";
  return new Promise((resolve, reject) => {
    const tryResolveColor = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, image.width, image.height);
      const color = getColor(imageData.data);
      resolve(color);
    };
    if (image.complete && image.naturalWidth !== 0) {
      tryResolveColor();
    } else {
      image.onload = tryResolveColor;
      image.onerror = () => {
        reject(new Error("Failed to load image"));
      };
    }
  });
}

function getColor(arr: Uint8ClampedArray) {
  const len = arr.length;
  let red = 0;
  let green = 0;
  let blue = 0;
  let alpha = 0;
  let count = 0;

  for (let i = 0; i < len; i += 4) {
    red += arr[i] * arr[i + 3];
    green += arr[i + 1] * arr[i + 3];
    blue += arr[i + 2] * arr[i + 3];
    alpha += arr[i + 3];
    count++;
  }
  const [r, g, b] = adjustColorLightness(
    red / alpha,
    green / alpha,
    blue / alpha,
  );
  return `rgba(${r},${g},${b},${alpha / count})`;
}

function adjustColorLightness(r: number, g: number, b: number) {
  // Convert RGB to HSL
  (r /= 255), (g /= 255), (b /= 255);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h! /= 6;
  }

  // Adjust lightness
  const lowerThreshold = 0.3;
  const higherThreshold = 0.5;

  if (l < lowerThreshold) {
    l = lowerThreshold; // Make it lighter if too dark
  } else if (l > higherThreshold) {
    l = higherThreshold; // Make it darker if too light
  }

  // Convert HSL back to RGB
  let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  let p = 2 * l - q;
  function hue2rgb(p: number, q: number, t: number) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  r = hue2rgb(p, q, h! + 1 / 3);
  g = hue2rgb(p, q, h!);
  b = hue2rgb(p, q, h! - 1 / 3);

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
