import schedule from 'node-schedule';
import User from '../models/user.model.js';
import FeedReport from '../models/feed.log.model.js';
// 유저별 job 저장 객체
const userFeedJobs = new Map();
const petFeedJobs = new Map();
// TODO : pet map

// HH:mm → cron 문자열 변환
function parseFeedTimeToCron(feedTime) {
  const [hour, minute] = feedTime.split(':');
  return `${minute} ${hour} * * *`; // 매일 특정 시각
}

// 유저 1명에 대한 스케줄 등록
export async function scheduleFeedForUser(user) {
  const cronTime = parseFeedTimeToCron(user.feed_time);

  // 기존 job 있으면 취소
  if (userFeedJobs.has(user.user_id)) {
    userFeedJobs.get(user.user_id).cancel();
  }

  // TODO : pet 별 로직 구현 
  const job = schedule.scheduleJob(cronTime, async () => {
    try {
      const feeds = await FeedReport.findAll({
        where: {
          user_id: user.user_id,
          food_close_yn: false,
        },
      });

      for (const feed of feeds) {
        // 남은 횟수 -1
        feed.food_remain_days--;
        // 남은 양 차감 - 권장량 만큼 -> food_log
        feed.food_remain_amount -= feed.food_required_amount;
        

        // 경고 알림
        if (remainCount <= 3 && remainCount > 1) {
          // TODO : server arlarm 기능 구현 필요 ( 3 )
        }

        // 마감 처리
        if (remainCount <= 1) {
          feed.food_close_yn = true;
          // server alarm 기능 구현 필요 ( 3 )
          // await Notification.create({
          //   user_id: user.user_id,
          //   type: 'FEED_EXPIRED',
          //   message: `${feed.name} 사료가 마감되었습니다.`,
          // });
        }

        await feed.save();
      }

      console.log(`[${user.name}] 사료 자동 차감 완료`);
    } catch (err) {
      console.error(`[${user.name}] 사료 자동 차감 실패:`, err);
    }
  });

  userFeedJobs.set(user.user_id, job);
}

// 서버 시작 시 전체 유저 스케줄 등록
export async function scheduleAllUsers() {
  const users = await User.findAll();
  for (const user of users) {
    if (user.feed_time) {
      await scheduleFeedForUser(user);
    }
  }
}

