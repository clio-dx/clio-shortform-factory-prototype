const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

let selectedReference = null;
let selectedLanguage = '한국어';
let activeSource = 'trend';
let activeCategory = 'all';
let generationTimer = null;
let pendingAutoPublish = false;
let currentProduct = null;

const productCatalog = [
  { brand:'CLIO', name:'킬커버 메쉬 글로우 쿠션', category:'쿠션', price:'32,000원', strength:'얇게 밀착되는 24시간 물광 커버', ingredients:'히알루론산, 판테놀, 세라마이드', url:'https://clubclio.co.kr/product/kill-cover', image:'clio-product.png' },
  { brand:'CLIO', name:'샤프 쏘 심플 워터프루프 펜슬 라이너', category:'아이', price:'14,000원', strength:'2mm 슬림 펜슬, 번짐 없는 24시간 워터프루프', ingredients:'', url:'https://clubclio.co.kr/product/sharp-so-simple', image:'clio-product.png' },
  { brand:'PERIPERA', name:'잉크 무드 글로이 틴트', category:'립', price:'12,000원', strength:'맑고 탱글한 광택과 편안한 지속력', ingredients:'호호바오일, 망고씨버터', url:'https://clubclio.co.kr/product/ink-mood-glowy', image:'clio-product.png' },
  { brand:'PERIPERA', name:'올테이크 무드 팔레트', category:'아이', price:'24,000원', strength:'톤온톤 컬러로 완성하는 데일리 아이 메이크업', ingredients:'', url:'https://clubclio.co.kr/product/all-take-mood', image:'clio-product.png' },
  { brand:'GOODAL', name:'청귤 비타C 잡티 케어 세럼', category:'기초', price:'28,000원', strength:'잡티 흔적과 칙칙함을 동시에 관리하는 비타민 세럼', ingredients:'청귤추출물, 나이아신아마이드, 알부틴', url:'https://clubclio.co.kr/product/green-tangerine', image:'clio-product.png' },
  { brand:'GOODAL', name:'어성초 진정 수분 선크림', category:'선', price:'22,000원', strength:'촉촉하고 백탁 없이 밀착되는 데일리 진정 선크림', ingredients:'어성초추출물, 판테놀, 히알루론산', url:'https://clubclio.co.kr/product/heartleaf-sun', image:'clio-product.png' }
];
currentProduct = productCatalog[0];

const promptTranslations = {
  '한국어': '크림처럼 얇게 밀착되는 제형과 24시간 광채 지속력을 강조해주세요. 첫 2초에 피부 클로즈업 훅을 넣어주세요.',
  'English': 'Highlight the creamy, weightless texture and 24-hour glow. Open with a close-up skin hook in the first two seconds and end with a clean product shot.',
  '日本語': 'クリームのように薄く密着するテクスチャーと、24時間続くツヤ感を強調してください。最初の2秒は肌のクローズアップで惹きつけてください。'
};

const promptTemplates = {
  '제형 집중': '처음 2초에 제형 클로즈업을 배치하고, 퍼프가 피부 위를 미끄러지는 질감을 ASMR처럼 표현해주세요. 얇은 밀착감과 광채 피니시를 강조합니다.',
  '가격 집중': '정가와 프로모션 가격을 영상 전반부에 크게 노출하고, 동일 가격대 대비 커버력과 지속력의 장점을 숫자로 비교해주세요.',
  'UGC 후기': '친구에게 추천하듯 자연스러운 셀프캠 톤으로 시작합니다. 출근 전 사용 → 오후 6시 피부 상태 → 한 줄 총평 순서로 구성해주세요.',
  '밈 · 챌린지': '첫 장면은 화장이 무너진 과장된 리액션, 비트 드롭과 함께 제품 사용, 마지막에는 10초 수정화장 성공 포즈로 마무리해주세요.'
};

const automationJobs = [
  { name:'킬커버 데일리 UGC', rule:'매일 10개 · 오전 9시', channels:'Instagram · TikTok', next:'내일 09:00', status:'진행 중', done:'38 / 100' },
  { name:'페리페라 신색상 런칭', rule:'목표 30개 · 예산 ₩280K', channels:'TikTok · YouTube', next:'오늘 18:00', status:'검수 대기', done:'12 / 30' }
];

