// src/middlewares/error-handler.js

/**
 * 404 Not Found 핸들러
 * 모든 라우터를 거쳤는데도 경로를 찾지 못했을 때 호출됩니다.
 */
export const notFoundHandler = (req, res, next) => {
  // 404 에러를 생성하여 Global Error Handler로 전달
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

/**
 * Global Error Handler 미들웨어
 * Express의 4가지 인자 (err, req, res, next)를 가집니다.
 */
export const errorHandler = (err, req, res, next) => {
  // 1. 상태 코드 결정
  // err.status가 있다면 사용하고, 없으면 500 (Internal Server Error)을 기본값으로 사용
  const statusCode = err.status || 500;

  // 2. 응답 메시지 결정
  // 개발 환경에서는 자세한 에러 메시지를, 운영 환경에서는 일반적인 메시지를 사용하도록 설정 가능
  const message = err.message || "Internal Server Error";

  // 3. 콘솔에 상세 로그 출력 (서버 디버깅 용도)
  console.error(
    `[ERROR] Status: ${statusCode}, Path: ${req.path}, Message: ${message}`
  );
  if (statusCode === 500) {
    // 서버 에러(500)일 경우에만 스택 트레이스 출력
    console.error(err.stack);
  }

  // 4. 클라이언트에게 일관된 JSON 응답 전송
  res.status(statusCode).json({
    status: "error",
    message: message,
    // (선택 사항) 개발 환경에서만 에러 스택을 제공할 수 있습니다.
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

// NOTE: 이 파일은 app.js에서 import되어 사용됩니다.
