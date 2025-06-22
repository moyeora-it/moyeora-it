# 모여라IT
## 프로젝트 소개


🔗 https://my.sjcpop.com/

개발자를 위한 스터디, 프로젝트 모집 서비스

유저가 사용중인 기술과 포지션을 설정하여 목적에 부합한 스터디, 프로젝트에 더 쉽게 참가할 수 있습니다.

[메인 사진]

## 설치 및 실행


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

`.env` 파일 생성 후 아래와 같이 추가합니다.

```jsx
NEXT_PUBLIC_API_BASE_URL=https://my-api.sjcpop.com/api
```

### 1-1. 사용 ID, PW

- ID
- Password

## **아키텍처**


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
 ┃ ┣ 📂handler
 ┣ 📂providers
 ┣ 📂stores
 ┣ 📂types
 ┗ 📂utils
```

components

- atomic 디자인 적용 : 중복되는 컴포넌트들 간의 재사용성을 높임

features

- 기능별로 features 폴더 안에 폴더를 구성하여 관리

## **사용 기술**
<img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=Next.js&logoColor=white"/>
<img src="https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=Typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/TanstackQuery-E93D2C?style=flat-square&logo=ReactQuery&logoColor=white"/>
<img src="https://img.shields.io/badge/🐻 Zustand-5E5046?style=flat-square&logo=zustand&logoColor=white"/>
<img src="https://img.shields.io/badge/ReactHookForm-E53E7E?style=flat-square&logo=ReactHookForm&logoColor=white"/>
<img src="https://img.shields.io/badge/Zod-2D55FE?style=flat-square&logo=Zod&logoColor=white"/>
<img src="https://img.shields.io/badge/Shadcn-121212?style=flat-square&logo=ShadcnUI&logoColor=white"/>