function showToast(message, detail = '') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✓</span><div><b>${message}</b>${detail ? `<small>${detail}</small>` : ''}</div>`;
  $('#toastStack').appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 240); }, 3200);
}

function closeModal() {
  $('#modalRoot').innerHTML = '';
  document.body.classList.remove('modal-open');
}

function openModal({ title, kicker = '', content, actions = '', wide = false }) {
  $('#modalRoot').innerHTML = `<div class="modal-backdrop" role="presentation"><section class="modal ${wide ? 'modal-wide' : ''}" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><header><div>${kicker ? `<p class="eyebrow">${kicker}</p>` : ''}<h2 id="modalTitle">${title}</h2></div><button class="modal-close" aria-label="닫기">×</button></header><div class="modal-body">${content}</div>${actions ? `<footer>${actions}</footer>` : ''}</section></div>`;
  document.body.classList.add('modal-open');
  $('.modal-close').addEventListener('click', closeModal);
  $('.modal-backdrop').addEventListener('click', event => { if (event.target.classList.contains('modal-backdrop')) closeModal(); });
}

function updateCreateState() {
  const checked = $('#productCheck').checked;
  $('#createButton').disabled = !(checked && selectedReference);
  $('.product-card').classList.toggle('selected', checked);
  $('.check-dot').style.display = checked ? '' : 'none';
}

function selectReference(card) {
  $$('.reference-card').forEach(item => item.classList.remove('selected'));
  card.classList.add('selected');
  selectedReference = card.dataset.title;
  const image = card.querySelector('img');
  $('#selectedRefThumb').innerHTML = image ? `<img src="${image.src}" alt="선택한 레퍼런스" style="width:100%;height:100%;object-fit:cover">` : '<b>✦</b>';
  $('#selectedRefThumb').title = selectedReference;
  updateCreateState();
}

function filterReferences() {
  const query = $('#refSearch').value.trim().toLowerCase();
  $$('.reference-card').forEach(card => {
    const sourceMatch = card.dataset.source === activeSource;
    const categoryMatch = activeCategory === 'all' || card.dataset.category.includes(activeCategory);
    const queryMatch = !query || `${card.dataset.title} ${card.innerText}`.toLowerCase().includes(query);
    card.hidden = !(sourceMatch && categoryMatch && queryMatch);
  });
  const count = $$('.reference-card:not([hidden])').length;
  $('.result-count').textContent = `${count}개 추천`;
}

$('#productCheck').addEventListener('change', updateCreateState);
$$('.reference-card').forEach(card => card.addEventListener('click', () => selectReference(card)));
$$('#categoryChips button').forEach(button => button.addEventListener('click', () => {
  $$('#categoryChips button').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  activeCategory = button.dataset.category;
  filterReferences();
}));
$$('.source-tabs button').forEach(button => button.addEventListener('click', () => {
  $$('.source-tabs button').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  activeSource = button.dataset.source;
  filterReferences();
  showToast(button.childNodes[0].textContent.trim(), activeSource === 'official' ? '공식 계정에 업로드된 영상만 모았어요.' : '최근 반응이 빠르게 오르는 포맷이에요.');
}));
$('#refSearch').addEventListener('input', filterReferences);

function productPrompts(product) {
  return [
    { label:'제형 클로즈업', text:`${product.name}의 제형이 피부에 밀착되는 순간을 초근접으로 보여주고 ${product.strength}을 강조해주세요.` },
    { label:'핵심 성분 스토리', text:`${product.ingredients || '선택한 효능 성분'}을 3개의 짧은 그래픽으로 설명하고 사용 전후 피부 변화를 연결해주세요.` },
    { label:'가격 대비 성능', text:`${product.price} 가격을 첫 3초에 공개하고 ${product.strength}을 동일 카테고리 제품과 직관적으로 비교해주세요.` },
    { label:'출근 10초 UGC', text:`바쁜 출근 준비 중 ${product.name}을 10초 만에 사용하는 셀프캠 UGC로 구성하고 자연스러운 한 줄 후기로 마무리해주세요.` }
  ];
}

function renderPromptSuggestions() {
  $('#promptSuggestions').innerHTML = productPrompts(currentProduct).map(item => `<button type="button" data-prompt="${item.text.replaceAll('"','&quot;')}">${item.label}</button>`).join('');
  $$('#promptSuggestions button').forEach(button => button.addEventListener('click', () => { $('#directionPrompt').value = button.dataset.prompt; showToast('추천 프롬프트를 적용했어요', button.textContent); }));
}

