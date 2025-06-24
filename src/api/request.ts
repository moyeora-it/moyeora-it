import fetchRefreshToken from '@/features/auth/utils/fetchRefreshToken';
import useAuthStore from '@/stores/useAuthStore';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; //환경변수로 분리

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  headers?: HeadersInit;
  body?: BodyInit | object;
  credentials?: RequestCredentials;
};

/**
 * 쿼리 파라미터를 처리하는 함수에서 사용
 * @param endpoint api 엔드포인트
 * @param queryParams 쿼리 파라미터
 * @returns 쿼리 파라미터가 있는 엔드포인트
 */
const buildUrl = (
  endpoint: string,
  queryParams?: Record<string, string | number | Array<string | number>>,
) => {
  if (!queryParams) return `${baseUrl}${endpoint}`;
  const queryString = Object.entries(queryParams)
    .filter(([, value]) => {
      return value !== 'null';
    }) // order가 desc인 경우 cursor=null이고 이는 제외하고 요청해야 함
    .map(([key, value]) => {
      const encodedKey = encodeURIComponent(key); // 특수문자, 한글인 경우가 있을 수 있으므로 인코딩
      if (Array.isArray(value)) {
        return `${encodedKey}=${value
          .map((v) => encodeURIComponent(v))
          .join(',')}`; // 배열 경우 배열 요소 인코딩
      }
      return `${encodedKey}=${encodeURIComponent(value)}`;
    })
    .join('&');
  return `${baseUrl}${endpoint}?${queryString}`;
};

/**
 * 요청 처리 함수
 * @param url 요청 주소
 * @param options 요청 옵션
 * @returns 요청 결과
 */
const fetchHandler = async (
  url: string,
  {
    method = 'GET',
    headers,
    body,
    credentials = 'same-origin',
  }: RequestOptions = {},
) => {
  let triedRefresh = false; // 토큰 갱신 시도 여부
  const headersObj = new Headers(headers || {});

  const makeRequest = async () => {
    // 헤더에 컨텐츠 타입이 있는지 확인
    const contentType =
      headersObj.get('content-type') || headersObj.get('Content-Type');
    const isJson = contentType?.toLowerCase().includes('application/json');

    return fetch(url, {
      method,
      headers: headersObj,
      body:
        isJson && typeof body === 'object'
          ? JSON.stringify(body)
          : (body as BodyInit),
      credentials,
    });
  };

  const response = await makeRequest();

  if (!response.ok) {
    if (response.status === 401 && !triedRefresh) {
      try {
        const success = await fetchRefreshToken();
        triedRefresh = true;

        if (!success) {
          throw new Error('refresh 만료');
        }

        const response2 = await makeRequest();
        return response2.json();
      } catch (e) {
        console.log(e);

        // 실패시 로그아웃 요청후
        await request.post(
          '/v1/user/logout',
          {
            'Content-Type': 'application/json',
          },
          '{}',
          {
            credentials: 'include',
          },
        );

        useAuthStore.setState(() => ({
          user: null,
        }));

        throw new Error('refresh 만료');
      }
    }

    const errorText = await response.text();
    switch (response.status) {
      case 401:
        throw new Error('Unauthorized');
      case 403:
        throw new Error('Forbidden');
      case 404:
        throw new Error('Not Found');
      default:
        throw new Error(
          `[${response.status}] ${response.statusText} - ${errorText}`,
        );
    }
  }

  return response.json();
};

/**
 * get, post, patch, delete 요청을 처리하는 객체
 * @param endpoint: api 엔드포인트
 * @param queryParams: 쿼리 파라미터
 * @returns
 */
export const request = {
  get: async (
    endpoint: string,
    queryParams?: Record<string, string | number | Array<string | number>>,
    options?: Pick<RequestOptions, 'credentials'>,
    headers?: HeadersInit,
  ) => {
    const url = buildUrl(endpoint, queryParams);
    return await fetchHandler(url, {
      method: 'GET',
      credentials: options?.credentials ?? 'same-origin', // 기본값 설정
      headers,
    });
  },
  post: async (
    endpoint: string,
    headers: HeadersInit,
    body?: BodyInit,
    options?: Pick<RequestOptions, 'credentials'>,
  ) => {
    return await fetchHandler(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body,
      credentials: options?.credentials ?? 'same-origin',
    });
  },
  patch: async (
    endpoint: string,
    headers: HeadersInit,
    body: object,
    options?: Pick<RequestOptions, 'credentials'>,
  ) => {
    return await fetchHandler(`${baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers,
      body,
      credentials: options?.credentials ?? 'same-origin',
    });
  },
  delete: async (
    endpoint: string,
    options?: Pick<RequestOptions, 'credentials'>,
  ) => {
    return await fetchHandler(`${baseUrl}${endpoint}`, {
      method: 'DELETE',
      credentials: options?.credentials ?? 'same-origin',
    });
  },
};
