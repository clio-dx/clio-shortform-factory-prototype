const rows = [...document.querySelectorAll('#platformRows tr')];
const metricSets = {
  all: { videos: '126', views: '3.84M', eng: '5.8%', roi: '4.2<span>x</span>' },
  instagram: { videos: '54', views: '1.68M', eng: '6.2%', roi: '4.6<span>x</span>' },
  tiktok: { videos: '48', views: '1.72M', eng: '6.8%', roi: '4.4<span>x</span>' },
  youtube: { videos: '24', views: '438K', eng: '3.1%', roi: '2.8<span>x</span>' }
};

function toast(message, detail) {
  const host = document.querySelector('#toastStack');
  host.innerHTML = `<div class="toast"><span>✓</span><div><b>${message}</b><small>${detail}</small></div></div>`;
  setTimeout(() => host.innerHTML = '', 2800);
}

document.querySelectorAll('[data-platform]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-platform]').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const platform = button.dataset.platform;
  rows.forEach(row => row.hidden = platform !== 'all' && row.dataset.platform !== platform);
  const data = metricSets[platform];
  Object.entries(data).forEach(([key, value]) => document.querySelector(`[data-metric="${key}"]`).innerHTML = value);
}));

document.querySelector('#periodSelect').addEventListener('change', event => {
  const label = event.target.selectedOptions[0].textContent;
  toast(`${label} 데이터로 갱신했어요`, '모든 성과 지표에 동일하게 적용됩니다.');
});

document.querySelector('#exportButton').addEventListener('click', () => toast('리포트를 준비했어요', '샘플 CSV 내보내기 동작입니다.'));

document.querySelectorAll('.date-control button').forEach(button => button.addEventListener('click', () => toast('비교 기간을 변경했어요', '2026. 08. 11 — 08. 31')));
