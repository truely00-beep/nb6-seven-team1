// src/controllers/record.controller.js (수정 권장)

// NOTE: recordService 파일을 import 해야 합니다.
import { recordService } from "../services/record.service.js";

class RecordController {
  getRecords = async (req, res, next) => {
    try {
      // ⬅️ try 블록 시작
      // ⬇️ Service Layer 호출 (MVP 패턴 준수)
      const records = await recordService.getRecords(req.query);

      res.status(200).json({
        message: "기록 목록 조회 성공", // 실제 성공 메시지로 변경
        data: records, // Service에서 받은 실제 데이터를 반환
      });
    } catch (error) {
      // ⬅️ 에러 발생 시 Global Error Handler로 전달
      next(error);
    }
  };
}
export const recordController = new RecordController();
