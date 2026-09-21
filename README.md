# CLIO Shortform Factory Prototype

클리오 제품 정보와 바이럴 레퍼런스를 조합해 숏폼 영상을 생성하고, 편집·자동 업로드·성과 분석까지 체험하는 정적 HTML 프로토타입입니다.

## 실행

`dist/index.html`을 브라우저에서 열거나 정적 웹 서버의 루트로 `dist` 폴더를 지정합니다.

## 주요 화면

- `dist/index.html`: 제품 및 레퍼런스 선택, 프롬프트 템플릿, 영상 생성, 편집, 플랫폼 업로드, 자동화 설정
- `dist/admin.html`: 영상·기간·플랫폼별 ENG, API 비용, 기여 매출, ROI 리포트

## 원 요청 프롬프트에 추가된 Git 배포 조건

- Git 저장소: `https://github.com/clio-dx/clio-shortform-factory-prototype`
- 프로젝트를 Git으로 초기화하고 완성된 HTML 프로토타입을 저장소에 반영한다.
- GitHub Pages에서 직접 확인할 수 있도록 자동 배포한다.
- 최종 GitHub Pages URL을 결과로 반환한다.

## 배포

`main` 브랜치에 변경 사항이 반영되면 `.github/workflows/pages.yml`이 `dist` 폴더를 GitHub Pages에 배포합니다.