$$('#languageTabs button').forEach(button => button.addEventListener('click', () => {
  $$('#languageTabs button').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  selectedLanguage = button.textContent;
  $('#directionPrompt').value = promptTranslations[selectedLanguage];
  showToast(`${selectedLanguage} 기본 프롬프트로 변경했어요`);
}));

$('.upload-box input').addEventListener('change', event => { if (event.target.files[0]) showToast('제품 파일을 추가했어요', event.target.files[0].name); });

function applyProduct(product) {
  currentProduct = product;
  $('#productCardName').textContent = product.name;
  $('#productCardMeta').textContent = `${product.brand} · ${product.category} · ${product.price}`;
  $('#selectedProductText').textContent = product.name;
  $('#productNameInput').value = product.name;
  $('#productPriceInput').value = product.price;
  $('#productStrengthInput').value = product.strength;
  $('#ingredientsInput').value = product.ingredients;
  $('#productUrlInput').value = product.url;
  $('#ingredientStatus').textContent = product.ingredients ? '상세페이지 분석 완료' : '직접 입력 필요';
  $('#ingredientStatus').classList.toggle('manual', !product.ingredients);
  $('#ingredientSource').textContent = product.ingredients ? '상세페이지에서 자동 입력됨' : '페이지에 성분 정보가 없어 직접 입력하거나 태그를 선택해주세요.';
  renderPromptSuggestions();
  showToast(`${product.brand} 제품을 선택했어요`, product.name);
}

function productLibraryModal() {
  const cards = productCatalog.map((product, index) => `<article class="catalog-card" data-brand="${product.brand}"><img src="assets/${product.image}" alt="${product.name}"><div><span>${product.brand}</span><b>${product.name}</b><small>${product.category} · ${product.price}</small><p>${product.strength}</p></div><button data-product="${index}">선택</button></article>`).join('');
  openModal({ kicker:'PRODUCT LIBRARY', title:'클럽클리오 제품 선택', wide:true, content:`<div class="catalog-toolbar"><div class="modal-tabs" id="brandTabs"><button class="active" data-brand="all">전체</button><button data-brand="CLIO">CLIO</button><button data-brand="PERIPERA">PERIPERA</button><button data-brand="GOODAL">GOODAL</button></div><input id="catalogSearch" placeholder="제품명 검색"></div><div class="catalog-grid">${cards}</div>` });
  $$('#brandTabs button').forEach(button => button.addEventListener('click', () => { $$('#brandTabs button').forEach(item => item.classList.remove('active')); button.classList.add('active'); $$('.catalog-card').forEach(card => card.hidden = button.dataset.brand !== 'all' && card.dataset.brand !== button.dataset.brand); }));
  $('#catalogSearch').addEventListener('input', event => { const q=event.target.value.toLowerCase(); $$('.catalog-card').forEach(card => card.hidden = !card.innerText.toLowerCase().includes(q)); });
  $$('.catalog-card button').forEach(button => button.addEventListener('click', () => { applyProduct(productCatalog[Number(button.dataset.product)]); closeModal(); }));
}

$('.product-panel .text-button').addEventListener('click', productLibraryModal);
$('#analyzeProduct').addEventListener('click', event => {
  event.currentTarget.disabled = true;
  event.currentTarget.textContent = '분석 중...';
  setTimeout(() => { $('#ingredientsInput').value = currentProduct.ingredients || '카테고리 태그에서 효능을 선택해주세요'; $('#ingredientStatus').textContent = currentProduct.ingredients ? '상세페이지 분석 완료' : '정보 없음'; event.currentTarget.disabled=false; event.currentTarget.textContent='페이지 분석 · 자동 입력'; showToast(currentProduct.ingredients ? '상세페이지 정보를 반영했어요' : '성분 정보가 없어 직접 입력이 필요해요'); }, 900);
});
$$('#ingredientTags button').forEach(button => button.addEventListener('click', () => { button.classList.toggle('active'); const values=$$('#ingredientTags button.active').map(item=>item.textContent); if(values.length) $('#ingredientsInput').value=values.join(', '); }));

