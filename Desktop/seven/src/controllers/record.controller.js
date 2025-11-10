// src/controllers/record.controller.js (기록 복구를 위한 최소한의 코드)
class RecordController {
  getRecords = async (req, res, next) => {
    res.status(200).json({ message: "Record list placeholder", data: [] });
  };
}
export const recordController = new RecordController();
