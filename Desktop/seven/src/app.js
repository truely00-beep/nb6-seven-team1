// src/app.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// --- 미들웨어/핸들러 import ---
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.js";

// --- 라우터 import (경로 확인) ---
import groupRoutes from "./routes/group.routes.js";
import rankingRoutes from "./routes/ranking.routes.js";
import recordRoutes from "./routes/record.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --------------------------------------------
// 1. 미들웨어 설정
// --------------------------------------------
app.use(cors());
app.use(express.json());
// ... (기타 미들웨어 생략)

// --------------------------------------------
// 2. 라우터 등록
// --------------------------------------------
app.use("/api/groups", groupRoutes);
app.use("/api/ranking", rankingRoutes);
app.use("/api/records", recordRoutes);

// --------------------------------------------
// 3. 에러 핸들러 등록
// --------------------------------------------
app.use(notFoundHandler);
app.use(errorHandler);

// --------------------------------------------
// 4. 서버 시작
// --------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Team1 SEVEN API Server is running on port ${PORT}`);
});

export default app;