$('#templateButton').addEventListener('click', () => {
  const cards = Object.entries(promptTemplates).map(([name, text]) => `<button class="template-card" data-template="${name}"><span>${name.includes('UGC') ? 'UGC' : name.includes('밈') ? 'FUN' : 'AD'}</span><b>${name}</b><small>${text}</small><i>템플릿 사용 →</i></button>`).join('');
  openModal({ kicker:'PROMPT LIBRARY', title:'카테고리별 프롬프트', content:`<div class="template-grid">${cards}</div>`, wide:true });
  $$('.template-card').forEach(card => card.addEventListener('click', () => { $('#directionPrompt').value=promptTemplates[card.dataset.template]; closeModal(); showToast(`‘${card.dataset.template}’ 템플릿을 적용했어요`); }));
});

function jobCards() {
  return automationJobs.map((job,index) => `<article class="automation-job"><div class="job-status"><i></i><span>${job.status}</span></div><div><b>${job.name}</b><small>${job.rule}</small></div><div class="job-progress"><span><i style="width:${Math.min(100,Number(job.done.split('/')[0])/Number(job.done.split('/')[1])*100)}%"></i></span><small>${job.done}</small></div><div class="job-meta"><span>${job.channels}</span><small>다음 실행 ${job.next}</small></div><button class="job-toggle" data-job="${index}">${job.status === '일시 정지' ? '재개' : '일시 정지'}</button></article>`).join('');
}

function automationModal(view='create') {
  openModal({ kicker:'AUTOMATION', title:'자동화 센터', wide:true, content:`<div class="automation-view-tabs"><button class="${view==='create'?'active':''}" data-view="create">새 자동화</button><button class="${view==='jobs'?'active':''}" data-view="jobs">작업 목록 <span>${automationJobs.length}</span></button></div><div id="autoCreateView" ${view==='jobs'?'hidden':''}><div class="automation-layout"><div class="automation-main"><div class="modal-tabs" id="autoMode"><button class="active" data-mode="goal">목표 기반</button><button data-mode="daily">매일 반복</button></div><div id="goalFields" class="modal-form two-col"><label>목표 영상 수<input id="autoTarget" type="number" value="50" min="1"></label><label>최대 예산<input value="₩500,000"></label><div class="info-box span-2"><b>예상 48개 제작</b><span>현재 모델 기준 약 ₩486,400 · 12일 소요</span></div></div><div id="dailyFields" class="modal-form two-col" hidden><label>하루 생성 수<input type="number" value="10" min="1"></label><label>업로드 시작<select><option>오전 9:00</option><option>오후 12:00</option><option>오후 6:00</option></select></label><label class="span-2">종료일<input type="date" value="2026-10-31"></label></div><div class="setting-block"><b>주제 방식</b><div class="choice-row"><label><input type="radio" name="topic" checked> 자유 주제</label><label><input type="radio" name="topic"> 카테고리 순환</label><label><input type="radio" name="topic"> 프롬프트 고정</label></div></div><div class="setting-block"><b>카테고리</b><div class="chips static"><button class="active">UGC</button><button>메이크업</button><button>챌린지</button><button>AI 애니</button></div></div></div><aside class="automation-side"><h3>자동 업로드</h3><label class="switch-row"><span><b>Instagram Reels</b><small>@clio_official</small></span><input type="checkbox" checked></label><label class="switch-row"><span><b>TikTok</b><small>@clio_official</small></span><input type="checkbox" checked></label><label class="switch-row"><span><b>YouTube Shorts</b><small>CLIO Official</small></span><input type="checkbox"></label><hr><p>검수 없이 바로 게시</p><label class="toggle"><input type="checkbox"><span></span></label><small>끄면 승인 대기함에 저장됩니다.</small></aside></div><div class="automation-create-action"><button class="modal-primary" id="saveAutomation">자동화 시작</button></div></div><div id="autoJobsView" ${view==='create'?'hidden':''}><div class="jobs-summary"><div><b>${automationJobs.length}</b><span>활성 작업</span></div><div><b>50</b><span>이번 주 생성 예정</span></div><div><b>₩318K</b><span>예상 사용량</span></div></div><div class="automation-jobs">${jobCards()}</div></div>` });
  $$('.automation-view-tabs button').forEach(button => button.addEventListener('click', () => { $$('.automation-view-tabs button').forEach(item=>item.classList.remove('active')); button.classList.add('active'); $('#autoCreateView').hidden=button.dataset.view!=='create'; $('#autoJobsView').hidden=button.dataset.view!=='jobs'; }));
  $$('#autoMode button').forEach(button => button.addEventListener('click', () => { $$('#autoMode button').forEach(item=>item.classList.remove('active')); button.classList.add('active'); $('#goalFields').hidden=button.dataset.mode!=='goal'; $('#dailyFields').hidden=button.dataset.mode!=='daily'; }));
  $$('.chips.static button').forEach(button => button.addEventListener('click', () => button.classList.toggle('active')));
  $$('.job-toggle').forEach(button => button.addEventListener('click', () => { const job=automationJobs[Number(button.dataset.job)]; job.status=job.status==='일시 정지'?'진행 중':'일시 정지'; automationModal('jobs'); }));
  if($('#saveAutomation')) $('#saveAutomation').addEventListener('click', () => { automationJobs.unshift({name:`${currentProduct.name} 자동화`,rule:'목표 50개 · 예산 ₩500K',channels:'Instagram · TikTok',next:'오늘 18:00',status:'진행 중',done:'0 / 50'}); showToast('자동화를 등록했어요','작업 목록에서 진행 상태를 확인할 수 있습니다.'); automationModal('jobs'); });
}

