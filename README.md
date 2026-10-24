# 동의 ♥ 예원 모바일 청첩장

주소: https://5d5ng.github.io/wedding/

## 폰에서 고치는 법 (GitHub 앱 또는 github.com)

### 문구·정보 바꾸기
1. 저장소에서 `content.js` 열기
2. 연필 아이콘(Edit) 누르기
3. 따옴표 `'...'` 안의 글자만 바꾸기 (줄바꿈은 `\n`)
4. 아래 **Commit changes** 누르기 → 1분 안에 청첩장에 반영

### 사진 바꾸기
- 메인 사진: `photos/cover.jpg`
- 신랑/신부 소개: `photos/groom.jpg`, `photos/bride.jpg`
- 갤러리: `photos/gallery/01.jpg` ~ `16.jpg`

**교체**: 해당 폴더에서 *Add file → Upload files* 로 **같은 파일 이름**의 사진을 올리면 덮어써져요.
**추가**: 새 이름(예: `17.jpg`)으로 올린 뒤 `content.js` 의 `gallery` 목록에 `'17.jpg'` 를 추가해요.
**삭제**: 사진 파일을 지우고 `gallery` 목록에서도 이름을 지워요.

사진은 가로 1400px 정도, 한 장 500KB 이하가 좋아요. 가로 사진은 갤러리에서 자동으로 넓은 칸에 들어가요.

### 예식 시간을 바꿨다면
`content.js` 의 `date`, `timeText` 와 함께 `wedding.ics`(아이폰 캘린더 파일)의 `DTSTART`/`DTEND`(한국시간 −9시간)도 바꿔야 해요.

### 카톡 미리보기
`index.html` 맨 위 `og:` 줄들이 카톡에 뜨는 제목·설명·사진이에요. 사진은 `photos/og.jpg` (1200×630).
바꾼 뒤 카톡에 예전 미리보기가 남아 있으면 카카오 공유 디버거에서 캐시를 초기화하세요.
