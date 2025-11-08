// src/app.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// --- 미들웨어/핸들러 import ---
// NOTE: 이 파일들이 src/middlewares에 존재해야 합니다.
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.js";

// --- 라우터 import (MVC 폴더 구조에 맞춰 경로 지정) ---
// NOTE: 모든 라우터 파일이 src/routes 폴더에 존재해야 합니다.
import groupRoutes from "./routes/group.routes.js";
import rankingRoutes from "./routes/ranking.routes.js";
import recordRoutes from "./routes/record.routes.js";

// ES 모듈 환경에서 __dirname(__filename) 사용을 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 환경 변수 로드 (.env 파일)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --------------------------------------------
// 1. 미들웨어 설정
// --------------------------------------------

// CORS 설정
app.use(cors());

// JSON 요청 본문 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공 (업로드된 이미지를 웹에서 접근 가능하도록 설정)
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// --------------------------------------------
// 2. 라우터 등록 (API 엔드포인트 활성화)
// --------------------------------------------

// 모든 API는 /api/[기능명] 접두사로 시작합니다.
app.use("/api/groups", groupRoutes);
app.use("/api/ranking", rankingRoutes); // 랭킹 API 등록
app.use("/api/records", recordRoutes); // 기록 API 등록

// --------------------------------------------
// 3. 에러 핸들러 등록 (라우터 뒤에 위치해야 함)
// --------------------------------------------

// 404 Not Found 핸들러
app.use(notFoundHandler);

// Global Error Handler (심화 요구 사항)
app.use(errorHandler);

// --------------------------------------------
// 4. 서버 시작
// --------------------------------------------

app.listen(PORT, () => {
  console.log(`🚀 Team1 SEVEN API Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
