const CURRENCIES = [
  { code: 'HKD', flag: '🇭🇰', symbol: 'HK$',  name: 'HK Dollar',        decimals: 2 },
  { code: 'VND', flag: '🇻🇳', symbol: '₫',     name: 'Vietnamese Dong',  decimals: 0 },
  { code: 'KRW', flag: '🇰🇷', symbol: '₩',     name: 'Korean Won',       decimals: 0 },
  { code: 'USD', flag: '🇺🇸', symbol: '$',      name: 'US Dollar',        decimals: 2 },
  { code: 'CNY', flag: '🇨🇳', symbol: '¥',      name: 'Chinese Yuan',     decimals: 2 },
  { code: 'TWD', flag: '🇹🇼', symbol: 'NT$',    name: 'Taiwan Dollar',    decimals: 2 },
  { code: 'SGD', flag: '🇸🇬', symbol: 'S$',     name: 'Singapore Dollar', decimals: 2 },
  { code: 'MYR', flag: '🇲🇾', symbol: 'RM',     name: 'Malaysian Ringgit',decimals: 2 },
];

// Fallback rates relative to HKD (1 HKD = X)
const FALLBACK = { HKD:1, VND:3357.42, KRW:185.2, USD:0.1282, CNY:0.929, TWD:4.19, SGD:0.172, MYR:0.570 };

let rates = null;
let rateDate = null;
let fromCode = localStorage.getItem('fromCode') || 'HKD';
let toCode   = localStorage.getItem('toCode')   || 'VND';
let swapFlipped = false;

const amountInput = document.getElementById('amount');
const resultEl    = document.getElementById('result');
const swapBtn     = document.getElementById('swap-btn');
const fromSelect  = document.getElementById('from-select');
const toSelect    = document.getElementById('to-select');

// Populate selects
CURRENCIES.forEach(c => {
  const opt = (sel, selected) => {
    const o = document.createElement('option');
    o.value = c.code;
    o.textContent = `${c.flag} ${c.code}`;
    if (selected) o.selected = true;
    sel.appendChild(o);
  };
  opt(fromSelect, c.code === fromCode);
  opt(toSelect,   c.code === toCode);
});

async function fetchRates() {
  const rateLabel = document.getElementById('rate-label');
  try {
    const res  = await fetch('https://open.er-api.com/v6/latest/HKD');
    const data = await res.json();
    if (data.result !== 'success') throw new Error('bad response');
    rates    = data.rates;
    rateDate = data.time_last_update_utc
      ? new Date(data.time_last_update_utc).toISOString().slice(0, 10)
      : '';
    updateRateLabel();
    convert();
  } catch {
    rates    = { ...FALLBACK };
    rateDate = null;
    updateRateLabel();
  }
}

function getCurrency(code) {
  return CURRENCIES.find(c => c.code === code);
}

function updateRateLabel() {
  const rateLabel = document.getElementById('rate-label');
  const r = rates[toCode] / rates[fromCode];
  const to = getCurrency(toCode);
  const formatted = r.toLocaleString('en-US', {
    minimumFractionDigits: to.decimals,
    maximumFractionDigits: to.decimals > 0 ? to.decimals + 2 : 2,
  });
  const tag = rateDate ? `live · ${rateDate}` : 'fallback';
  rateLabel.textContent = `1 ${fromCode} = ${formatted} ${toCode} (${tag})`;

  const from = getCurrency(fromCode);
  document.getElementById('input-label').textContent   = `Amount in ${fromCode}`;
  document.getElementById('input-symbol').textContent  = from.symbol;
  document.getElementById('output-label').textContent  = `Amount in ${toCode}`;
  document.getElementById('output-symbol').textContent = to.symbol;
  document.title = `${fromCode} ↔ ${toCode}`;
}

function convert() {
  if (!rates) return;
  const val = parseFloat(amountInput.value);
  if (isNaN(val) || amountInput.value === '') {
    resultEl.textContent = 'Enter an amount';
    resultEl.classList.add('empty');
    return;
  }
  const to = getCurrency(toCode);
  const converted = val * (rates[toCode] / rates[fromCode]);
  resultEl.textContent = converted.toLocaleString('en-US', {
    minimumFractionDigits: to.decimals,
    maximumFractionDigits: to.decimals,
  });
  resultEl.classList.remove('empty');
}

function onCurrencyChange() {
  fromCode = fromSelect.value;
  toCode   = toSelect.value;
  localStorage.setItem('fromCode', fromCode);
  localStorage.setItem('toCode',   toCode);
  updateRateLabel();
  convert();
}

function swap() {
  [fromCode, toCode] = [toCode, fromCode];
  fromSelect.value = fromCode;
  toSelect.value   = toCode;
  localStorage.setItem('fromCode', fromCode);
  localStorage.setItem('toCode',   toCode);
  swapFlipped = !swapFlipped;
  swapBtn.classList.toggle('flipped', swapFlipped);
  updateRateLabel();
  amountInput.value = '';
  resultEl.textContent = 'Enter an amount';
  resultEl.classList.add('empty');
  amountInput.focus();
}

function reset() {
  amountInput.value = '';
  resultEl.textContent = 'Enter an amount';
  resultEl.classList.add('empty');
  amountInput.focus();
}

amountInput.addEventListener('input', convert);
fetchRates();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
