## 📌 프로젝트 개요

🔗 https://my.sjcpop.com/

**개발자를 위한 스터디, 프로젝트 모집 서비스**
😵‍💫 스터디 구하려다가 오픈카톡 타고, 디스코드 들어가고… 시작도 전에 지쳐보신 적 있으신가요?

🤔 신청은 왔는데 내가 찾는 신청자가 아니라서 난감했던 경험도 한 번쯤 있으셨죠? 
**모여라IT**은 ‘참여하기’ 버튼 한 번이면 신청 끝! 🙌
원하는 **기술 스택이나 포지션**이 모임에 표시되어 있으니까 딱 맞는 사람을 찾기 쉬워요 🔍
신청자의 프로필도 확인할 수 있고, 궁금한 점은 댓글로 가볍게 소통할 수도 있어요 💬😊

<img width="1265" alt="스크린샷 2025-06-23 오후 6 50 55" src="https://github.com/user-attachments/assets/4a8a9d3b-b910-4820-bb18-fa89ecd90fbc" />

### 🔄 서비스 흐름도
[🔗 플로우차트](https://www.figma.com/board/gLO4BefKt2EhU4QqC5VIIh/%EB%AA%A8%EC%97%AC%EB%9D%BC%EC%9E%87-%ED%94%8C%EB%A1%9C%EC%9A%B0%EC%B0%A8%ED%8A%B8?node-id=0-1&t=e68OLJ3BUTsbYdLM-1)

<br />

## 🚀 설치 및 실행



```jsx
$ yarn install
$ yarn dev
```

### 1. 로컬 개발 환경에서 쿠키 사용을 위한 설정

`SameSite=None` 및 `Secure=true` 쿠키를 정상적으로 사용하려면 다음과 같은 환경 구성이 필요합니다.

### ✅ `SameSite=None` 대응 – 커스텀 도메인 설정

`SameSite=None` 속성이 설정된 쿠키는 **도메인이 다를 경우**에도 전송되므로, 로컬에서도 실제 배포 도메인(`sjcpop.com`)과 유사한 도메인을 사용해야 합니다.

1. `/etc/hosts` 파일 수정:
    
    ```bash
    $ sudo vi /etc/hosts
    ```
    
2. 다음 라인을 추가:
    
    ```bash
    127.0.0.1 local.sjcpop.com
    ```
    

### ✅ `Secure=true` 대응 – HTTPS 개발 서버 실행

`Secure=true`가 설정된 쿠키는 **HTTPS 환경에서만** 전송됩니다. 로컬 개발 서버도 HTTPS로 실행해야 합니다.

1. Next.js를 HTTPS로 실행:
    
    ```bash
    $ yarn install
    $ yarn dev // => next dev --experimental-https
    ```
    
2. 브라우저에서 접속: https://local.sjcpop.com:3000

위 설정을 통해 로컬 환경에서도 실제 배포 환경처럼 쿠키 기반 인증과 API 요청을 테스트할 수 있습니다.

### 1-2. 환경변수 설정

`.env.local` 파일 생성 후 아래와 같이 추가합니다.

```jsx
NEXT_PUBLIC_API_BASE_URL=https://my-api.sjcpop.com/api
ACCESS_TOKEN=accessToken
REFRESH_TOKEN=refreshToken
```

### 1-1. 사용 ID, PW

- ID
- Password

## **사용 기술**
<img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=Next.js&logoColor=white"/> <img src="https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=Typescript&logoColor=white"/> <img src="https://img.shields.io/badge/TanstackQuery-E93D2C?style=flat-square&logo=ReactQuery&logoColor=white"/>
<img src="https://img.shields.io/badge/🐻 Zustand-5E5046?style=flat-square&logo=zustand&logoColor=white"/> <img src="https://img.shields.io/badge/ReactHookForm-E53E7E?style=flat-square&logo=ReactHookForm&logoColor=white"/>
<img src="https://img.shields.io/badge/Zod-2D55FE?style=flat-square&logo=Zod&logoColor=white"/> <img src="https://img.shields.io/badge/Shadcn-121212?style=flat-square&logo=ShadcnUI&logoColor=white"/> <img src="https://img.shields.io/badge/msw-FC5327?style=flat-square&logo=mswUI&logoColor=white"/>

<br />

## 📐 아키텍처

### 1.  폴더 구조

```jsx
📦src
 ┣ 📂__mocks__
 ┣ 📂actions
 ┣ 📂api
 ┣ 📂app
 ┃ ┣ 📂bookmark
 ┣ 📂components
 ┃ ┣ 📂atoms
 ┃ ┣ 📂error-boundary
 ┃ ┣ 📂error-fallback
 ┃ ┣ 📂molecules
 ┃ ┣ 📂organisms
 ┃ ┗ 📂ui
 ┣ 📂features
 ┣ 📂hooks
 ┣ 📂lib
 ┣ 📂mocks
 ┃ ┗ 📂handler
 ┣ 📂providers
 ┣ 📂stores
 ┣ 📂types
 ┗ 📂utils
```

### 2. 컴포넌트 설계

`components/` 디렉토리는 **Atomic Design** 패턴에 따라 다음과 같이 구성됩니다:

- `ui/` : Shadcn UI 컴포넌트가 설치되는 디렉토리
- `atoms/` : 더 이상 분해할 수 없는 최소 단위 컴포넌트
- `molecules/` : atoms를 조합하여 단일 기능을 수행하는 컴포넌트
- `organisms/` : atoms + molecules 조합, 독립적인 UI 영역 구성

`features/` 디렉토리는 기능 단위의 코드를 분리하려 관련 로직을 관리합니다.

`mocks/` 디렉토리는 API 서버 없이도 프론트엔드 개발 및 테스트가 가능하도록 MSW를 활용해 가짜 API를 구성할 수 있습니다

### 3. 상태 관리

- **Zustand**를 사용하여 전역 상태를 관리하고 있습니다.
- 서버 상태 관리 및 데이터 패칭은 **Tanstack Query**를 활용하여 캐싱 및 비동기 상태를 효율적으로 처리합니다.

### 4. API 통신 구조

- `fetch`를 기반으로 데이터를 요청하며, 공통 요청 로직은 `request.ts`에 정의되어 있습니다.

### 5. UI 디자인 시스템

- **Shadcn UI**와 **Tailwind CSS**를 사용하여 일관된 UI 컴포넌트를 구성하고 있습니다.
- Shadcn 컴포넌트는 `components/ui/` 폴더에 설치되며, Tailwind 유틸리티 클래스를 기반으로 커스터마이징합니다.

### 6. 테스트 구조

- API 서버가 준비되기 전까지는 **MSW(Mock Service Worker)**를 사용하여 목 데이터를 기반으로 개발 및 테스트를 진행했습니다.
- 각 페이지 라우트 하위에 `__test__/` 폴더를 두고 테스트 코드를 작성하고 있습니다.
    
    예: `app/group/[id]/__test__/`
    
    ```bash
    $ yarn test
    ```
    
- E2E 테스트는 `cypress` 를 통해 진행했습니다.
    
    ```bash
    $ yarn cypress:open
    ```
    

### 7. CI/CD

- **GitHub Actions**를 이용하여 CI(테스트/빌드) 및 배포를 자동화하고 있습니다.
- `dev` 브랜치에 푸시되면 자동으로 배포가 진행됩니다.
    

### 7. CI/CD

- **GitHub Actions**를 이용하여 CI(테스트/빌드) 및 배포를 자동화하고 있습니다.
- `dev` 브랜치에 푸시되면 자동으로 배포가 진행됩니다.

<br />

## 주요 기능
### 홈
- 추천 모임을 보여줍니다.
- 스터디, 프로젝트 목록을 조회합니다.
- 로그인한 유저는 모임을 만들거나 참여할 수 있습니다.

### 회원가입
- 이메일과 비밀번호로 계정을 생성합니다.

### 로그인
- 가입한 이메일과 비밀번호로 로그인할 수 있습니다.

### 이메일/비밀번호 찾기
- 해당 이메일로 가입했는지 여부를 확인할 수 있습니다.
- 이메일로 임시 비밀번호를 발송해줍니다. 받은 임시 비밀번호로 로그인 할 수 있습니다.

### 모임 만들기
- 원하는 태그를 설정하여 모임을 만듭니다.

### 모임 상세 페이지
- 모임 상세 정보를 확인하고 참여 신청을 할 수 있습니다.
- 주최자는 모임 취소/공유를 할 수 있습니다.
- 모임 관련 댓글을 달 수 있습니다.

### 찜한 모임
- 관심있는 모임을 찜하기 할 수 있습니다.
- 찜한 모임들만 보여집니다.

### 유저 페이지
- 유저의 상세 정보를 보여줍니다.
[ 마이 페이지 ]
- 프로필 수정을 할 수 있습니다.
- 내가 개설한 모임을 보여줍니다.
- 팔로잉, 팔로워 목록을 보여줍니다.
- 비밀번호 수정을 할 수 있습니다.
- 회원 탈퇴를 할 수 있습니다.

[ 다른 유저 페이지 ]
- 팔로우/언팔로우를 할 수 있습니다.




## ✨ 기능 상세 설명
[🔗 Link](https://thrilling-cough-c32.notion.site/21b091373e7180ada9cae55ccb740bbb?source=copy_link)


## 🐞 트러블 슈팅
[🔗 Link](https://thrilling-cough-c32.notion.site/218091373e7180388816effc11ca98c6?source=copy_link)

