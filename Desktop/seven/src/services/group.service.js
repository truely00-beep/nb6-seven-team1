// src/services/group.service.js

// NOTE: 이 파일은 그룹 컨트롤러가 의존하므로 빈 껍데기라도 필요합니다.
class GroupService {
  // 그룹 목록 조회를 위한 플레이스홀더
  async findGroups({ limit, offset, sortBy, search }) {
    // 실제 ORM 로직 복구 필요
    return [];
  }
}
export const groupService = new GroupService();
