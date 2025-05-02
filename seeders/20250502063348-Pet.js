'use strict';

import PetMajorCategory from '../src/models/pet.division1.model';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add seed commands here.
   *
   * Example:
   * await queryInterface.bulkInsert('People', [{
   *   name: 'John Doe',
   *   isBetaMember: false
   * }], {});
   * 
  */
  await PetMajorCategory.bulk([
    { pet_division_1_code: 'A001', pet_division_1_name: '강아지' , pet_division_1_remark: "강아지 입니다."},
    { pet_division_1_code: 'A002', pet_division_1_name: '고양이' , pet_division_1_remark: "고양이 입니다."}
  ]);
  
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add commands to revert seed here.
   *
   * Example:
   * await queryInterface.bulkDelete('People', null, {});
   */
  return queryInterface.bulkDelete('PetMajorCategory', null, {});
}
