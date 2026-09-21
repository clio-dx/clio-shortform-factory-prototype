const videoData = {
  glow15: {
    title:'광채가 켜지는 15초', id:'VID-0921-018', product:'킬커버 메쉬 글로우 쿠션', image:'assets/clio-creator.png', status:'게시 완료',
    method:'AI 자동 생성', model:'Veo 3 Fast', reference:'1초 광채 전환 UGC', format:'15초 · 9:16', language:'한국어', creator:'자동화 · 킬커버 데일리 UGC',
    prompt:'첫 2초에 한쪽 얼굴의 광채 차이를 보여주고, 얇은 밀착감과 24시간 지속력을 셀프캠 UGC 톤으로 설명합니다.',
    timeline:[['제품 · 레퍼런스 선택','킬커버 메쉬 글로우 쿠션 + 1초 광채 전환 UGC'],['AI 영상 생성','Veo 3 Fast · 2026. 09. 21 08:48'],['자동 검수 완료','브랜드 금칙어 · 자막 안전 영역 통과'],['자동 업로드','자동화 작업에 따라 2개 채널 동시 게시']],
    channels:[['◎','Instagram Reels','@clio_official · 게시 완료 09:02','게시물 보기','live'],['▶','YouTube Shorts','CLIO Official · 게시 완료 09:04','게시물 보기','live']]
  },
  lasting24: {
    title:'24시간, 무너짐 없이', id:'VID-0920-042', product:'킬커버 메쉬 글로우 쿠션', image:'assets/clio-product.png', status:'게시 완료',
    method:'AI 수동 생성', model:'Veo 3 Fast', reference:'CLIO Instagram 24H 테스트', format:'20초 · 9:16', language:'한국어', creator:'담당자 MK',
    prompt:'공식 Instagram의 24시간 지속력 테스트를 참고해 오전, 오후, 저녁 피부 상태와 광채를 숫자 자막으로 비교합니다.',
    timeline:[['제품 · 공식 SNS 선택','킬커버 메쉬 글로우 쿠션 + Instagram 레퍼런스'],['AI 영상 생성','Veo 3 Fast · 2026. 09. 20 15:21'],['프롬프트 재편집','저녁 피부 클로즈업 장면 추가'],['직접 업로드','담당자 MK가 Instagram을 선택해 게시']],
    channels:[['◎','Instagram Reels','@clio_official · 게시 완료 18:00','게시물 보기','live']]
  },
  review28: {
    title:'킬커버 핵심 리뷰', id:'VID-0920-031', product:'킬커버 메쉬 글로우 쿠션', image:'assets/clio-creator.png', status:'게시 예약',
    method:'뷰티폼 가져오기', model:'BeautyForm 원본', reference:'원본 영상 + CTA 편집', format:'28초 · 9:16', language:'한국어', creator:'콘텐츠 캘린더',
    prompt:'뷰티폼 원본의 제품 사용 장면은 유지하고, 핵심 장점 자막과 마지막 제품 CTA만 클리오 톤으로 편집했습니다.',
    timeline:[['뷰티폼에서 가져오기','BeautyForm ID BF-88421'],['스튜디오 편집','자막 4개 · 마지막 CTA 컷 추가'],['검수 승인','담당자 YJ · 2026. 09. 20 16:40'],['예약 업로드','YouTube Shorts · 09. 22 12:00']],
    channels:[['▶','YouTube Shorts','CLIO Official · 09. 22 12:00 예약','예약됨','waiting']]
  },
  palette: {
    title:'올테이크 신색상 발색 릴레이', id:'VID-0919-027', product:'페리페라 올테이크 무드 팔레트', image:'assets/clio-creator.png', status:'검수 대기',
    method:'로컬 영상 업로드', model:'palette_launch_v3.mp4', reference:'원본 영상 · 자막 편집', format:'17초 · 9:16', language:'한국어', creator:'담당자 JY',
    prompt:'외부에서 제작한 원본 영상에 컬러명과 발색 순서 자막을 추가하고 브랜드 엔딩 프레임을 적용했습니다.',
    timeline:[['로컬 영상 업로드','palette_launch_v3.mp4 · 48.2MB'],['스튜디오 편집','컬러명 자막 · 엔딩 프레임 적용'],['업로드 요청','담당자 JY가 Instagram 선택'],['검수 대기','브랜드 매니저 승인 필요']],
    channels:[['◎','Instagram Reels','@peripera_official · 검수 대기','승인 대기','waiting']]
  },
  fairy: {
    title:'쿠션 요정 AI 애니', id:'VID-0919-011', product:'구달 어성초 진정 수분 선크림', image:'assets/clio-product.png', status:'미게시',
    method:'AI 수동 생성', model:'Runway Gen-4', reference:'쿠션 요정 AI 애니', format:'12초 · 1:1', language:'日本語', creator:'담당자 MK',
    prompt:'제품이 작은 캐릭터로 변해 붉어진 피부를 진정시키는 4컷 애니메이션. 일본어 자막과 제품 팩샷으로 마무리합니다.',
    timeline:[['제품 · 템플릿 선택','구달 선크림 + AI 캐릭터 템플릿'],['AI 영상 생성','Runway Gen-4 · 2026. 09. 19 11:20'],['새 버전 저장','일본어 자막 · 1:1 비율'],['업로드 미설정','게시 플랫폼과 일정이 아직 없습니다']],
    channels:[]
  },
  tint: {
    title:'잉크 무드 글로이 컬러 비교', id:'VID-0918-054', product:'페리페라 잉크 무드 글로이 틴트', image:'assets/clio-product.png', status:'게시 완료',
    method:'AI 자동 생성', model:'Kling 2.1', reference:'비트컷 발색 릴레이', format:'16초 · 9:16', language:'English', creator:'자동화 · 페리페라 신색상 런칭',
    prompt:'다섯 가지 컬러를 음악 비트마다 전환하고 컬러명과 피니시를 영어 자막으로 보여주는 발색 비교 영상입니다.',
    timeline:[['제품 · 템플릿 자동 매칭','잉크 무드 글로이 틴트 + 발색 릴레이'],['AI 영상 생성','Kling 2.1 · 2026. 09. 18 17:31'],['자동 검수 완료','색상명 · 자막 안전 영역 통과'],['자동 업로드','런칭 자동화에서 2개 채널 동시 게시']],
    channels:[['◎','Instagram Reels','@peripera_official · 게시 완료 18:00','게시물 보기','live'],['▶','YouTube Shorts','PERIPERA Official · 게시 완료 18:03','게시물 보기','live']]
  }
};