$('#automationButton').addEventListener('click', () => automationModal('create'));
$('.topbar nav a[href="#automation"]').addEventListener('click', event => { event.preventDefault(); automationModal('jobs'); });

function resultCard(id,title,status,image,meta,cost,local=false) {
  return `<article class="result-card"><label class="result-check"><input type="checkbox" data-result="${id}"><span>✓</span></label><div class="video-preview" style="background-image:url('assets/${image}')"><button class="video-play" aria-label="영상 재생">▶</button><span class="video-status">${status}</span><div class="caption-preview">${local?'로컬 영상':'무너짐 없이, 광채만 남겼어 ✨'}</div><div class="video-progress"><i></i></div></div><div class="result-info"><div><h3>${title}</h3><p>${meta} <span>·</span> ${cost}</p></div><button class="more-button" aria-label="더보기">•••</button></div><div class="result-actions three"><button class="editVideo" data-title="${title}">편집</button><button class="feedbackVideo" data-title="${title}">AI 피드백</button><button class="quickUpload" data-title="${title}">업로드 ↗</button></div></article>`;
}

function renderResults(localFile='') {
  $('#resultEmpty').hidden=true;
  $('#resultContent').hidden=false;
  $('#resultContent').innerHTML=`<div class="result-grid">${resultCard('v1','광채가 켜지는 15초','완성','clio-creator.png','Veo 3 Fast · 15초','₩3,200')}${resultCard('v2','가격 훅 베리에이션','완성','clio-product.png','Veo 3 Fast · 15초','₩3,200')}${localFile?resultCard('local',localFile,'업로드됨','clio-product.png','로컬 파일 · 분석 대기','—',true):''}</div><div class="bulk-bar"><span><b id="selectedCount">0</b>개 선택</span><div><button class="bulk-ghost" id="downloadButton">내려받기</button><button class="bulk-primary" id="openUpload" disabled>선택 영상 업로드</button></div></div>`;
  bindResultActions();
}

function bindResultActions() {
  $$('.result-check input').forEach(input=>input.addEventListener('change',updateBulkBar));
  $$('.editVideo').forEach(button=>button.addEventListener('click',()=>editorModal(button.dataset.title)));
  $$('.feedbackVideo').forEach(button=>button.addEventListener('click',()=>feedbackModal(button.dataset.title)));
  $$('.quickUpload').forEach(button=>button.addEventListener('click',()=>uploadModal([button.dataset.title])));
  $$('.video-play').forEach(button=>button.addEventListener('click',()=>{const preview=button.closest('.video-preview');preview.classList.toggle('playing');button.textContent=preview.classList.contains('playing')?'Ⅱ':'▶';}));
  $('#openUpload').addEventListener('click',()=>uploadModal($$('.result-check input:checked').map(input=>input.closest('.result-card').querySelector('h3').textContent)));
  $('#downloadButton').addEventListener('click',()=>showToast('샘플 영상을 준비했어요','프로토타입에서는 실제 파일 대신 동작만 표시합니다.'));
}

