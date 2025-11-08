// src/routes/group.routes.js

const express = require("express");
const router = express.Router();
const groupController = require("../controllers/group.controller");

// ... 그룹 목록 조회 라우트가 이미 있다고 가정 ...

// 💡 랭킹 조회 라우트 추가
// GET /api/groups/:groupId/ranking?type=weekly&page=1
router.get("/:groupId/ranking", groupController.getRanking);

// ... 그룹 등록/수정/삭제 라우트 ...

module.exports = router;