const rows = [...document.querySelectorAll('#videoRows tr')];
const search = document.querySelector('#videoSearch');
const filters = ['#methodFilter','#platformFilter','#statusFilter'].map(selector => document.querySelector(selector));

function applyFilters() {
  const query = search.value.trim().toLowerCase();
  const [method, platform, status] = filters.map(filter => filter.value);
  let visible = 0;
  rows.forEach(row => {
    const match = (!query || row.dataset.search.includes(query)) &&
      (method === 'all' || row.dataset.method === method) &&
      (platform === 'all' || row.dataset.platform.split(' ').includes(platform)) &&
      (status === 'all' || row.dataset.status === status);
    row.hidden = !match;
    if (match) visible += 1;
  });
  document.querySelector('#visibleCount').textContent = visible;
  document.querySelector('#noVideos').hidden = visible !== 0;
  document.querySelector('.video-table-wrap').hidden = visible === 0;
}

search.addEventListener('input', applyFilters);
filters.forEach(filter => filter.addEventListener('change', applyFilters));

function timelineHtml(items) {
  return items.map(item => `<div class="timeline-item"><i class="timeline-dot"></i><div class="timeline-copy"><b>${item[0]}</b><span>${item[1]}</span></div></div>`).join('');
}

function channelHtml(items) {
  if (!items.length) return '<div class="empty-channel">게시된 플랫폼이 없습니다.<br>스튜디오에서 업로드 설정을 추가할 수 있어요.</div>';
  return items.map(item => `<div class="channel-item"><span class="channel-logo">${item[0]}</span><div><b>${item[1]}</b><small>${item[2]}</small></div>${item[4] === 'live' ? `<a href="#" data-channel-link>${item[3]} ↗</a>` : `<em class="waiting">${item[3]}</em>`}</div>`).join('');
}

