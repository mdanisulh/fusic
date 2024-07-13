export default function shuffleArray(length: number, index?: number) {
  if (!index) index = Math.floor(Math.random() * length);
  let arr = [...Array(length).keys()];
  arr = arr.filter((item) => item !== index);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  arr.unshift(index);
  return arr;
}
