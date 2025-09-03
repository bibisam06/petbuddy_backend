// scheduler/savePetDataScheduler.js
import schedule from "node-schedule";
import { getAllUsers } from "../services/user.service.js";
import { getLinkedPets } from "../services/pet.service.js";
import { savePetDailyData } from "../services/activity.service.js";

// 매일 자정 실행 (0시 0분 0초)
export const startPetDataScheduler = () => {
  schedule.scheduleJob("0 0 0 * * *", async () => {
    console.log("⏰ 자정 배치 시작!");

    try {
    const users = await getAllUsers();

    for (const user of users) {
        const pets = await getLinkedPets(user.id); 
        for (const pet of pets) {
        try {
            await savePetDailyData(user, pet);
            console.log(`✅ ${user.user_id} - ${pet.pet_id} 데이터 저장 완료`);
        } catch (err) {
            console.error(`❌ ${user.id} - ${pet.id} 저장 실패`, err);
        }
        }
    }

    console.log("🎉 자정 배치 완료!");
    return 0;
    } catch (error) {
    console.error("🚨 자정 배치 전체 실패:", error);
    }
});
};


// 배치 함수
const runPetDataBatch = async () => {
  console.log("⏰ 배치 시작!");

  try {
    //TODO : 비효율적이라 느껴지는듯 
    const users = await getAllUsers();

    //console.log("users are : ", users);

    for (const user of users) {
      const pets = await getLinkedPets(user.id);
      for (const pet of pets) {
        try {
          await savePetDailyData(user, pet);
          console.log(`✅ ${user.user_id} - ${pet.pet_id} 데이터 저장 완료`);
        } catch (err) {
          console.error(`❌ ${user.user_id} - ${pet.pet_id} 저장 실패`, err);
        }
      }
    }

    console.log("🎉 배치 완료!");
  } catch (error) {
    console.error("🚨 배치 전체 실패:", error);
  }
};

// 스케줄러 등록 및 즉시 실행
export const startPetDataScheduler1 = () => {

  runPetDataBatch();

  return "스케줄러 등록 + 즉시 실행 완료";
};