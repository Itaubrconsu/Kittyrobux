const onlineCount = document.getElementById('online-count');
let currentOnline = 1100;
onlineCount.textContent = currentOnline.toLocaleString('pt-BR');
setInterval(() => {
  currentOnline += Math.floor(Math.random() * 7) - 3;
  currentOnline = Math.max(1000, Math.min(1300, currentOnline));
  onlineCount.textContent = currentOnline.toLocaleString('pt-BR');
}, 8000);

const packs = [
  [415, 9.99],
  [500, 15.00],
  [1000, 29.99],
  [1149, 39.99],
  [1686, 59.99]
];
let selected = null;
let countdownInterval = null;
const fmt = n => n.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
const grid = document.getElementById('packages');

packs.forEach(([robux, price], i) => {
  const b = document.createElement('button');
  b.className = 'package';
  b.type = 'button';
  b.innerHTML = `<span class="coin" aria-hidden="true">🪙</span>
    <span><span class="amount">${robux}</span><br><span class="unit">ROBUX</span></span>
    <span class="price"><span class="sale-price">${fmt(price)}</span></span>`;
  b.addEventListener('click', () => {
    selected = i;
    document.querySelectorAll('.package').forEach(x => x.classList.remove('selected'));
    b.classList.add('selected');
    document.getElementById('chosen').textContent = `${robux} Robux — ${fmt(price)}`;
    document.getElementById('continue').disabled = false;
  });
  grid.appendChild(b);
});

const toast = document.getElementById('purchase-toast');
const toastMessage = document.getElementById('toast-message');
let toastTimer = null;
function showDemoNotification() {
  const [robux, price] = packs[Math.floor(Math.random() * packs.length)];
  toastMessage.textContent = `Pacote de ${robux} Robux (${fmt(price)}) selecionado.`;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 5200);
}
setTimeout(showDemoNotification, 3500);
function scheduleDemoNotification() {
  setTimeout(() => {
    showDemoNotification();
    scheduleDemoNotification();
  }, 18000 + Math.floor(Math.random() * 18000));
}
scheduleDemoNotification();

function startPaymentCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);
  let remaining = 60;
  const panel = document.getElementById('countdown-panel');
  const display = document.getElementById('countdown');
  const message = document.getElementById('expiry-message');
  const copyButton = document.getElementById('copy');
  panel.classList.remove('expired');
  message.textContent = 'Pagamento indisponível nesta versão.';
  copyButton.disabled = false;
  copyButton.style.opacity = '1';
  const tick = () => {
    display.textContent = `${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;
    if (remaining <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      panel.classList.add('expired');
      message.textContent = 'Tempo encerrado! Volte e selecione o pacote novamente.';
      copyButton.disabled = true;
      copyButton.style.opacity = '.45';
      return;
    }
    remaining--;
  };
  tick();
  countdownInterval = setInterval(tick, 1000);
}

document.getElementById('continue').addEventListener('click', () => {
  if (selected === null) return;
  document.getElementById('total').textContent = fmt(packs[selected][1]);
  startPaymentCountdown();
  document.getElementById('store').classList.add('hidden');
  document.getElementById('payment').classList.remove('hidden');
  window.scrollTo(0, 0);
});
document.getElementById('back').addEventListener('click', () => {
  if (countdownInterval) clearInterval(countdownInterval);
  document.getElementById('payment').classList.add('hidden');
  document.getElementById('store').classList.remove('hidden');
  window.scrollTo(0, 0);
});
document.getElementById('copy').addEventListener('click', async () => {
  const demoText = 'Pix indisponível nesta versão. Nenhum código de pagamento foi configurado.';
  try {
    await navigator.clipboard.writeText(demoText);
    document.getElementById('copy').textContent = 'Pix indisponível';
  } catch (e) {
    document.getElementById('copy').textContent = 'Pix indisponível';
  }
});
