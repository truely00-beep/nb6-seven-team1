// src/services/group.service.js

import { PrismaClient } from "@prisma/client";
// PrismaClient 인스턴스를 생성하여 DB 접근 준비
const prisma = new PrismaClient();

// NOTE: Global Error Handler가 처리할 수 있도록 CustomError 클래스를 정의합니다.
class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class GroupService {
  /**
   * 그룹 목록을 조회하고, 참여자 수를 계산하여 함께 반환합니다.
   * (ORM 고급 활용: _count 사용)
   */
  async findGroups({ limit = 10, offset = 0, sortBy = "latest", search = "" }) {
    // 1. 정렬 기준 설정
    const orderBy = {};
    if (sortBy === "likes") {
      orderBy.likeCount = "desc";
    } else if (sortBy === "participants") {
      // 참여자 수로 정렬 (Prisma _count)
      orderBy._count = { participants: "desc" };
    } else {
      orderBy.createdAt = "desc"; // 기본: 최신순
    }

    // 2. 검색 조건 설정
    const where = search
      ? { name: { contains: search, mode: "insensitive" } } // 그룹명 검색
      : {};

    // 3. 그룹 조회 (ORM 고급 활용: _count를 사용하여 참여자 수 계산)
    const groups = await prisma.group.findMany({
      where,
      orderBy,
      take: parseInt(limit),
      skip: parseInt(offset),
      select: {
        id: true,
        name: true,
        nickname: true, // 그룹 닉네임
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

    // 4. 응답 형식 정리 (participantsCount로 평탄화)
    return groups.map((group) => ({
      ...group,
      participantsCount: group._count.participants, // 계산된 참여자 수 반환
      _count: undefined, // 불필요한 _count 객체 제거
    }));
  }

  /**
   * 새로운 그룹을 생성하고, 그룹 소유자를 참여자로 추가합니다.
   * (트랜잭션 로직은 복잡하여 현재 생략하고 구조만 유지)
   */
  async createGroup(groupData) {
    const newGroup = await prisma.group.create({
      data: { ...groupData },
    });
    // NOTE: 실제로는 소유자 참여자 생성 및 ownerId 업데이트 로직이 필요함.
    return newGroup;
  }

  /**
   * 그룹에 참여자를 추가하고, 닉네임 중복을 확인합니다.
   * (Prisma의 @@unique 제약조건에 의존함)
   */
  async addParticipant({ groupId, nickname, password }) {
    const newParticipant = await prisma.participant
      .create({
        data: {
          groupId: parseInt(groupId),
          nickname,
          password,
        },
      })
      .catch((error) => {
        // Prisma P2002 (Unique Constraint Violation) 에러 처리
        if (
          error.code === "P2002" &&
          error.meta.target.includes("unique_nickname_per_group")
        ) {
          // 409 Conflict 에러로 변환하여 Controller로 던집니다.
          throw new CustomError(
            "해당 닉네임은 그룹 내에서 이미 사용 중입니다.",
            409
          );
        }
        throw error;
      });

    // NOTE: 배지 조건 체크 로직 (참여자 수 10명 이상 체크) 필요

    return newParticipant;
  }

  /**
   * 그룹 추천 수(likeCount)를 1 증가시킵니다.
   */
  async incrementLikeCount(groupId) {
    const updatedGroup = await prisma.group.update({
      where: { id: parseInt(groupId) },
      data: {
        likeCount: { increment: 1 },
      },
    });

    // NOTE: 배지 조건 체크 로직 (추천 수 100 이상 체크) 필요

    return updatedGroup;
  }

  // ... (그룹 상세 조회, 수정, 삭제, 탈퇴 등 다른 서비스 로직 생략)
}

export const groupService = new GroupService();
