export function downloadJson(data, filename = "data.json") {
  const jsonStr = JSON.stringify(data, null, 2); // форматированный JSON
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  console.log('data ', data)

  URL.revokeObjectURL(url);
}