function updateBulkBar(){const count=$$('.result-check input:checked').length;$('#selectedCount').textContent=count;$('#openUpload').disabled=count===0;}

function feedbackModal(title){
  openModal({kicker:'AI CREATIVE REVIEW',title:`${title} 피드백`,wide:true,content:`<div class="feedback-layout"><div class="feedback-video"><img src="assets/clio-creator.png" alt="피드백 대상 영상"><span>0:15</span></div><div class="feedback-chat"><div class="chat-thread" id="chatThread"><div class="chat-message ai"><b>Creative AI</b><p>현재 영상은 첫 2초의 피부 광채 훅이 강점입니다. 어떤 부분을 바꿔볼까요?</p></div><div class="quick-feedback"><button>제품 노출을 더 빠르게</button><button>자막을 더 짧게</button><button>광채 표현을 강조</button></div></div><div class="chat-compose"><input id="feedbackInput" placeholder="예: 첫 장면을 더 임팩트 있게 바꿔줘"><button id="sendFeedback">전송</button></div></div></div>`});
  $$('.quick-feedback button').forEach(button=>button.addEventListener('click',()=>{$('#feedbackInput').value=button.textContent;}));
  $('#sendFeedback').addEventListener('click',()=>{const value=$('#feedbackInput').value.trim();if(!value)return;$('#chatThread').insertAdjacentHTML('beforeend',`<div class="chat-message user"><p>${value}</p></div>`);$('#feedbackInput').value='';setTimeout(()=>{$('#chatThread').insertAdjacentHTML('beforeend','<div class="chat-message ai"><b>Creative AI</b><p>좋아요. 요청을 반영한 새 버전을 만들 준비가 됐어요.</p><button class="regenerate-chat">이 피드백으로 재생성</button></div>');$('.regenerate-chat').addEventListener('click',()=>{closeModal();showToast('피드백을 반영해 새 버전을 만들고 있어요');});},450);});
}

function editorModal(title){
  const finalPrompt=`[0–2초] 피부 광채 클로즈업 훅. [3–8초] ${currentProduct.name} 제형과 얇은 밀착 표현. [9–13초] ${currentProduct.strength}. [14–15초] 제품 팩샷과 CTA.`;
  openModal({kicker:'VIDEO EDITOR',title:`${title} 편집`,wide:true,content:`<div class="editor-layout"><div class="editor-preview"><div class="editor-phone"><img src="assets/clio-creator.png" alt="편집 중인 영상"><div class="editor-caption">24시간, 무너짐 없이.</div><button>▶</button></div></div><div class="editor-controls"><div class="editor-tabs"><button class="active" data-pane="prompt">생성 프롬프트</button><button data-pane="cut">컷 편집</button><button data-pane="voice">나레이션</button><button data-pane="caption">자막</button></div><div class="editor-pane active" data-editor-pane="prompt"><div class="edit-heading"><b>현재 결과물 생성 프롬프트</b><span class="pink-text">직접 수정 가능</span></div><textarea id="editPrompt" rows="10">${finalPrompt}\n\n${$('#directionPrompt').value}</textarea><button class="prompt-regenerate">수정 프롬프트로 다시 생성</button></div><div class="editor-pane" data-editor-pane="cut"><div class="edit-section"><div class="edit-heading"><b>타임라인</b><span>00:15</span></div><div class="timeline"><i style="width:18%"></i><i style="width:34%"></i><i style="width:28%"></i><i style="width:20%"></i><b style="left:47%"></b></div><div class="time-labels"><span>00:00</span><span>00:05</span><span>00:10</span><span>00:15</span></div></div></div><div class="editor-pane" data-editor-pane="voice"><div class="edit-section"><div class="edit-heading"><b>나레이션</b><label class="toggle"><input type="checkbox" checked><span></span></label></div><select><option>지수 · 밝고 또렷한 여성</option><option>민준 · 차분한 남성</option><option>Emma · Energetic</option></select><button class="voice-preview">▶ 목소리 미리듣기</button></div></div><div class="editor-pane" data-editor-pane="caption"><div class="edit-section"><div class="edit-heading"><b>자막</b><span class="pink-text">자동 맞춤</span></div><div class="caption-row"><span>00:00</span><input value="쿠션, 아직도 두껍게 발라?"></div><div class="caption-row"><span>00:04</span><input value="메쉬처럼 얇게, 광채는 오래"></div><div class="caption-row"><span>00:10</span><input value="24시간 무너짐 없이."></div></div></div></div></div>`,actions:'<button class="ghost-modal" data-close>변경 취소</button><button class="modal-primary" id="saveEdit">새 버전 저장</button>'});
  $('[data-close]').addEventListener('click',closeModal);
  $$('.editor-tabs button').forEach(button=>button.addEventListener('click',()=>{$$('.editor-tabs button').forEach(item=>item.classList.remove('active'));button.classList.add('active');$$('.editor-pane').forEach(pane=>pane.classList.toggle('active',pane.dataset.editorPane===button.dataset.pane));}));
  if($('.voice-preview')) $('.voice-preview').addEventListener('click',event=>{event.currentTarget.textContent='Ⅱ 재생 중...';setTimeout(()=>event.currentTarget.textContent='▶ 목소리 미리듣기',1300);});
  $('.prompt-regenerate').addEventListener('click',()=>{closeModal();showToast('수정 프롬프트로 새 버전을 생성해요');});
  $('#saveEdit').addEventListener('click',()=>{closeModal();showToast('편집 버전을 저장했어요','원본 영상은 그대로 유지됩니다.');});
}

