// prisma/seed.js (최종 수정본)

const { PrismaClient, ExerciseType, BadgeType } = require("@prisma/client");
const prisma = new PrismaClient();
const DUMMY_PASSWORD = "DUMMY_PASSWOR";
const DUMMY_GROUP_PASSWORD = "groupsecret";

async function main() {
  console.log("--- Database Seeding Started ---");

  // 1. 기존 데이터 정리
  await prisma.badge.deleteMany();
  await prisma.record.deleteMany();
  await prisma.user.deleteMany();
  await prisma.group.deleteMany();
  console.log("Cleaned up existing data.");

  // ----------------------------------------------------
  // 2. 그룹 Owner 유저와 그룹을 동시에 생성 (Nested Write)
  // ----------------------------------------------------

  // 💡 Owner 유저를 먼저 생성하여 ID를 확보합니다.
  const tempAdminUser = await prisma.user.create({
    data: {
      nickname: "GroupOwnerNick",
      password: DUMMY_PASSWORD,
      groupId: "dummy-for-temp",
    },
  });

  // 💡 그룹 생성 시 Owner ID를 지정하고, Owner의 groupId도 바로 업데이트합니다.
  const sevenGroup = await prisma.group.create({
    data: {
      groupName: "SEVEN 챌린지 1기",
      description: "매일 운동 기록을 인증하는 커뮤니티입니다!",
      ownerNickname: tempAdminUser.nickname,
      ownerId: tempAdminUser.id, // Owner ID 설정
      password: DUMMY_GROUP_PASSWORD,
      tags: ["running", "cycling", "beginners"],
      goalCount: 7,
      recommendCount: 150,

      // Group Owner의 groupId를 바로 업데이트합니다.
      users: { connect: { id: tempAdminUser.id } },
    },
  });

  // 💡 Owner 유저의 groupId를 방금 생성된 그룹 ID로 최종 업데이트
  const adminUser = await prisma.user.update({
    where: { id: tempAdminUser.id },
    data: { groupId: sevenGroup.id },
  });

  // ... (나머지 JohnDoe, JaneSmith 생성 및 Record 생성 로직은 동일) ...

  // ----------------------------------------------------
  // 3. 샘플 참여자 생성 (Record는 별도로 생성하여 중첩 오류 방지)
  // ----------------------------------------------------

  const johnDoe = await prisma.user.create({
    data: {
      nickname: "JohnDoe",
      password: DUMMY_PASSWORD,
      groupId: sevenGroup.id,
    },
  });

  const janeSmith = await prisma.user.create({
    data: {
      nickname: "JaneSmith",
      password: DUMMY_PASSWORD,
      groupId: sevenGroup.id,
    },
  });

  // ----------------------------------------------------
  // 4. Record 데이터 삽입 (UserId 필드 명시)
  // ----------------------------------------------------

  await prisma.record.createMany({
    data: [
      // JohnDoe 기록 3개
      {
        exerciseType: ExerciseType.run,
        timeInSeconds: 3600,
        distanceInMeters: 10000,
        groupId: sevenGroup.id,
        userId: johnDoe.id,
      },
      // JaneSmith 기록 2개
      {
        exerciseType: ExerciseType.swim,
        timeInSeconds: 2400,
        distanceInMeters: 2000,
        groupId: sevenGroup.id,
        userId: janeSmith.id,
      },
    ],
  });

  // ... (나머지 더미 유저 및 배지 추가 로직 생략) ...

  console.log("--- Database Seeding Finished Successfully ---");
}

// ... (main 함수 실행 및 에러 처리 블록 생략) ...
