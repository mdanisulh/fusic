export default function formatTime(time: number): string {
  return `${Math.floor(time / 60)}:${Math.floor(time % 60)
    .toString()
    .padStart(2, "0")}`;
}

export const formatDuration = (totalDuration: number) => {
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);
  const seconds = Math.floor(totalDuration % 60);
  let formattedDuration = "";
  if (hours > 0) {
    formattedDuration += `${hours} hr `;
  }
  if (minutes > 0) {
    formattedDuration += `${minutes} min `;
  }
  if (hours === 0 && seconds > 0) {
    formattedDuration += `${seconds} sec`;
  }
  return formattedDuration.trim();
};
