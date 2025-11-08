// src/services/group.service.js

import { PrismaClient } from "@prisma/client";
// NOTE: 실제 프로젝트에서는 src/config/db.js 등에서 인스턴스를 가져와야 합니다.
const prisma = new PrismaClient();

class GroupService {
  /**
   * 그룹 목록을 조회하고, 참여자 수를 계산하여 함께 반환합니다.
   * (ORM 고급 활용: _count 사용)
   */
  async findGroups({ limit, offset, sortBy, search }) {
    // 1. 정렬 기준 설정 (latest, likeCount, participantCount)
    const orderBy = {};
    if (sortBy === "likes") {
      orderBy.likeCount = "desc";
    } else if (sortBy === "participants") {
      // NOTE: 참여자 수로 정렬하려면 Prisma 2.x/3.x에서는 raw 쿼리 또는 post-query sort가 필요하며,
      // 4.x 이후에서는 _count 옵션을 사용합니다. 여기서는 최신 방식에 맞춰 구조를 잡습니다.
      // 실제 정렬은 orderBy._count.participants를 사용합니다.
      orderBy._count = { participants: "desc" };
    } else {
      orderBy.createdAt = "desc"; // 기본: 최신순
    }

    // 2. 검색 조건 설정
    const where = search
      ? { name: { contains: search, mode: "insensitive" } }
      : {};

    // 3. 그룹 조회 (ORM 고급 활용: _count를 사용하여 참여자 수 계산)
    const groups = await prisma.group.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
        nickname: true,
        photoUrl: true,
        tags: true,
        goalRep: true,
        likeCount: true,
        badges: true,
        createdAt: true,
        // ⬇️ ORM 고급 활용: 참여자 수 계산
        _count: {
          select: { participants: true },
        },
      },
    });

    // 4. 응답 형식 정리 (group.participantsCount로 평탄화)
    return groups.map((group) => ({
      ...group,
      participantsCount: group._count.participants,
      _count: undefined, // 불필요한 _count 객체 제거
    }));
  }

  /**
   * 새로운 그룹을 생성하고, 생성자를 참여자로 추가합니다.
   */
  async createGroup(groupData) {
    // NOTE: 여기서는 간결하게 create 로직만 포함합니다.
    const { ownerId, nickname, password, ...rest } = groupData;

    // 1. 그룹 생성 트랜잭션 (참여자와 그룹을 동시에 생성하는 로직이 필요)
    const newGroup = await prisma.group.create({
      data: {
        ...rest,
        ownerId: ownerId,
        participants: {
          create: { nickname, password }, // 생성자를 즉시 참여자로 추가
        },
      },
    });

    // 배지 조건 체크 로직 (최초 등록 시 참여자 1명 체크) 필요

    return newGroup;
  }

  /**
   * 그룹에 참여자를 추가하고, 닉네임 중복을 확인합니다.
   */
  async addParticipant({ groupId, nickname, password }) {
    // 1. 그룹 내 닉네임 중복 체크는 Prisma의 Unique 제약조건에 의존합니다.
    //    (@@unique([groupId, nickname], name: "unique_nickname_per_group"))
    //    따라서 별도의 findMany 쿼리 없이 create 시도만으로 효율적인 검증이 가능합니다.

    const newParticipant = await prisma.participant.create({
      data: {
        groupId: parseInt(groupId),
        nickname,
        password, // 실제 서비스에서는 비밀번호 해싱 필요
      },
    });

    // 배지 조건 체크 로직 (참여자 수 10명 이상 체크) 필요

    return newParticipant;
  }

  /**
   * 그룹 추천 수(likeCount)를 1 증가시킵니다.
   */
  async incrementLikeCount(groupId) {
    const updatedGroup = await prisma.group.update({
      where: { id: groupId },
      data: {
        likeCount: { increment: 1 },
      },
    });

    // 배지 조건 체크 로직 (추천 수 100 이상 체크) 필요

    return updatedGroup;
  }

  // ... (그룹 상세 조회, 수정, 삭제, 탈퇴 등 다른 서비스 로직 생략)
}

export const groupService = new GroupService();