function uploadModal(titles){openModal({kicker:'PUBLISH',title:`${titles.length}개 영상 업로드`,content:`<div class="upload-summary"><img src="assets/clio-creator.png" alt="업로드 영상 썸네일"><div><b>${titles[0]}</b><small>${titles.length>1?`외 ${titles.length-1}개`:'15초 · 9:16'}</small></div></div><div class="platform-list"><label><input type="checkbox" checked><span class="platform-icon insta">◎</span><b>Instagram Reels</b><small>@clio_official</small></label><label><input type="checkbox" checked><span class="platform-icon tiktok">♪</span><b>TikTok</b><small>@clio_official</small></label><label><input type="checkbox"><span class="platform-icon youtube">▶</span><b>YouTube Shorts</b><small>CLIO Official</small></label></div><div class="modal-form"><label>게시 시점<select><option>지금 바로 게시</option><option>오늘 오후 6:00 예약</option><option>직접 선택</option></select></label><label>캡션<textarea rows="3">광채는 얇게, 자신감은 선명하게 ✨ #클리오 #킬커버 #쿠션추천</textarea></label></div>`,actions:'<button class="ghost-modal" data-close>취소</button><button class="modal-primary" id="publishConfirm">업로드 실행</button>'});$('[data-close]').addEventListener('click',closeModal);$('#publishConfirm').addEventListener('click',()=>{const count=$$('.platform-list input:checked').length;closeModal();showToast(`${count}개 플랫폼에 업로드를 시작했어요`,'게시 상태는 관리자 리포트에서 확인할 수 있습니다.');});}

function startGeneration(){const button=$('#createButton');let progress=0;button.disabled=true;$('#resultsSection').scrollIntoView({behavior:'smooth',block:'start'});$('#localDropzone').hidden=true;$('#resultEmpty').innerHTML='<div class="generation-loader"><i></i><span>장면 구성 중</span><b id="progressText">0%</b></div><p>제품 특징과 레퍼런스의 호흡을 분석하고 있어요.</p>';generationTimer=setInterval(()=>{progress+=progress<60?13:8;if(progress>100)progress=100;$('#progressText').textContent=`${progress}%`;$('.generation-loader i').style.setProperty('--progress',`${progress*3.6}deg`);button.innerHTML=`<span>✦</span> 영상 생성 중 ${progress}%`;if(progress>=100){clearInterval(generationTimer);renderResults();button.innerHTML='<span>✦</span> 새 영상 만들기';button.disabled=false;showToast('영상 2개를 만들었어요',`${selectedReference} 스타일 · ${selectedLanguage}`);if(pendingAutoPublish){pendingAutoPublish=false;setTimeout(()=>uploadModal(['추천 인사이트 적용 영상']),500);}}},210);}
$('#createButton').addEventListener('click',startGeneration);

