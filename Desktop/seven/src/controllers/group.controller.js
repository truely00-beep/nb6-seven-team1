// src/controllers/group.controller.js (그룹 복구를 위한 최소한의 코드)
import { groupService } from "../services/group.service.js";
class GroupController {
  getGroupList = async (req, res, next) => {
    const groups = await groupService.findGroups(req.query);
    res.status(200).json({ message: "Group list placeholder", data: groups });
  };
}
export const groupController = new GroupController();