function openDetail(id) {
  const data = videoData[id];
  const modal = document.querySelector('#videoModal');
  modal.innerHTML = `<div class="video-modal-backdrop"><section class="video-modal" role="dialog" aria-modal="true" aria-labelledby="videoDetailTitle"><header><div><p class="eyebrow">VIDEO HISTORY · ${data.id}</p><h2 id="videoDetailTitle">영상 상세 이력</h2></div><button class="video-modal-close" aria-label="닫기">×</button></header><div class="detail-hero"><div class="detail-preview"><img src="${data.image}" alt="${data.title} 미리보기"><button aria-label="영상 재생">▶</button></div><div><div class="detail-heading"><div><span class="state ${data.status === '게시 완료' ? 'published' : data.status === '미게시' ? 'draft' : 'scheduled'}">${data.status}</span><h3>${data.title}</h3><p>${data.product}</p></div></div><div class="detail-grid"><div><span>제작 방식</span><b>${data.method}</b></div><div><span>모델 · 원본</span><b>${data.model}</b></div><div><span>레퍼런스</span><b>${data.reference}</b></div><div><span>영상 규격</span><b>${data.format}</b></div><div><span>영상 언어</span><b>${data.language}</b></div><div><span>담당 · 자동화</span><b>${data.creator}</b></div></div><div class="detail-prompt"><span>제작 내용 · 최종 프롬프트</span><p>${data.prompt}</p></div></div></div><div class="history-grid"><section class="history-panel"><h4>제작 · 업로드 이력</h4><div class="timeline">${timelineHtml(data.timeline)}</div></section><section class="history-panel"><h4>게시 플랫폼</h4><div class="channel-history">${channelHtml(data.channels)}</div></section></div><footer><button data-close>닫기</button><a href="index.html" class="primary">이 설정으로 다시 만들기</a></footer></section></div>`;
  document.body.style.overflow = 'hidden';
  const close = () => { modal.innerHTML = ''; document.body.style.overflow = ''; };
  modal.querySelector('.video-modal-close').addEventListener('click', close);
  modal.querySelector('[data-close]').addEventListener('click', close);
  modal.querySelector('.video-modal-backdrop').addEventListener('click', event => { if (event.target.classList.contains('video-modal-backdrop')) close(); });
  modal.querySelectorAll('[data-channel-link]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); showToast('게시물 링크를 열었어요', '프로토타입 샘플 동작입니다.'); }));
}

document.querySelectorAll('[data-detail]').forEach(button => button.addEventListener('click', () => openDetail(button.dataset.detail)));
document.querySelectorAll('.video-thumb button').forEach(button => button.addEventListener('click', () => showToast('영상 미리보기를 재생합니다', '프로토타입 샘플 영상입니다.')));

document.querySelector('#sortButton').addEventListener('click', event => {
  const tbody = document.querySelector('#videoRows');
  rows.reverse().forEach(row => tbody.appendChild(row));
  event.currentTarget.textContent = event.currentTarget.textContent.includes('↓') ? '오래된순 ↑' : '최신순 ↓';
});

document.querySelectorAll('.library-footer button:not(:disabled)').forEach(button => button.addEventListener('click', () => {
  if (!/^\d+$/.test(button.textContent)) return showToast('다음 페이지로 이동했어요', '샘플 목록에서는 현재 데이터가 유지됩니다.');
  document.querySelectorAll('.library-footer button').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  showToast(`${button.textContent}페이지를 선택했어요`, '샘플 목록에서는 현재 데이터가 유지됩니다.');
}));

function showToast(message, detail) {
  const toast = document.createElement('div');
  toast.className = 'video-toast';
  toast.innerHTML = `<b>${message}</b><small>${detail}</small>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2600);
}
