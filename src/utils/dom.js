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

export function loadAndSaveJsonToLocalStorage(cb) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';

  input.onchange = async (event) => {
    const file = event.target.files[0];
    if (!file) return

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const data = JSON.parse(json)

      cb(data)
    } catch (err) {
      console.error('Ошибка загрузки JSON:', err);
    }
  };

  input.click();
}
