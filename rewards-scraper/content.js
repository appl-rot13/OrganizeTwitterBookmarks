(async () => {
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  await sleep(1000);

  const input = document.querySelector('input#variableAmount');
  const required = document.querySelector('div#variableCalculatedPoints');
  const progress = document.querySelector('div#variablePrgressText');
  if (!input || !required || !progress) {
    return;
  }

  const results = [];
  for (let amount = 600; amount <= 14000; amount += 1) {
    input.value = amount;
    input.dispatchEvent(new Event('keyup', { bubbles: true }));
    await sleep(10);

    const target = window.getComputedStyle(required).display !== 'none' ? required : progress;
    const point = Number(target.innerText.match(/(\d+)\s*(points|ポイント)/)[1]);

    results.push({ Amount: amount, Point: point });
  }

  const downloadAsCsv = (data, filename) => {
    if (!Array.isArray(data) || data.length === 0) {
      return;
    }

    const header = Object.keys(data[0]);
    const csv = [
      header,
      ...data.map(obj => header.map(key => obj[key]))
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  };

  downloadAsCsv(results, 'results.csv');
})();
