describe('로그인 페이지', () => {
  beforeEach(() => {
    cy.fixture('auth/login.json').then((loginFixture) => {
      // 로그인 인터셉트 설정
      cy.intercept(
        'POST',
        'https://my-api.sjcpop.com/api/v1/user/login',
        (req) => {
          if (req.body.email !== 'asd@asd.asd') {
            // 이메일이 올바르지 않은 경우
            return req.reply(loginFixture.loginEmailFail);
          }

          if (req.body.password !== 'correctPassword123') {
            // 비밀번호가 올바르지 않은 경우
            return req.reply(loginFixture.loginPasswordFail);
          }

          // 올바른 이메일과 비밀번호인 경우
          return req.reply(loginFixture.loginSuccess);
        },
      );

      cy.intercept('GET', 'https://my-api.sjcpop.com/api/v1/notification*', {
        statusCode: 200,
        body: {
          notifications: [],
          totalCount: 0,
        },
      });

      cy.intercept(
        'GET',
        'https://my-api.sjcpop.com/api/v1/notification/unread-count*',
        {
          statusCode: 200,
          body: {
            unreadCount: 0,
          },
        },
      );

      cy.intercept(
        'GET',
        'https://my-api.sjcpop.com/api/v1/user/info*',
        loginFixture.getUserInfo,
      );

      // 로그인 페이지로 이동
      cy.visit('http://localhost:3000/login');
    });
  });

  it('로그인 페이지 렌더링 테스트', () => {
    // 로그인 페이지가 렌더링 확인
    cy.get('p').contains('로그인');

    // 폼필드 렌더링 확인
    cy.get('form').within(() => {
      cy.contains('label', /^이메일$/).should('exist');
      cy.get('input[name="email"]').should('exist');

      cy.contains('label', /^비밀번호$/).should('exist');
      cy.get('input[name="password"]').should('exist');

      cy.contains('button', /^로그인$/).should('exist');
    });

    // 회원가입 이메일 비밀번호 찾기 렌더링 확인
    cy.contains('a', /^회원가입$/).should('exist');
    cy.contains('a', /^이메일 찾기$/).should('exist');
    cy.contains('a', /^비밀번호 찾기$/).should('exist');
  });

  // 로그인 폼 유효성 테스트
  it('로그인 폼 유효성 테스트: 아무것도 입력하지 않은 경우 => 에러 메시지 출력 확인', () => {
    // 아무 것도 없이 클릭이 에러 텍스트 확인
    cy.contains('button', /^로그인$/).click();
    cy.get('p').contains('이메일을 입력해주세요').should('exist');
    cy.get('p').contains('비밀번호를 입력해주세요').should('exist');
  });

  // 잘못된 이메일 형식 테스트
  it('로그인 폼 유효성 테스트: 잘못된 이메일 형식 => 에러 메시지 출력 확인', () => {
    // 로그인 페이지 접속

    // 잘못된 이메일 형식 입력
    cy.get('input[name="email"]').type('asd@a');
    cy.get('input[name="password"]').type('validPassword123');

    // 로그인 버튼 클릭
    cy.contains('button', /^로그인$/).click();

    // 에러 메시지 확인
    cy.get('p').contains('유효한 이메일이 아닙니다').should('exist');
  });

  // 비밀번호는 형식검사를 하지 않으므로 패스(입력 여부만 판단)

  // 올바른 형식의 이메일과 비밀번호
  it('로그인 API 요청 실패 테스트: 존재하는 이메일 없음 => 에러 메시지 출력 확인', () => {
    // 올바른 이메일과 비밀번호 입력
    cy.get('input[name="email"]').type('nonexist@asd.asd');
    cy.get('input[name="password"]').type('correctPassword123');

    // 로그인 버튼 클릭
    cy.contains('button', /^로그인$/).click();

    // 에러 메시지 확인
    cy.get('p').contains('로그인에 실패했습니다').should('exist');
  });

  // 틀린 비밀번호
  it('로그인 API 요청 실패 테스트: 비번틀림 => 에러 메시지 출력 확인', () => {
    // 올바른 이메일과 비밀번호 입력
    cy.get('input[name="email"]').type('asd@asd.asd');
    cy.get('input[name="password"]').type('wrongPassword123');

    // 로그인 버튼 클릭
    cy.contains('button', /^로그인$/).click();

    // 에러 메시지 확인
    cy.get('p').contains('로그인에 실패했습니다').should('exist');
  });

  // 로그인 성공후 트리거 테스트
  it('로그인 성공후 트리거 테스트: 북마크페이지 => 로그인 페이지 => 로그인 성공 => 북마크페이지로 되돌아가야함', () => {
    // 북마크 페이지 이동
    cy.visit('http://localhost:3000/bookmark');

    // 로그인 트리거 작동할 때까지 대기
    cy.wait(500);

    // 로그인 페이지로 이동
    // 절대 visit로 하면 안됨!! 로그인 버튼으로 해야함!!
    cy.get('button').contains('로그인 및 회원가입').click();

    // 올바른 이메일과 비밀번호 입력
    cy.get('input[name="email"]').type('asd@asd.asd');
    cy.get('input[name="password"]').type('correctPassword123');

    // 로그인 버튼 클릭
    cy.contains('button', /^로그인$/).click();

    // 로그인 성공 후 북마크 페이지로 리다이렉트 확인
    cy.url().should('include', '/bookmark');
  });
});