function addLocalVideo(file){$('#localDropzone').hidden=true;renderResults(file.name);showToast('로컬 영상을 결과물에 추가했어요',file.name);}
$('#localVideoInput').addEventListener('change',event=>{if(event.target.files[0])addLocalVideo(event.target.files[0]);});
$('#localDropzone').addEventListener('click',()=>$('#localVideoInput').click());
['dragenter','dragover'].forEach(type=>$('#localDropzone').addEventListener(type,event=>{event.preventDefault();$('#localDropzone').classList.add('dragging');}));
['dragleave','drop'].forEach(type=>$('#localDropzone').addEventListener(type,event=>{event.preventDefault();$('#localDropzone').classList.remove('dragging');if(type==='drop'&&event.dataTransfer.files[0])addLocalVideo(event.dataTransfer.files[0]);}));

$('#beautyFormButton').addEventListener('click',()=>{openModal({kicker:'BEAUTYFORM SYNC',title:'뷰티폼 영상 가져오기',wide:true,content:`<div class="sync-head"><span class="sync-logo">B</span><div><b>BeautyForm 연결됨</b><small>마지막 동기화: 방금 전</small></div><button>새로고침</button></div><div class="import-grid">${['신상 쿠션 3초 훅','메쉬 제형 클로즈업','여름 지속력 테스트'].map((name,index)=>`<label class="import-card"><input type="checkbox" ${index<2?'checked':''}><span><img src="assets/${index===1?'clio-product.png':'clio-creator.png'}" alt="${name}"><i>0:${15+index*3}</i></span><b>${name}</b><small>2026.09.${18-index}</small></label>`).join('')}</div>`,actions:'<button class="ghost-modal" data-close>취소</button><button class="modal-primary" id="importConfirm">선택 영상 가져오기</button>'});$('[data-close]').addEventListener('click',closeModal);$('#importConfirm').addEventListener('click',()=>{const count=$$('.import-card input:checked').length;closeModal();if(count){$('#localDropzone').hidden=true;renderResults();showToast(`뷰티폼 영상 ${count}개를 가져왔어요`);}});});

function applyReportRecommendation(){const params=new URLSearchParams(location.search);const recommendation=params.get('recommend');if(!recommendation)return;const map={short:{category:'ugc',duration:'15초',prompt:'15초 이하로 핵심 장면만 남겨 완주율을 높여주세요. 첫 1초에 제품과 피부 결과를 동시에 보여주세요.'},keyword:{category:'makeup',duration:'15초',prompt:'요즘 반응이 높은 메쉬 쿠션, 물광, 얇은 밀착 키워드를 첫 3초 자막과 내레이션에 자연스럽게 포함해주세요.'},ugc:{category:'ugc',duration:'15초',prompt:'셀프캠 사용 전·후 비교 구조로 제작해주세요. 한쪽 얼굴에만 적용한 차이를 첫 2초에 보여주고 솔직한 UGC 말투를 사용해주세요.'},official:{category:'makeup',duration:'30초',prompt:'클리오 공식 SNS의 24시간 지속력 테스트 구조를 활용해 시간대별 피부 상태를 신뢰감 있게 보여주세요.'}};const data=map[recommendation]||map.short;activeSource=recommendation==='official'?'official':'trend';$$('.source-tabs button').forEach(button=>button.classList.toggle('active',button.dataset.source===activeSource));filterReferences();const card=$$('.reference-card').find(item=>!item.hidden&&item.dataset.category.includes(data.category))||$('.reference-card:not([hidden])');if(card)selectReference(card);$('#durationSelect').value=data.duration;$('#directionPrompt').value=data.prompt;pendingAutoPublish=params.get('publish')==='1';showToast('리포트 제안을 적용했어요','추천 설정으로 자동 생성을 시작합니다.');setTimeout(()=>{if(!$('#createButton').disabled)startGeneration();},500);}

renderPromptSuggestions();
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeModal();});
if(location.hash==='#automation')automationModal('jobs');
applyReportRecommendation();
