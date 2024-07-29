const sign_in = require('./src/signIn');
const draw = require('./src/draw');
const dipLucky = require('./src/dipLucky');
const sendMail = require('./src/sendMail');
const sendDingTalk = require('./src/sendDingTalk');
const sendWxWork = require('./src/sendWxWork')
const getPoint = require('./src/getPoint');

(async () => {
  // 上次分数
  const yesterday_score = await getPoint();

  console.log(`昨日矿石：${yesterday_score}`);

  let sign_res = '';

  try {
    sign_res = await sign_in();
  } catch (error) {
    sign_res = error;
  }

  console.log(sign_res);

  let draw_res = '';
  try {
    draw_res = await draw();
  } catch (error) {
    draw_res = error;
  }

  console.log(draw_res);



  // 当前分数
  const now_score = await getPoint();

  console.log(`当前矿石：${now_score}`);

  try {
    const html = `
      <h1 style="text-align: center">自动签到通知</h1>
      <p style="text-indent: 2em">当前矿石：${now_score}</p>
      <p style="text-indent: 2em">较昨日增长：${now_score - yesterday_score}</p>
      <p style="text-indent: 2em">签到结果：${sign_res}</p>
      <p style="text-indent: 2em">抽奖结果：${draw_res}</p>
    `;

    // console.log(html);

    await sendMail({ from: '掘金', subject: '定时任务', html });

    console.log('邮件发送完成');
  } catch (error) {
    console.error(error);
  }

  try {
    const msg = `自动签到通知:
      当前矿石：${now_score}
      较昨日增长：${now_score - yesterday_score}
      签到结果：${sign_res}
      抽奖结果：${draw_res}
    `;

    await sendDingTalk(msg);

    console.log('钉钉机器人通知完成');
  } catch (error) {
    console.error(error);
  }
})();
