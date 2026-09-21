const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

let selectedReference = null;
let selectedLanguage = '한국어';
let generationTimer = null;

const promptTemplates = {
  '제형 집중': '처음 2초에 제형 클로즈업을 배치하고, 퍼프가 피부 위를 미끄러지는 질감을 ASMR처럼 표현해주세요. 얇은 밀착감과 광채 피니시를 강조합니다.',
  '가격 집중': '정가와 프로모션 가격을 영상 전반부에 크게 노출하고, 동일 가격대 대비 커버력과 지속력의 장점을 숫자로 비교해주세요.',
  'UGC 후기': '친구에게 추천하듯 자연스러운 셀프캠 톤으로 시작합니다. 출근 전 사용 → 오후 6시 피부 상태 → 한 줄 총평 순서로 구성해주세요.',
  '밈 · 챌린지': '첫 장면은 화장이 무너진 과장된 리액션, 비트 드롭과 함께 제품 사용, 마지막에는 10초 수정화장 성공 포즈로 마무리해주세요.'
};

function showToast(message, detail = '') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✓</span><div><b>${message}</b>${detail ? `<small>${detail}</small>` : ''}</div>`;
  $('#toastStack').appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 240);
  }, 3200);
}

function closeModal() {
  $('#modalRoot').innerHTML = '';
  document.body.classList.remove('modal-open');
}

function openModal({ title, kicker = '', content, actions = '', wide = false }) {
  $('#modalRoot').innerHTML = `
    <div class="modal-backdrop" role="presentation">
      <section class="modal ${wide ? 'modal-wide' : ''}" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <header><div>${kicker ? `<p class="eyebrow">${kicker}</p>` : ''}<h2 id="modalTitle">${title}</h2></div><button class="modal-close" aria-label="닫기">×</button></header>
        <div class="modal-body">${content}</div>
        ${actions ? `<footer>${actions}</footer>` : ''}
      </section>
    </div>`;
  document.body.classList.add('modal-open');
  $('.modal-close').addEventListener('click', closeModal);
  $('.modal-backdrop').addEventListener('click', event => {
    if (event.target.classList.contains('modal-backdrop')) closeModal();
  });
}

function updateCreateState() {
  const checked = $('#productCheck').checked;
  $('#createButton').disabled = !(checked && selectedReference);
  $('.product-card').classList.toggle('selected', checked);
  $('.check-dot').style.display = checked ? '' : 'none';
}

$('#productCheck').addEventListener('change', updateCreateState);

$$('.reference-card').forEach(card => card.addEventListener('click', () => {
  $$('.reference-card').forEach(item => item.classList.remove('selected'));
  card.classList.add('selected');
  selectedReference = card.dataset.title;
  const image = card.querySelector('img');
  $('#selectedRefThumb').innerHTML = image
    ? `<img src="${image.src}" alt="선택한 레퍼런스" style="width:100%;height:100%;object-fit:cover">`
    : '<b>✦</b>';
  $('#selectedRefThumb').title = selectedReference;
  updateCreateState();
}));

$$('#categoryChips button').forEach(button => button.addEventListener('click', () => {
  $$('#categoryChips button').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const category = button.dataset.category;
  $$('.reference-card').forEach(card => {
    card.hidden = category !== 'all' && !card.dataset.category.includes(category);
  });
}));

$('#refSearch').addEventListener('input', event => {
  const query = event.target.value.trim().toLowerCase();
  $$('.reference-card').forEach(card => {
    card.hidden = !card.dataset.title.toLowerCase().includes(query);
  });
});

$$('.source-tabs button').forEach(button => button.addEventListener('click', () => {
  $$('.source-tabs button').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  showToast(`${button.childNodes[0].textContent.trim()} 레퍼런스를 불러왔어요`, '인기순으로 정렬했습니다.');
}));

$$('#languageTabs button').forEach(button => button.addEventListener('click', () => {
  $$('#languageTabs button').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  selectedLanguage = button.textContent;
}));

$('.upload-box input').addEventListener('change', event => {
  if (event.target.files[0]) showToast('제품 파일을 추가했어요', event.target.files[0].name);
});

$('.product-panel .text-button').addEventListener('click', () => {
  openModal({
    kicker: 'PRODUCT LIBRARY',
    title: '제품 추가',
    content: `<div class="modal-form two-col">
      <label>품명<input value="샤프 쏘 심플 워터프루프 펜슬 라이너" /></label>
      <label>카테고리<select><option>아이</option><option>쿠션</option><option>베이스</option></select></label>
      <label class="span-2">상세페이지 URL<input placeholder="https://clubclio.co.kr/..." /></label>
      <label class="span-2">핵심 강점<textarea rows="3">2mm 슬림 펜슬, 번짐 없는 24시간 워터프루프</textarea></label>
    </div>`,
    actions: '<button class="ghost-modal" data-close>취소</button><button class="modal-primary" id="addProductConfirm">제품 저장</button>'
  });
  $('[data-close]').addEventListener('click', closeModal);
  $('#addProductConfirm').addEventListener('click', () => { closeModal(); showToast('제품을 라이브러리에 저장했어요'); });
});

$('#templateButton').addEventListener('click', () => {
  const cards = Object.entries(promptTemplates).map(([name, text]) => `
    <button class="template-card" data-template="${name}"><span>${name.includes('UGC') ? 'UGC' : name.includes('밈') ? 'FUN' : 'AD'}</span><b>${name}</b><small>${text}</small><i>템플릿 사용 →</i></button>`).join('');
  openModal({ kicker: 'PROMPT LIBRARY', title: '카테고리별 프롬프트', content: `<div class="template-grid">${cards}</div>`, wide: true });
  $$('.template-card').forEach(card => card.addEventListener('click', () => {
    $('#directionPrompt').value = promptTemplates[card.dataset.template];
    closeModal();
    showToast(`‘${card.dataset.template}’ 템플릿을 적용했어요`);
  }));
});

function automationModal() {
  openModal({
    kicker: 'AUTOMATION',
    title: '자동 생성 · 업로드',
    wide: true,
    content: `<div class="automation-layout">
      <div class="automation-main">
        <div class="modal-tabs" id="autoMode"><button class="active" data-mode="goal">목표 기반</button><button data-mode="daily">매일 반복</button></div>
        <div id="goalFields" class="modal-form two-col">
          <label>목표 영상 수<input type="number" value="50" min="1" /></label><label>최대 예산<input value="₩500,000" /></label>
          <div class="info-box span-2"><b>예상 48개 제작</b><span>현재 모델 기준 약 ₩486,400 · 12일 소요</span></div>
        </div>
        <div id="dailyFields" class="modal-form two-col" hidden>
          <label>하루 생성 수<input type="number" value="10" min="1" /></label><label>업로드 시작<select><option>오전 9:00</option><option>오후 12:00</option><option>오후 6:00</option></select></label>
          <label class="span-2">종료일<input type="date" value="2026-10-31" /></label>
        </div>
        <div class="setting-block"><b>주제 방식</b><div class="choice-row"><label><input type="radio" name="topic" checked /> 자유 주제</label><label><input type="radio" name="topic" /> 카테고리 순환</label><label><input type="radio" name="topic" /> 프롬프트 고정</label></div></div>
        <div class="setting-block"><b>카테고리</b><div class="chips static"><button class="active">UGC</button><button>메이크업</button><button>챌린지</button><button>AI 애니</button></div></div>
      </div>
      <aside class="automation-side"><h3>자동 업로드</h3><label class="switch-row"><span><b>Instagram Reels</b><small>@clio_official</small></span><input type="checkbox" checked /></label><label class="switch-row"><span><b>TikTok</b><small>@clio_official</small></span><input type="checkbox" checked /></label><label class="switch-row"><span><b>YouTube Shorts</b><small>CLIO Official</small></span><input type="checkbox" /></label><hr><p>검수 없이 바로 게시</p><label class="toggle"><input type="checkbox" /><span></span></label><small>끄면 승인 대기함에 저장됩니다.</small></aside>
    </div>`,
    actions: '<button class="ghost-modal" data-close>취소</button><button class="modal-primary" id="saveAutomation">자동화 시작</button>'
  });
  $('[data-close]').addEventListener('click', closeModal);
  $$('#autoMode button').forEach(button => button.addEventListener('click', () => {
    $$('#autoMode button').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    $('#goalFields').hidden = button.dataset.mode !== 'goal';
    $('#dailyFields').hidden = button.dataset.mode !== 'daily';
  }));
  $$('.chips.static button').forEach(button => button.addEventListener('click', () => button.classList.toggle('active')));
  $('#saveAutomation').addEventListener('click', () => {
    closeModal();
    showToast('자동화를 시작했어요', '첫 영상은 검수 대기함에 저장됩니다.');
  });
}

$('#automationButton').addEventListener('click', automationModal);
$('.topbar nav a[href="#automation"]').addEventListener('click', event => { event.preventDefault(); automationModal(); });

function resultCard(id, title, status, image, meta, cost) {
  return `<article class="result-card">
    <label class="result-check"><input type="checkbox" data-result="${id}" /><span>✓</span></label>
    <div class="video-preview" style="background-image:url('assets/${image}')"><button class="video-play" aria-label="영상 재생">▶</button><span class="video-status">${status}</span><div class="caption-preview">무너짐 없이, 광채만 남겼어 ✨</div><div class="video-progress"><i></i></div></div>
    <div class="result-info"><div><h3>${title}</h3><p>${meta} <span>·</span> ${cost}</p></div><button class="more-button" aria-label="더보기">•••</button></div>
    <div class="result-actions"><button class="editVideo" data-title="${title}">편집</button><button class="quickUpload" data-title="${title}">바로 업로드 ↗</button></div>
  </article>`;
}

function renderResults() {
  $('#resultEmpty').hidden = true;
  const prompt = $('#directionPrompt').value;
  $('#resultContent').hidden = false;
  $('#resultContent').innerHTML = `
    <div class="prompt-summary">
      <div><span>FINAL PROMPT</span><h3>최종 생성 프롬프트</h3></div>
      <p><b>[0–2초]</b> 광채 피부 클로즈업으로 시선 고정 → <b>[3–8초]</b> 메쉬 제형과 얇은 밀착 표현 → <b>[9–13초]</b> 24시간 지속력 숫자 강조 → <b>[14–15초]</b> 제품팩과 CTA. ${prompt}</p>
      <button id="copyPrompt">복사</button>
    </div>
    <div class="result-grid">
      ${resultCard('v1', '광채가 켜지는 15초', '완성', 'clio-creator.png', 'Veo 3 Fast · 15초', '₩3,200')}
      ${resultCard('v2', '가격 훅 베리에이션', '완성', 'clio-product.png', 'Veo 3 Fast · 15초', '₩3,200')}
    </div>
    <div class="bulk-bar"><span><b id="selectedCount">0</b>개 선택</span><div><button class="bulk-ghost" id="downloadButton">내려받기</button><button class="bulk-primary" id="openUpload" disabled>선택 영상 업로드</button></div></div>`;
  bindResultActions();
}

function bindResultActions() {
  $$('.result-check input').forEach(input => input.addEventListener('change', updateBulkBar));
  $$('.editVideo').forEach(button => button.addEventListener('click', () => editorModal(button.dataset.title)));
  $$('.quickUpload').forEach(button => button.addEventListener('click', () => uploadModal([button.dataset.title])));
  $$('.video-play').forEach(button => button.addEventListener('click', () => {
    const preview = button.closest('.video-preview');
    preview.classList.toggle('playing');
    button.textContent = preview.classList.contains('playing') ? 'Ⅱ' : '▶';
  }));
  $('#copyPrompt').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('.prompt-summary p').innerText); } catch {}
    showToast('프롬프트를 복사했어요');
  });
  $('#openUpload').addEventListener('click', () => {
    const titles = $$('.result-check input:checked').map(input => input.closest('.result-card').querySelector('h3').textContent);
    uploadModal(titles);
  });
  $('#downloadButton').addEventListener('click', () => showToast('샘플 영상을 준비했어요', '프로토타입에서는 실제 파일 대신 동작만 표시합니다.'));
}

function updateBulkBar() {
  const count = $$('.result-check input:checked').length;
  $('#selectedCount').textContent = count;
  $('#openUpload').disabled = count === 0;
}

function editorModal(title) {
  openModal({
    kicker: 'VIDEO EDITOR',
    title: `${title} 편집`,
    wide: true,
    content: `<div class="editor-layout">
      <div class="editor-preview"><div class="editor-phone"><img src="assets/clio-creator.png" alt="편집 중인 영상" /><div class="editor-caption">24시간, 무너짐 없이.</div><button>▶</button></div></div>
      <div class="editor-controls">
        <div class="editor-tabs"><button class="active">컷 편집</button><button>나레이션</button><button>자막</button></div>
        <div class="edit-section"><div class="edit-heading"><b>타임라인</b><span>00:15</span></div><div class="timeline"><i style="width:18%"></i><i style="width:34%"></i><i style="width:28%"></i><i style="width:20%"></i><b style="left:47%"></b></div><div class="time-labels"><span>00:00</span><span>00:05</span><span>00:10</span><span>00:15</span></div></div>
        <div class="edit-section"><div class="edit-heading"><b>나레이션</b><label class="toggle"><input type="checkbox" checked><span></span></label></div><select><option>지수 · 밝고 또렷한 여성</option><option>민준 · 차분한 남성</option><option>Emma · Energetic</option></select><button class="voice-preview">▶ 목소리 미리듣기</button></div>
        <div class="edit-section"><div class="edit-heading"><b>자막</b><span class="pink-text">자동 맞춤</span></div><div class="caption-row"><span>00:00</span><input value="쿠션, 아직도 두껍게 발라?" /></div><div class="caption-row"><span>00:04</span><input value="메쉬처럼 얇게, 광채는 오래" /></div><div class="caption-row"><span>00:10</span><input value="24시간 무너짐 없이." /></div></div>
      </div>
    </div>`,
    actions: '<button class="ghost-modal" data-close>변경 취소</button><button class="modal-primary" id="saveEdit">새 버전 저장</button>'
  });
  $('[data-close]').addEventListener('click', closeModal);
  $$('.editor-tabs button').forEach(button => button.addEventListener('click', () => { $$('.editor-tabs button').forEach(item => item.classList.remove('active')); button.classList.add('active'); }));
  $('.voice-preview').addEventListener('click', event => { event.currentTarget.textContent = 'Ⅱ 재생 중...'; setTimeout(() => event.currentTarget.textContent = '▶ 목소리 미리듣기', 1300); });
  $('#saveEdit').addEventListener('click', () => { closeModal(); showToast('편집 버전을 저장했어요', '원본 영상은 그대로 유지됩니다.'); });
}

function uploadModal(titles) {
  openModal({
    kicker: 'PUBLISH',
    title: `${titles.length}개 영상 업로드`,
    content: `<div class="upload-summary"><img src="assets/clio-creator.png" alt="업로드 영상 썸네일" /><div><b>${titles[0]}</b><small>${titles.length > 1 ? `외 ${titles.length - 1}개` : '15초 · 9:16'}</small></div></div>
      <div class="platform-list">
        <label><input type="checkbox" checked /><span class="platform-icon insta">◎</span><b>Instagram Reels</b><small>@clio_official</small></label>
        <label><input type="checkbox" checked /><span class="platform-icon tiktok">♪</span><b>TikTok</b><small>@clio_official</small></label>
        <label><input type="checkbox" /><span class="platform-icon youtube">▶</span><b>YouTube Shorts</b><small>CLIO Official</small></label>
      </div>
      <div class="modal-form"><label>게시 시점<select id="publishTiming"><option>지금 바로 게시</option><option>오늘 오후 6:00 예약</option><option>직접 선택</option></select></label><label>캡션<textarea rows="3">광채는 얇게, 자신감은 선명하게 ✨ #클리오 #킬커버 #쿠션추천</textarea></label></div>`,
    actions: '<button class="ghost-modal" data-close>취소</button><button class="modal-primary" id="publishConfirm">업로드 실행</button>'
  });
  $('[data-close]').addEventListener('click', closeModal);
  $('#publishConfirm').addEventListener('click', () => {
    const count = $$('.platform-list input:checked').length;
    closeModal();
    showToast(`${count}개 플랫폼에 업로드를 시작했어요`, '게시 상태는 관리자 리포트에서 확인할 수 있습니다.');
  });
}

