# 🚀 개발자를 위한 타자 연습 플랫폼

> 타이핑 속도 향상과 기술 개념 학습을 동시에 제공하는 인터랙티브 학습 웹 애플리케이션

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat&logo=vue.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)

## 📖 프로젝트 소개

개발자들이 타자 실력을 향상시키면서 동시에 컴퓨터 과학, 네트워크, 프로그래밍 등의 기술 개념을 학습할 수 있는 통합 학습 플랫폼입니다.

### ✨ 주요 기능

- **⌨️ 타자 연습**: 기술 콘텐츠를 활용한 타이핑 연습
- **🧠 퀴즈**: 학습한 개념을 검증하는 객관식 퀴즈
- **🎓 종합 시험**: 타이핑과 퀴즈가 결합된 심화 학습
- **📊 학습 분석**: 개인별 성과 분석 및 약점 파악
- **🎮 게임화**: 레벨 시스템과 도전 과제

## 🛠️ 기술 스택

- **Frontend**: Vue.js 3, Vue Router, Composition API
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Package Manager**: npm

## 🚀 시작하기

### 필요 조건

- Node.js 16.x 이상
- npm 7.x 이상

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/co2plant/TypingProject.git
cd TypingProject

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 📂 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── ContentList.vue
│   ├── QuizQuestion.vue
│   ├── ResultDisplay.vue
│   └── TypingPractice.vue
├── views/              # 페이지 컴포넌트
│   ├── HomeView.vue
│   ├── PracticeView.vue
│   ├── QuizView.vue
│   ├── ExamView.vue
│   └── Admin/          # 관리자 페이지
├── data/               # 정적 데이터
│   ├── typingContents.json
│   ├── quizData.json
│   └── examData.json
├── router/             # 라우팅 설정
└── assets/             # 정적 리소스
```

## 🎯 현재 상태

### ✅ 완료된 기능
- 기본 타자 연습 시스템
- 퀴즈 기능
- 반응형 UI (Tailwind CSS)
- 라우팅 시스템

### 🚧 개발 중
- 시험 기능 (타이핑 + 퀴즈 결합)
- 사용자 인증 시스템
- 관리자 페널

### 📋 향후 계획
자세한 개발 로드맵은 [TODO.md](./TODO.md)를 참고하세요.

## 🤝 기여하기

1. 이 저장소를 Fork 합니다
2. 새로운 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push 합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

## 📞 연락처

프로젝트 관련 문의사항이나 버그 리포트는 [GitHub Issues](https://github.com/co2plant/TypingProject/issues)를 통해 등록해주세요.

---

**⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요!**
