describe('회원가입 페이지', () => {
  beforeEach(() => {
    cy.fixture('auth/register.json').then((registerFixture) => {
      // 로그인 인터셉트 설정
      cy.intercept(
        'POST',
        'https://my-api.sjcpop.com/api/v1/user/signup',
        (req) => {
          if (req.body.email === 'same@same.com') {
            // 이메일이 중복인 경우
            return req.reply(registerFixture.registerEmailFail);
          }

          // 올바른 이메일과 비밀번호인 경우
          return req.reply(registerFixture.registerSuccess);
        },
      );

      // 로그인 인터셉트 설정
      cy.intercept(
        'POST',
        'https://my-api.sjcpop.com/api/v1/user/login',
        (req) => {
          return req.reply(registerFixture.loginSuccess);
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
        'PATCH',
        'https://my-api.sjcpop.com/api/v1/user/edit',
        (req) => {
          return req.reply(registerFixture.registerOptional);
        },
      );

      cy.intercept(
        'GET',
        'https://my-api.sjcpop.com/api/v1/user/info*',
        registerFixture.getUserInfo,
      );

      // 로그인 페이지로 이동
      cy.visit('http://localhost:3000/login');

      // 회원가입 링크 클릭
      cy.contains('a', /^회원가입$/).click();

      // 페이지 로딩 대기
      cy.wait(2000);
    });
  });

  it('회원가입 페이지 렌더링 테스트', () => {
    // 회원가입 페이지 렌더링 확인
    cy.get('p').contains(/^회원가입$/);

    // 폼필드 렌더링 확인
    cy.get('form').within(() => {
      cy.contains('label', /^이메일$/).should('exist');
      cy.get('input[name="email"]').should('exist');

      cy.contains('label', /^비밀번호$/).should('exist');
      cy.get('input[name="password"]').should('exist');

      cy.contains('label', /^비밀번호 확인$/).should('exist');
      cy.get('input[name="passwordConfirm"]').should('exist');

      cy.contains('button', /^회원가입$/).should('exist');
    });

    // 로그인하러가기 렌더링 확인
    cy.contains('a', '이미 회원이신가요?').should('exist');
  });

  // 회원가입 폼 유효성 테스트
  it('회원가입 폼 유효성 테스트: 아무것도 입력하지 않은 경우 => 에러 메시지 출력 확인', () => {
    // 아무 것도 없이 클릭이 에러 텍스트 확인
    cy.contains('button', /^회원가입$/).click();

    cy.get('p').contains('이메일을 입력해주세요').should('exist');
    cy.get('p').contains('비밀번호를 입력해주세요').should('exist');
    cy.get('p').contains('비밀번호를 다시 입력해주세요').should('exist');
  });

  // 잘못된 형식
  it('회원가입 폼 유효성 테스트: 잘못된 이메일, 비밀번호 형식 => 에러 메시지 출력 확인', () => {
    // 잘못된 이메일 형식 입력
    cy.get('input[name="email"]').type('asd@a');
    cy.get('input[name="password"]').type('invalid123');
    cy.get('input[name="passwordConfirm"]').type('different@@');

    // 회원가입 버튼 클릭
    cy.contains('button', /^회원가입$/).click();

    // 에러 메시지 확인
    cy.get('p').contains('유효한 이메일이 아닙니다').should('exist');
    cy.get('p')
      .contains('영어, 숫자, 특수문자를 혼합하여 8자리 이상')
      .should('exist');
    cy.get('p').contains('비밀번호가 일치하지 않습니다').should('exist');
  });

  // 올바른 형식의 이메일과 비밀번호
  it('회원가입 API 요청 실패 테스트: 이메일 중복 => 에러 메시지 출력 확인', () => {
    // 올바른 이메일과 비밀번호 입력
    cy.get('input[name="email"]').type('same@same.com');
    cy.get('input[name="password"]').type('correctPassword123!@#');
    cy.get('input[name="passwordConfirm"]').type('correctPassword123!@#');

    // 회원가입 버튼 클릭
    cy.contains('button', /^회원가입$/).click();

    // 에러 메시지 확인
    cy.get('p').contains('이미 존재하는 회원입니다').should('exist');
  });

  // 회원가입 성공후 프로필 설정 폼 렌더링 테스트
  it('회원가입 성공후 프로필 설정 폼 렌더링 테스트', () => {
    // 올바른 이메일과 비밀번호 입력
    cy.get('input[name="email"]').type('notsame@notsame.com');
    cy.get('input[name="password"]').type('correctPassword123!@#');
    cy.get('input[name="passwordConfirm"]').type('correctPassword123!@#');

    // 회원가입 버튼 클릭
    cy.contains('button', /^회원가입$/).click();

    // 프로필 설정 폼이 나와야함
    cy.get('form').within(() => {
      cy.contains('label', /^닉네임$/).should('exist');
      cy.get('input[name="nickname"]').should('exist');

      cy.contains('label', /^포지션$/).should('exist');
      cy.get("div[class='flex gap-4 flex-wrap']")
        .eq(0)
        .within(() => {
          ['PM', 'PL', 'AA', 'TA', 'DA', 'QA', 'FE', 'BE', 'FS'].forEach(
            (position) => {
              cy.get('label').contains(position);
            },
          );
        });

      cy.contains('label', /^기술 스택$/).should('exist');
      cy.get("div[class='flex gap-4 flex-wrap']")
        .eq(1)
        .within(() => {
          [
            'Java',
            'JavaScript',
            'HTML_CSS',
            'REACT',
            'Vue',
            'Kotlin',
            'Spring',
          ].forEach((skill) => {
            cy.get('label').contains(skill);
          });
        });

      cy.contains('button', /^프로필 설정하기$/).should('exist');
    });
  });

  // 프로필 설정 폼 유효성 검사
  it('프로필 설정 빈값 입력 => 에러 메시지 출력 확인', () => {
    // 올바른 이메일과 비밀번호 입력
    cy.get('input[name="email"]').type('notsame@notsame.com');
    cy.get('input[name="password"]').type('correctPassword123!@#');
    cy.get('input[name="passwordConfirm"]').type('correctPassword123!@#');

    // 회원가입 버튼 클릭
    cy.contains('button', /^회원가입$/).click();

    cy.wait(2000);

    // 프로필 설정 빈값 입력
    cy.get('form').within(() => {
      cy.contains('button', /^프로필 설정하기$/).click();

      cy.get('p').contains('포지션을 선택해주세요').should('exist');
    });
  });

  // 프로필 설정 성공 후 트리거 테스트
  it('프로필 설정후 트리거 테스트: 북마크페이지 => 로그인페이지 => 회원가입 페이지 => 프로필 설정 완료 => 북마크 페이지', () => {
    // 북마크 페이지 이동
    cy.visit('http://localhost:3000/bookmark');

    // 로그인 트리거 작동할 때까지 대기
    cy.wait(2000);

    // 로그인 페이지로 이동
    // 절대 visit로 하면 안됨!! 로그인 버튼으로 해야함!!
    cy.get('button').contains('로그인 및 회원가입').click();

    // 회원가입 링크 클릭
    cy.contains('a', /^회원가입$/).click();

    cy.wait(2000);

    // 올바른 이메일과 비밀번호 입력
    cy.get('input[name="email"]').type('notsame@notsame.com');
    cy.get('input[name="password"]').type('correctPassword123!@#');
    cy.get('input[name="passwordConfirm"]').type('correctPassword123!@#');

    // 회원가입 버튼 클릭
    cy.contains('button', /^회원가입$/).click();

    // 프로필 설정
    cy.get('form').within(() => {
      cy.get('input[name="nickname"]').type('testuser');
      cy.get('label').contains('FE').click();
      cy.get('label').contains('REACT').click();

      cy.contains('button', /^프로필 설정하기$/).click();
    });

    // 프로필 설정 성공 후 북마크 페이지로 리다이렉트 확인
    cy.url().should('include', '/bookmark');
  });
});