$('#createButton').addEventListener('click', () => {
  const button = $('#createButton');
  let progress = 0;
  button.disabled = true;
  $('#resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  $('#resultEmpty').innerHTML = '<div class="generation-loader"><i></i><span>장면 구성 중</span><b id="progressText">0%</b></div><p>제품 특징과 레퍼런스의 호흡을 분석하고 있어요.</p>';
  generationTimer = setInterval(() => {
    progress += progress < 60 ? 13 : 8;
    if (progress > 100) progress = 100;
    $('#progressText').textContent = `${progress}%`;
    $('.generation-loader i').style.setProperty('--progress', `${progress * 3.6}deg`);
    button.innerHTML = `<span>✦</span> 영상 생성 중 ${progress}%`;
    if (progress >= 100) {
      clearInterval(generationTimer);
      renderResults();
      button.innerHTML = '<span>✦</span> 새 영상 만들기';
      button.disabled = false;
      showToast('영상 2개를 만들었어요', `${selectedReference} 스타일 · ${selectedLanguage}`);
    }
  }, 210);
});

$('#beautyFormButton').addEventListener('click', () => {
  openModal({
    kicker: 'BEAUTYFORM SYNC',
    title: '뷰티폼 영상 가져오기',
    wide: true,
    content: `<div class="sync-head"><span class="sync-logo">B</span><div><b>BeautyForm 연결됨</b><small>마지막 동기화: 방금 전</small></div><button>새로고침</button></div>
      <div class="import-grid">
        ${['신상 쿠션 3초 훅','메쉬 제형 클로즈업','여름 지속력 테스트'].map((name, index) => `<label class="import-card"><input type="checkbox" ${index < 2 ? 'checked' : ''}><span><img src="assets/${index === 1 ? 'clio-product.png' : 'clio-creator.png'}" alt="${name}"><i>0:${15 + index * 3}</i></span><b>${name}</b><small>2026.09.${18-index}</small></label>`).join('')}
      </div>`,
    actions: '<button class="ghost-modal" data-close>취소</button><button class="modal-primary" id="importConfirm">선택 영상 가져오기</button>'
  });
  $('[data-close]').addEventListener('click', closeModal);
  $('#importConfirm').addEventListener('click', () => {
    const count = $$('.import-card input:checked').length;
    closeModal();
    if (count) { renderResults(); showToast(`뷰티폼 영상 ${count}개를 가져왔어요`); }
  });
});

document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
if (location.hash === '#automation') automationModal();
