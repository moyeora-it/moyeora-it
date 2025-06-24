describe('비밀번호 찾기', () => {
  beforeEach(() => {
    cy.fixture('auth/find-password.json').then((findPassword) => {
      // 로그인 인터셉트 설정
      cy.intercept(
        'POST',
        'https://my-api.sjcpop.com/api/v1/user/reset-password',
        (req) => {
          if (req.body.email !== 'asd@asd.asd') {
            // 이메일이 올바르지 않은 경우
            return req.reply(findPassword.findPasswordEmailFail);
          }

          // 올바른 이메일과 비밀번호인 경우
          return req.reply(findPassword.findPasswordSuccess);
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
        findPassword.getUserInfo,
      );

      // 로그인 페이지로 이동
      cy.visit('http://localhost:3000/login');

      // 비밀번호 찾기 링크 클릭
      cy.get('a')
        .contains(/^비밀번호 찾기$/)
        .click();

      cy.wait(1000);
    });
  });

  it('비밀번호 찾기 페이지 렌더링 테스트', () => {
    cy.get('p').contains(/^비밀번호 찾기$/);

    // 폼필드 렌더링 확인
    cy.get('form').within(() => {
      cy.contains('label', /^이메일$/).should('exist');
      cy.get('input[name="email"]').should('exist');

      cy.contains('button', /^비밀번호 초기화$/).should('exist');
    });

    // 회원가입 이메일 비밀번호 찾기 렌더링 확인
    cy.contains('a', /^로그인으로 돌아가기$/).should('exist');
  });

  // 비밀번호 찾기 폼 유효성 테스트
  it('비밀번호 찾기 폼 유효성 테스트: 아무것도 입력하지 않은 경우 => 에러 메시지 출력 확인', () => {
    // 아무 것도 없이 클릭이 에러 텍스트 확인
    cy.contains('button', /^비밀번호 초기화$/).click();
    cy.get('p').contains('이메일을 입력해주세요').should('exist');
  });

  // 잘못된 이메일 형식 테스트
  it('비밀번호 찾기 폼 유효성 테스트: 잘못된 이메일 형식 => 에러 메시지 출력 확인', () => {
    // 잘못된 이메일 형식 입력
    cy.get('input[name="email"]').type('asd@a');

    // 비밀번호 찾기 버튼 클릭
    cy.contains('button', /^비밀번호 초기화$/).click();

    // 에러 메시지 확인
    cy.get('p').contains('유효한 이메일이 아닙니다').should('exist');
  });

  // 올바른 형식의 이메일 => 존재하지 않는 이메일 테스트
  it('비밀번호 API 요청 실패 테스트: 존재하는 이메일 없음 => 에러 메시지 출력 확인', () => {
    // 올바른 이메일
    cy.get('input[name="email"]').type('nonexist@asd.asd');

    // 비밀번호 찾기 버튼 클릭
    cy.contains('button', /^비밀번호 초기화$/).click();

    // 에러 메시지 확인
    cy.get('p').contains('해당 이메일이 존재하지 않습니다').should('exist');
  });

  // 성공
  it('비밀번호 초기화 API 요청 성공 테스트 => 이메일 전송 성공 메시지 출력 확인', () => {
    // 올바른 이메일
    cy.get('input[name="email"]').type('asd@asd.asd');

    // 비밀번호 찾기 버튼 클릭
    cy.contains('button', /^비밀번호 초기화$/).click();

    cy.wait(1000);

    // 이메일 전송 성공 메시지 확인
    cy.get('p').contains('이메일을 확인해주세요!').should('exist');
    cy.get('a').contains('로그인하러 가기').should('exist');
  });
});
