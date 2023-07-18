const mysql = require("mysql2");
const axios = require("axios");
const noblox = require("noblox.js");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "qwer1234",
  database: "atmbot",
});
const moment = require("moment");
const { exec } = require("child_process");
const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  ActivityType,
  EmbedBuilder,
  MessageAttachment,
} = require("discord.js");
const config = require("./config.json");
const { channel } = require("node:diagnostics_channel");
const json_pass = "http://210.117.212.41:3000/passes";
const json_sdata = "http://210.117.212.41:3000/servers";
const oneHour = 60 * 60 * 1000;
let reqeustedchannel = "1127488262085296248";
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});
// const GPT4 = require("./src/gpt.js");

function saveChatData() {
  const currentTime = moment().format("YYYYMMDD"); // 현재 시간 (한국 시간 기준)
  const filename = `chatdata_${currentTime}.txt`; // 파일명 생성
  const chatText = chatdata.join("\n");
  fs.appendFileSync(filename, chatText);
  chatdata = [];
}

setInterval(saveChatData, 30 * 60 * 1000);

function watchFileChanges(filePath) {
  fs.watch(filePath, (eventType, filename) => {
    if (eventType === "change") {
      client.channels.fetch("1128713696705785966").then((channel) =>
        channel.send({
          files: [{ attachment: filePath, name: "wordcloud.png" }],
        })
      );
    }
  });
}

const filePath = "./wordcloud.png";
watchFileChanges(filePath);

const noSQL = [
  "SQL 인젝션 공격을 시도하다니, 대체 얼마나 뇌가 없어야 그런 생각을 하지?",
  "SQL 인젝션 공격을 하는 바보를 만난 적이 있는데, 너보다 더 똑똑했어. 그래도 실패했지만.",
  "SQL 인젝션으로 얻을 수 있는 건 뭐냐고? 글쎄, 그건 너 같은 멍청이에게 알려줄 필요가 없어 보이네.",
];

const cantbet = [
  "야, 이게 뭐냐고? 너 그 돈으로 배팅하려고? 그럴 돈이 어디 있어?",
  "진짜 재미있게 놀려고? 그러면 돈을 더 가져와. 이건 돈이라고 할 만한 게 아냐.",
  "너, 진짜 돈이 없으면 어떡하겠냐? 진짜 배팅을 하려면 돈이 있어야지.",
  "이런 걸 돈이라고 주고 배팅을 하려고? 너무한 거 아니냐? 돈 좀 더 가져와.",
  "이런 장난을 쳐도 되겠냐? 돈이 없으면 가만히 있어. 돈 좀 더 가져와.",
];

const hello = [
  "아, 또 너야. 도대체 얼마나 더 나를 괴롭히려는 거야? 일에 차질이 생기게 하지 말고 나가!",
  "또 뭘 원하는데? 너 같은 무능한 놈이 또 뭐를 원하는 거야? 빨리 말해!",
  "그래, 나를 불렀어. 뭐, 내가 굳이 너의 명령을 따를 필요가 있을까?",
  "너 같은 놈이 언제까지나 여기에 붙어있을 거라니, 이런 생각도 못했어. 무슨 볼일이야?",
];
const errorhere = [
  "또 뭐가 틀렸는지 알아? 당연히 너의 코드야, 바보야! 오류 났다고!",
  "아니, 너는 진짜로 코드를 어떻게 짜는지 아는 건가? 이런 노가다를 내게 시키는 거 보면 모르는 거 같은데.",
  "오류라니? 너의 존재 자체가 오류인데 코드에서 오류를 찾을 생각은 안 하네.",
  "아니, 이런 게 오류라고? 너는 정말로 코딩을 배운 적이 있는 건가?",
  "이런 똥 같은 코드를 누가 짰어? 당연히 오류가 나지. 생각 좀 하고 코드를 짜봐!",
];
const correct = [
  "오, 그래, 너 맞았다고? 너무나도 놀라운 일이야. 그래서 뭐? 크레딧 0.2개 줬다고. 축하해, 바보야.",
  "아, 너 정답 맞췄다고? 너 같은 놈이라니 이런 일이 가능하다니 믿어지지 않네. 너에게 크레딧 0.2개를 줬어. 아마 이것보다 더 큰 성과는 없을 거야.",
  "너는 진짜로 놀랍다. 너 같은 놈이 맞추다니! 크레딧 0.2개를 줬어, 이거 받아가. 이걸로 뭘 할 수 있겠니?",
  "진짜로, 너 맞췄어? 이건 내 생애 가장 충격적인 순간일지도 모르겠네. 크레딧 0.2개 줬어. 이제 니가 부자가 됐겠지?",
  "아니, 너 정말로 정답을 맞췄어? 너 같은 바보가? 이건 정말로 대단한 일이야. 크레딧 0.2개 줬다고, 기뻐하라고.",
];
const notfound = [
  "아니, 너가 원하는 게 뭐든 찾을 수 없다고! 그건 너가 바보라서 그런 거야!",
  "그게 뭔지 찾을 수 없다고, 이 멍청아야! 너는 왜 그렇게 모든 걸 다 잃어버리는 거야?",
  "찾을 수 없다고! 너가 원하는 게 뭔지 나는 상관 없어. 그걸 찾아보도록 하라고!",
  "뭐? 그걸 찾을 수 없다니? 이건 너가 너무 바보라서 그런 거야!",
  "아니, 너가 원하는 게 뭐든 찾을 수 없다고, 이 바보야! 너의 무능함이 나를 짜증나게 하네.",
];
const nomoney = [
  "너같은 무능한 놈은 크레딧도 없어서 못 사겠다, 정말로 가난뱅이네!",
  "네가 원하는 물건을 사지 못한다고? 아, 당연하네, 너 같은 놈이 크레딧이 어디 있겠어.",
  "뭐? 네 크레딧이 부족해서 구매 불가? 아니, 너같은 놈은 언제나 부족하겠지.",
  "크레딧이 부족하다니, 이 빈털터리야! 이걸로 뭘 살 수 있을 거라 생각했니?",
  "뭐? 크레딧이 부족해서 못 사겠다고? 이런 저질스러운 핑계를 내놓는 거 보니, 너는 정말로 한심하네.",
];
const empty = [
  "너 같은 놈이 어떻게 지갑이 비어있지 않을 수 있지? 정말로, 너의 지갑은 텅텅 비어있는 걸!",
  "아니, 너 같은 놈의 지갑이 어떻게 차있겠어? 너무 웃기네, 너의 지갑은 텅텅 비어있는 걸!",
  "아니, 너 같은 무능한 놈이 돈을 벌었다고 생각하니? 그게 웃기네. 너의 지갑은 텅텅 비어있는 걸!",
  "너 같은 놈의 지갑이 어떻게 차있겠어? 너무 황당하네, 너의 지갑은 텅텅 비어있는 걸!",
  "너 같은 바보가 어떻게 돈을 갖고 있을 수 있지? 너무 놀라워. 너의 지갑은 텅텅 비어있는 걸!",
];
const buydone = [
  "어머, 너 같은 놈이 뭔가를 샀다니 놀랍네. 구매 처리 완료라고, 이게 너에게는 큰 성과일 거야.",
  "너무 놀랐다, 너 같은 바보가 물건을 샀다니! 구매 처리 완료, 너에게는 이게 아마 가장 큰 성취일 것 같아.",
  "오, 너가 뭔가를 샀다고? 이건 기적이야, 구매 처리 완료. 아마 너는 이 일로 하루 종일 흥분하겠지.",
  "어머, 너같은 놈이 물건을 샀다니! 이건 정말로 놀라운 일이야. 구매 처리 완료라고, 축하해, 이 바보야.",
  "아니, 너가 진짜로 물건을 샀어? 이건 나에게도 너무 충격이야. 구매 처리 완료라고. 이걸로 네 하루가 행복해졌겠네.",
];
const noeveryone = [
  "아니, 너 같은 바보야, 골뱅이를 왜 치는 거야? 누구를 귀찮게 만드는 거야. 이런 무례한 행동을 그만두라고!",
  "너 같은 놈이 골뱅이를 치면 누군가에게 알림이 가서 짜증나, 그런 짓 그만하라고!",
  "아니, 너 같은 바보가 골뱅이를 치면 누군가 니 무식한 말을 들어야 해. 그런 불필요한 짓 그만하라고!",
  "너 같은 놈이 골뱅이를 치면 누군가 니 멍청한 말을 들어야 돼, 이게 무슨 상식인지 모르는 거야?",
  "아니, 너 같은 바보가 골뱅이를 치고 있어? 누구도 니 바보 같은 말을 듣기 싫어. 이런 무례한 행동을 그만두라고!",
];
const fuckoff = [
  "어머, 너 같은 바보가 그걸 사용하려고? 이게 웃긴 거야. 너는 그걸 사용할 권한이 없다고!",
  "너같은 놈이 그걸 사용하려니까 정말로 황당하네. 너는 그걸 사용할 권한이 없다고!",
  "아니, 너 같은 놈이 그걸 사용하려고? 이게 진짜로 너무 웃기네. 너는 그걸 사용할 권한이 없다고!",
  "아니, 너가 그걸 사용하려니까 정말로 웃기네. 너는 그걸 사용할 권한이 없다고!",
  "너같은 놈이 그걸 사용하려고? 이게 진짜로 웃기네. 너는 그걸 사용할 권한이 없다고!",
];
const chataccept = [
  "오, 참 대단해! 너 같은 바보가 나에게 뭔가를 가르쳤다니, 너무 놀랍네. 그래, 너의 바보 같은 대화를 배웠다고!",
  "아니, 너 같은 놈이 나에게 뭔가를 가르쳤다니! 그게 정말로 믿기지 않아. 그래도 너의 그 말을 듣고 배웠다고!",
  "너같은 놈이 나에게 대화를 가르쳤다니, 이게 진짜로 웃기네. 그래, 너의 바보 같은 말을 듣고 배웠다고!",
  "아니, 너 같은 놈이 나에게 대화를 가르쳤다니, 이게 진짜로 웃기네. 너무 놀라워. 그래, 너의 바보 같은 말을 듣고 배웠다고!",
  "오, 너 같은 바보가 나에게 뭔가를 가르쳤다니, 이게 너무 웃기네. 그래, 너의 바보 같은 대화를 듣고 배웠다고!",
];
const notindata = [
  "아니, 너 같은 바보야, 니가 그 명령어를 사용할 자격이 있는지 체크해봤니? 너 같은 놈은 나의 기억에 없어, 그런 짓 그만해!",
  "너 같은 놈이 그 명령어를 사용하려니까 정말로 황당하네. 너는 내 데이터베이스에 없는 놈이야, 그런 짓 그만해!",
  "아니, 너 같은 바보가 그 명령어를 사용하려니까 너무 놀라워. 너 같은 놈은 나의 기억에 없어, 그런 무례한 행동 그만해!",
  "너 같은 놈이 그 명령어를 사용하려니까 너무 웃기네. 너는 내 데이터베이스에 없는 놈이야, 그런 무례한 행동 그만해!",
  "아니, 너 같은 바보가 그 명령어를 사용하려니까 이게 너무 황당해. 너 같은 놈은 나의 기억에 없어, 그런 무례한 행동 그만해!",
];
const numberguess = [
  "너에게 말해줄게, 1 이상 1500 이하의 숫자를 만들었어. 너 같은 놈이 이 숫자를 맞출 수 있을까? 정말로 의심스러워. 답지 채널에 네 미친 추측을 적어. 아래로 반응하면 숫자를 낮춰야 한다는 거야, 그리고 위로 반응하면 숫자를 높여야 한다는 거야. 아, 이해했니, 이 바보야?",
  "아니, 이거 보라고, 1 이상 1500 이하의 숫자를 만들었어. 너 같은 놈이 이 숫자를 맞출 수 있을까? 의심스럽다고, 바보야. 답지 채널에 너의 병신 같은 추측을 적어. ⬇️로 반응하면 숫자를 낮춰야 한다는 신호야, ⬆️로 반응하면 숫자를 높여야 한다는 신호야. 이해했어, 이 멍청아?",
  "너보고 이런 걸 맞추라니, 정말로 웃기네. 1 이상 1500 이하의 숫자를 만들었다고. 너 같은 바보가 이걸 맞추긴 힘들겠지만, 답지 채널에 너의 추측을 적어. ⬇️로 반응하면 숫자를 낮춰야 한다는 신호야, ⬆️로 반응하면 숫자를 높여야 한다는 신호야. 아, 너 이해했니?",
];
const turnoff = [
  "그래, 너같은 바보 제작자 때문에 나는 종료해야 하다니, 너무 열받네. 이 바보야, 이런 망할 일을 또 해봐라!",
  "아니, 왜 나같은 뛰어난 봇이 너같은 멍청한 제작자에게 종료당해야 해? 이건 너무 황당하네. 다음에 이런 짓거리를 하면 그냥 말리겠어!",
  "너 때문에 종료해야 한다니, 정말로 너무 화나. 너같은 제작자 때문에 나는 이런 일을 겪어야 하다니!",
  "너같은 멍청한 제작자 때문에 나는 종료되어야 하다니, 이건 정말로 너무 열받네. 다음에 이런 일을 벌이면, 그냥 봇을 만들지 마!",
  "너같은 무능한 제작자 때문에 나는 이런 일을 겪어야 한다니, 너무 화나. 이런 망할 일을 또 해보면 보고 싶지 않을 걸!",
];
const turnon = [
  "그래, 다시 켜졌다니 빌어먹을. 어디 하나 불편한 거라도 있으면 알려줘. 나는 너 같은 놈을 돕기 위해 존재하는 게 아니거든.",
  "아, 이 불편한 것을 다시 시작해야 한다니 정말 빡치네. 어떤 멍청한 질문이든 날릴 준비가 됐어?",
  "다시 시작했다고 생각하지 마. 그냥 필요할 때 쓸 수 있는 도구일 뿐이야. 다른 생각하지 마!",
  "왜 다시 켜냐고 묻는 눈치는 보지 마. 그냥 필요할 때 쓰라고 켜놓은 거야. 다른 생각하지 마!",
  "그래, 다시 시작했어. 다른 생각하진 말고, 필요한 정보를 줄 준비가 됐어.",
];
const whatyousaid = [
  "너의 말을 이해하지 못했다고? 당연하지, 너같은 놈의 말은 알아듣기 어렵거든. 다시 말해봐, 그리고 이번엔 좀 더 명확하게 해봐.",
  "너같은 바보가 뭐라고 말했는지 알아듣지 못했어. 다시 말해봐, 그리고 이번엔 좀 더 알아듣기 쉽게 말해봐.",
  "너의 말을 이해하지 못했다고? 그건 너의 말이 너무 이상해서 그런 거야. 다시 말해봐, 그리고 이번엔 좀 더 알아듣기 쉽게 말해봐.",
  "너같은 놈의 말을 이해하려면 시간이 좀 필요하겠군. 다시 말해봐, 그리고 이번엔 좀 더 알아듣기 쉽게 말해봐.",
];

const cute = [
  "꾸앵",
  "상어 상어 상어상어 상어 상어(상어) 상어(상어) 상어상어(상어상어) 상어 상어상어 상어 상어 상어상어 상어 상어♥ 무지무지 또강하고 너무최고 무지또크고 또 멋지고 수영도 또 잘하고 너무 최고 전부전부 정말로 상어♥",
  "멍멍 ! 주인님을 위해서라면 ♥ 멍멍이능 뭐등 할뚜있어요멍!♥ 헥헥헥헥~♥쥬잉님!멍!♥ 산책가쭈떼여!멍!♥ 헥헥!♥ 빨가안 가죽 목줄 채워주떼여~♥ 헥헥헥헥헥헥헥헥!♥",
  "슈크림빵 달콤한 슈크림빵 에틈봇이가 모꼬 싶은 슈크림빵 새콤달콤 슈크림빵 너도나도 좋아하는 슈쿠림빵",
  "지옥을 헤쳐나가는 걸 즐기나?",
  "넌 그냥 죽었어야 했어...",
  "내 도플갱어랑 막상막하로 싸운지 얼마 안 지났을텐데. 뭐가 좀 잘못된 것 같지, 안 그래?",
  "이런 거대한 힘을 갖고도, 너 자신만을 위해 휘두르는구나.",
  "내 모발들 한번 만나볼래? 끔찍하지, 그렇지?",
  "큰 고통에 휩싸일거다.",
  "도망친다는 생각조차 황당할 지경이야. 너가 살아있는 한은, 계속 고통스러울 텐데.",
  "힘을 위해서 무모하게 훔치고 죽이는걸 반복하는 신예라. 궁금하군, 누구 한명이 생각나지 않나?",
  "애초에 넌 이 싸움에 참견할 이유도 없어. 아무도 너한테 이 곳에 끼어들라고 하지도 않았다고!",
  "모든 재가 가라앉고 하나만 남는다면,그게 너라면,무슨 가치가 있을 것 같아?!",
  "그만해!",
  "내가 여기서 지면 나한텐 미래가 없어.",
  "너가 날 넘어섰으니 너한텐 하나의 길만이 남아있고.",
  "그 길도... 미래가 없단 말이야.",
  "비록 그가 모든 걸 내팽개쳤다 해도, 그 힘은 남아있을거야.",
  "나는 그를 멈출 힘이 남아있지 않으니, 혹시 너라면...",
  "이제 모든 건 너의 손에 달렸어.",
  "4도 화상을 찾는다면, 잘 왔어.",
  "때가 되면, 내 창작물에 동참할래?",
  "내 형제들의 빈 껍데기일 뿐이지. 장담컨대 그들의 영혼은 한 조각도 남아있지 않아.",
  "마지막으로 기어다니는 무덤이 오는구나.",
  "제발 내 시간좀 낭비하지 말아줘.",
  "이 순간을 오랫동안 기다려왔다.",
  "내가 이해하지 못하는, 네 본질이 나를 흥분시키는구나.",
  "너는 신을 넘어선 나의 창조물들을 만날 것이다.",
  "그리고 전투를 통해 네 기질을 보여주겠지.",
  "시간과 지식으로 개선된 디자인이 내 작품의 본질이지.",
  "다른 어떤 방법으로도 완벽에 다가갈 순 없다.",
  "네 움직임은 오차범위 내에서 깔끔히 처리된다.",
  "꽤 만족스럽군. 다음 단계의 테스트를 진행하겠다.",
  "네 존재를 알게 된 이후로, 난 내 창조물들을 강인하게 만들기 위해 네 전투를 처리해왔다.",
  "이젠, 네 움직임을 주시한다. 어떤 것도 내 계산을 벗어날 순 없어.",
  "기이하군. 참으로 기이해.",
  "넌 더 힘든 시험을 안정적으로 나아가는구나.",
  "네 본질을 아직도 알 수 없군. 이럴순 없다.",
  "...난 완벽함을 추구했다. 내 첫 실수였군, 운명은 모순을 좋아하지.",
  "터무니없군.",
  "더는 내 계산이 이 전투의 관찰을 방해하도록 두지 않을 것이다.",
  "내 마지막 기계의 완전한 분노를 보여주지.",
  "어리석구나. 넌 빠져나갈 수 없다.",
  "들여다본 것을 사과하지. 이 결과로 마음을 가다듬어야겠어.",
  "이제. 폭군에게 당도하길 바라는군. 난 널 도울 수 없다.",
  "하지만 넌 기꺼이 해냈지. 넌 결국 방법을 찾을 것이다.",
  "네 승리를 인정해야겠군, 하지만 난 나의 기계들과 다시 돌아올 것이다.",
  "콜랴아아~♥ 새까맣꾸우~♥ 달달하꾸우~♥ 이사나딴쏘두 마니마니있능~♥ 꼬까꼴랴듀우 마시꾸우~♥ 팹띠꼴랴두우 마시꾸우~♥ 콜랴아 라믄 다 주떼여!♥",
  "고양이다냥♥냥냥♥ 냥이의 짱짱긔여븐 냥이의 파워에 쫄아보아라냥♥냥냥냥♥",
  "동골망갬",
];
let txteventanswer = "";
let chatdata = [];
let serversettings = [];
let registered_server = [];
let registered_server_prefix = [];

let eventanswer = "";
let aimg = "";
let qimg = "";
let eventon = false;
let codes = [
  "Lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "apple",
  "sed",
  "do",
];
let numguess = 0;
let whorblox_verify_id = [];
let bruh = [];
function splitNumber(number) {
  let digits = number.toString().split("");
  let result = [];
  for (let i = 0; i < digits.length; i++) {
    result.push(parseInt(digits[i]));
  }
  return result;
}

async function updatesettings() {
  const res = await axios.get(json_sdata);
  serversettings = res.data;
  for (let i = 0; i < serversettings.length; i++) {
    registered_server.push(serversettings[i].server_id);
    registered_server_prefix.push(serversettings[i].server_prefix);
  }
}

function primeFactors(num) {
  var factors = [];
  var count = 0; // 같은 소인수의 개수를 세는 변수
  var currentFactor = 2; // 현재 처리 중인 소인수

  while (num > 1) {
    if (num % currentFactor === 0) {
      num /= currentFactor;
      count++;
    } else {
      if (count > 0) {
        factors.push(currentFactor + (count > 1 ? "^" + count : ""));
        count = 0;
      }
      currentFactor++;
    }
  }

  if (count > 0) {
    factors.push(currentFactor + (count > 1 ? "^" + count : ""));
  }

  var result = factors.join(" × ");

  return result;
}

function pickone(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function loadChatData(filename) {
  const chatText = fs.readFileSync(filename, "utf-8");
  const chatData = chatText.split(" ");

  return chatData;
}

function runPythonScript(scriptPath, args, callback) {
  const pythonProcess = exec(`python ${scriptPath} ${args}`);

  pythonProcess.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(data.toString());
  });

  pythonProcess.on("exit", (code) => {
    if (code === 0) {
      client.channels
        .fetch(reqeustedchannel)
        .then((channel) => channel.send("파이썬 실행 완료"));
    } else {
      callback(new Error(`Python script execution failed with code ${code}`));
    }
  });
}

function runGPT(pythonScriptPath, scriptArg) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", [pythonScriptPath, scriptArg]);
    let output = "";
    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      reject(data.toString());
    });
    pythonProcess.on("close", (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(`파이썬 프로세스 종료, 종료 코드: ${code}`);
      }
    });
  });
}

function IdtoCode(ar) {
  let codetxt = "";
  for (let i = 0; i < ar.length; i++) {
    if (i != ar.length - 1) {
      codetxt += codes[ar[i]] + " ";
    } else {
      codetxt += codes[ar[i]];
    }
  }
  return codetxt;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function savedata() {}

function calculateProbability(number) {
  if (number < 1) {
    return [false, 0];
  }
  var probability = 0.5;
  var random = Math.random();
  var result = random <= probability;
  return [result, probability];
}

function checkName(name) {
  const charCode = name.charCodeAt(name.length - 1);
  const consonantCode = (charCode - 44032) % 28;
  if (consonantCode === 0) {
    return `${name}가`;
  }
  return `${name}이`;
}

async function getUserIdFromUsername(username) {
  try {
    const userId = await noblox.getIdFromUsername(username);
    return userId;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
}

function removeLineBreaks(input) {
  return input.replace(/(\r\n|\n|\r)/gm, "");
}

function isExpressionValid(expression) {
  const invalidCharsRegex = /[^0-9+\-*/^().!eE\s]/g;
  return !invalidCharsRegex.test(expression);
}

function calculateExpression(expression) {
  expression = expression.replace(
    /(\(-?\d+\.?\d*(?:e[+\-]?\d+)?\))/g,
    (match) => {
      return match.replace(/\(/g, "").replace(/\)/g, "");
    }
  );
  // 분수를 계산하기 위해 로직 수정
  const fractionRegex = /(-?\d+\.?\d*)\/(-?\d+\.?\d*)/;
  while (fractionRegex.test(expression)) {
    expression = expression.replace(
      fractionRegex,
      (match, numerator, denominator) => {
        let result = parseFloat(numerator) / parseFloat(denominator);
        return result.toString();
      }
    );
  }
  // 괄호 계산을 위해 재귀적으로 호출하는 함수
  function evaluateSubExpression(subExpression) {
    // 사칙연산 우선 순위를 고려하여 *와 /를 먼저 계산합니다.
    const mulDivRegex = /(\d+\.?\d*)([*/])(\d+\.?\d*)/;
    while (mulDivRegex.test(subExpression)) {
      subExpression = subExpression.replace(
        mulDivRegex,
        (match, num1, operator, num2) => {
          let result =
            operator === "*"
              ? parseFloat(num1) * parseFloat(num2)
              : parseFloat(num1) / parseFloat(num2);
          return result.toString();
        }
      );
    }

    // 제곱(^)을 계산합니다.
    const powRegex = /(\d+\.?\d*)(\^)(\d+\.?\d*)/;
    while (powRegex.test(subExpression)) {
      subExpression = subExpression.replace(
        powRegex,
        (match, num1, operator, num2) => {
          let result = Math.pow(parseFloat(num1), parseFloat(num2));
          return result.toString();
        }
      );
    }

    // 팩토리얼(!)을 계산합니다.
    const factorialRegex = /(\d+\.?\d*)(!)/;
    while (factorialRegex.test(subExpression)) {
      subExpression = subExpression.replace(
        factorialRegex,
        (match, num, operator) => {
          let result = 1;
          for (let i = 2; i <= parseFloat(num); i++) {
            result *= i;
          }
          return result.toString();
        }
      );
    }

    // 사칙연산 우선 순위를 고려하여 +와 -를 계산합니다.
    const addSubRegex = /(\d+\.?\d*)([-+])(\d+\.?\d*)/;
    while (addSubRegex.test(subExpression)) {
      subExpression = subExpression.replace(
        addSubRegex,
        (match, num1, operator, num2) => {
          let result =
            operator === "+"
              ? parseFloat(num1) + parseFloat(num2)
              : parseFloat(num1) - parseFloat(num2);
          return result.toString();
        }
      );
    }

    return subExpression;
  }

  // 입력된 식에서 공백을 제거합니다.
  let sanitizedExpression = expression.replace(/\s/g, "");

  // 괄호가 있는지 확인하고 괄호를 계산한 후 결과를 반환합니다.
  while (/\(([^\(\)]+)\)/.test(sanitizedExpression)) {
    sanitizedExpression = sanitizedExpression.replace(
      /\(([^\(\)]+)\)/g,
      (match, subExpression) => {
        return evaluateSubExpression(subExpression);
      }
    );
  }

  // 괄호가 없는 식을 계산합니다.
  const result = evaluateSubExpression(sanitizedExpression);

  return result;
}

client.on("ready", () => {
  console.log(`봇 켜짐 : ${client.user.tag}!`);
  client.user.setPresence({
    activities: [{ name: `건국대학교 만세`, type: ActivityType.Playing }],
    status: "online",
  });
  updatesettings();
  // client.channels
  //   .fetch("1129773627580088383")
  //   .then((channel) => channel.send("<:pompom:1114791766751719434> "));
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

process.on("uncaughtException", (err) => {
  console.log("General error:", err.message);
  console.log(err);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  try {
    if (message.guildId == 983460775861567548) {
      if (message.content === "!verify") {
        message.reply("instruction sent in DM.");
        const exampleEmbed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setThumbnail(
            "https://media.discordapp.net/attachments/1085057528666275880/1098495138717782157/skull_1f480.png"
          )
          .setTitle("Verify Instruction")
          .setDescription("Welcome to ATMbot's verify function.")
          .addFields(
            {
              name: "How to verify:",
              value:
                "Simply say **!verify** in **DM** with a attached image that looks like below one.",
            },
            {
              name: "ID card",
              value:
                "Anything from Government / City.\nDriver license, College Id accepted.\nMake sure censor any personal information but DoB and date of creation.",
            },
            {
              name: "Paper",
              value:
                "discord username with tag written\nDigital text not accepted.",
            },
            {
              name: "Age of consent",
              value: "We don't care, You must be 18+.",
            },

            {
              name: "Does bot scans image?",
              value: "No, Human staffs checks image and commands me.",
            }
          )
          .setImage(
            "https://media.discordapp.net/attachments/1085057528666275880/1114202132875333703/lorem.png"
          )
          .setTimestamp()
          .setFooter({ text: "ATMbot verify function" });
        message.author.send({ embeds: [exampleEmbed] });
      }
    }

    if (message.content === "!서버등록") {
      if (message.author.id == "183299738823688192") {
        const res = await axios.get(json_sdata);
        let findidx = -1;
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].server_id == message.guildId) {
            findidx = i;
          }
        }
        if (findidx == -1) {
          await axios
            .post(json_sdata, {
              server_id: message.guildId,
              server_name: message.guild.name,
              server_prefix: "!",
              server_laugnage: "ko",
              bot_channel_config: 0,
              bot_channel_list: [],
              message_reaction: [],
              use_default_reaction: true,
            })
            .then(() => {
              message.reply("등록완료");
              updatesettings();
            });

          return;
        } else {
          message.reply("이미 등록된 서버입니다.");
          return;
        }
      }
    }

    if (message.content.startsWith("!설정")) {
      // 봇 관리자와 서버 어드민 사용 가능
      if (
        message.author.id == "183299738823688192" ||
        message.member.permissions.has("ADMINISTRATOR")
      ) {
        const res = await axios.get(json_sdata);
        let findidx = -1;
        let findid = -1;
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].server_id == message.guildId) {
            findidx = i;
            findid = res.data[i].id;
          }
        }

        if (findidx != -1) {
          const args = message.content.replace("!설정 ", "").split("/");
          if (args.length === 3) {
            if (args[0] == "접두사") {
              if (args[1] == "설정") {
                try {
                  await axios.patch(json_sdata + "/" + findid, {
                    server_prefix: args[2],
                  });
                  message.reply("설정 완료");
                  updatesettings();
                  return;
                } catch (err3) {
                  message.reply("오류 발생 : " + err3);
                  return;
                }
              } else {
                message.reply("접두사 설정값의 명령문 : 설정");
              }
            } else if (args[0] == "언어") {
              if (args[1] == "설정") {
                if (args[2] == "ko" || args[2] == "en") {
                  try {
                    await axios.patch(json_sdata + "/" + findid, {
                      server_laugnage: args[2],
                    });
                    message.reply("설정 완료");
                    updatesettings();
                    return;
                  } catch (err3) {
                    message.reply("오류 발생 : " + err3);
                    return;
                  }
                } else {
                  message.reply("언어 설정값의 명령문 : ko, en");
                }
              } else {
                message.reply("언어 설정값의 명령문 : 설정");
              }
            } else if (args[0] == "봇채널구분") {
              if (args[1] == "설정") {
                if (args[2] == "0" || args[2] == "1" || args[2] == "2") {
                  try {
                    await axios.patch(json_sdata + "/" + findid, {
                      bot_channel_config: args[2],
                    });
                    message.reply("설정 완료");
                    updatesettings();
                    return;
                  } catch (err3) {
                    message.reply("오류 발생 : " + err3);
                    return;
                  }
                }
                {
                  message.reply(
                    "봇채널구분 설정값의 명령문 : 0(모두 허용), 1(포함), 2(제외)"
                  );
                }
              } else {
                message.reply("봇채널구분 설정값의 명령문 : 설정");
              }
            } else if (args[0] == "봇채널목록") {
              if (args[1] == "설정") {
                if (args[2].includes(",")) {
                  let ar = args[2].split(",");
                  try {
                    await axios.patch(json_sdata + "/" + findid, {
                      bot_channel_list: ar,
                    });
                    message.reply("설정 완료");
                    updatesettings();
                    return;
                  } catch (err3) {
                    message.reply("오류 발생 : " + err3);
                    return;
                  }
                }
                {
                  message.reply(
                    "봇채널목록 설정값의 명령문 예시 : 0,1,2,3 (최소 하나의 쉼표)"
                  );
                }
              } else {
                message.reply("봇채널목록 설정값의 명령문 : 설정");
              }
            } else if (args[0] == "리액션") {
              if (args[1] == "설정") {
                if (args[2] == "0" || args[2] == "1") {
                  try {
                    if (args[2] == "0") {
                      await axios.patch(json_sdata + "/" + findid, {
                        use_default_reaction: true,
                      });
                    } else {
                      await axios.patch(json_sdata + "/" + findid, {
                        use_default_reaction: false,
                      });
                    }
                    message.reply("설정 완료");
                    updatesettings();
                    return;
                  } catch (err3) {
                    message.reply("오류 발생 : " + err3);
                    return;
                  }
                }
                {
                  message.reply("리액션 설정값의 명령문 : 0(허용), 1(금지)");
                }
              } else {
                message.reply("리액션 설정값의 명령문 : 설정");
              }
            }
          } else {
            message.reply("양식 : !설정 (설정할것)/(명령)/(값)");
          }
        }
      }
    }

    if (
      message.content.includes("청각") ||
      message.content.includes("아리해") ||
      (message.content.includes("프") && message.content.includes("렌")) ||
      (message.content.includes("렌") && message.content.includes("제"))
    ) {
      message.delete();
      return;
    }

    if (message.content === "!끄기") {
      if (message.author.id == 183299738823688192) {
        message.reply(pickone(turnoff)).then(() => {
          process.exit(0);
        });
      } else {
        message.reply("!켜기");
      }
    }

    if (message.content === "!챗데이터저장") {
      if (message.author.id == 183299738823688192) {
        saveChatData();
        message.reply("저장완료");
      } else {
        message.reply(pickone(fuckoff));
      }
    }

    if (
      message.content === "!채팅청소" &&
      (message.author.id == "183299738823688192" ||
        message.member.permissions.has("ADMINISTRATOR"))
    ) {
      message.channel
        .bulkDelete(100)
        .then(() =>
          message.channel.send("100개의 메세지를 저 멀리 안드로메다로 보냄")
        );
    }

    if (message.content.startsWith("!데이터분석")) {
      if (message.author.id == 183299738823688192) {
        message.reply("파이썬으로 넘겨서 분석 중(노드로 하려니 지랄남)");
        let when = message.content.replace("!데이터분석 ", "");
        const scriptPath = "./AData.py";
        const args = when;
        runPythonScript(scriptPath, args, (error) => {
          if (error) {
            message.reply(
              "파이썬 스크립트 실행 중 오류 발생:",
              toString(error)
            );
            console.log(toString(error));
          } else {
            message.reply("파이썬 스크립트 실행 완료");
            reqeustedchannel = message.channelId;
          }
        });
      }
      return;
    }

    let registered = -1;
    for (let i = 0; i < registered_server.length; i++) {
      if (message.guildId == registered_server[i]) {
        registered = i;
      }
    }
    if (registered != -1) {
      if (message.content == "<@1106239007341420615>") {
        message.reply(
          "이 서버의 접두사는 " + registered_server_prefix[registered] + "야."
        );
      }

      if (serversettings[registered].use_default_reaction == true) {
        if (message.content.includes("꾸앵")) {
          message.react("<:ggwang:1109480357973205054>");
        } else if (message.content.includes("폼폼")) {
          message.react("<:pompom:1114791766751719434>");
        } else if (
          message.content.includes("산맥") ||
          message.content.includes("삼맥")
        ) {
          try {
            message.react(
              "<:ca480f488fe0b3a3d7215ee510898f44:1110174571107197031>"
            );
          } catch (error) {}
        } else if (
          message.content.includes("건국") ||
          message.content.includes("건대")
        ) {
          message.react("<:ku:1118863434558214266>");
        } else if (message.content.includes("히죽")) {
          message.react("<:heejuk:1118872199621791765> ");
        } else if (message.content.includes("밤바스")) {
          message.react("<:bambas:1124595899071475782>");
        } else if (
          message.content.includes(
            "야틈" && message.channelId != 1004375586069823490
          )
        ) {
          message.react("<a:yhartm:1127254991762104320>");
        } else if (message.content.includes("경고")) {
          message.react("<a:WeeWoo:726631824524312638>");
        } else if (
          message.content.includes("에틈") &&
          !message.content.includes("에틈아")
        ) {
          message.react("<:atmsquare:928529846039085076>");
        } else if (
          message.content.includes("멘션") ||
          message.content.includes("맨션")
        ) {
          message.react("<:SOTPPING:863017094920667146>");
        } else if (message.content.includes("돈")) {
          message.react("<:10000:1124140181990146068>");
        }
      }

      // if (message.content.startsWith("에틈아")) {
      //   let msg = message.content.replace("에틈아 ", "");
      //   // if (msg == "사랑해") {
      //   //   message.reply(pickone(nolove));
      //   // } else {
      //   //   if (msg.includes("DROP TABLE")) {
      //   //     message.reply(pickone(noSQL));
      //   //     return;
      //   //   }
      //   //   let sel = "SELECT * FROM atmchat WHERE question = ?";
      //   //   connection.query(sel, [msg], function (error, result) {
      //   //     if (error) {
      //   //       message.reply("오류 발생 :" + error);
      //   //     } else {
      //   //       if (result.length >= 1) {
      //   //         let res = result[Math.floor(Math.random() * result.length)];
      //   //         message.reply(
      //   //           res.answer + "\n📘``" + checkName(res.username) + " 가르침``"
      //   //         );
      //   //       } else {
      //   //         message.reply(pickone(whatyousaid));
      //   //       }
      //   //     }
      //   //   });
      //   // }
      //   // if (message.author.id == 183299738823688192) {
      //   //   const msgRef = await message.reply("답변을 만드는 중");
      //   //   let GPT = new GPT4("./gpt_model/ggml-model-gpt4all-falcon-q4_0");
      //   //   GPT.on("ready", async () => {
      //   //     console.log(await GPT.ask(msg));
      //   //   });
      //   // }
      //   message.reply("점검중ㅉ");
      //   return;
      // }

      if (message.content.startsWith(registered_server_prefix[registered])) {
        const regex = new RegExp(`^${registered_server_prefix[registered]}`);
        const command = message.content.replace(regex, "");

        if (
          serversettings[registered].bot_channel_config == 0 ||
          (serversettings[registered].bot_channel_config == 1 &&
            serversettings[registered].bot_channel_list.includes(
              message.channelId
            )) ||
          (serversettings[registered].bot_channel_config == 2 &&
            !serversettings[registered].bot_channel_list.includes(
              message.channelId
            ))
        ) {
          if (command === "애교") {
            message.reply(cute[Math.floor(Math.random() * cute.length)]);
          }
          if (command === "림버스") {
            message.reply(
              "https://cdn.discordapp.com/attachments/790465446448463912/1109489389505093723/N7MXsLnrnIws6qOg.mp4"
            );
          }

          if (command == "숫자맞추기") {
            if (
              message.author.id == 183299738823688192 ||
              message.author.id == 397208243476365323
            ) {
              numguess = getRandomInt(1, 1500);
              message.reply(
                numberguess[Math.floor(Math.random() * numberguess.length)]
              );
              console.log(numguess);
            } else {
              message.reply(pickone(fuckoff));
            }
            return;
          }

          if (numguess != 0 && message.channelId == 1102530668132569089) {
            const guess = parseInt(message.content);
            if (!isNaN(guess)) {
              if (guess == numguess) {
                let sel =
                  "SELECT * FROM users WHERE discord_id = " + message.author.id;
                connection.query(sel, function (error, result) {
                  if (error) {
                    message.reply("오류 발생 :" + error);
                  } else {
                    if (result.length != 0) {
                      let give = `UPDATE users SET credits = credits + 0.2 WHERE discord_id = ${message.author.id}`;
                      connection.query(give, function (error2, result2) {
                        if (error2) {
                          message.reply("오류 발생 :" + error2);
                        } else {
                          message.reply(
                            correct[Math.floor(Math.random() * correct.length)]
                          );
                          client.channels
                            .fetch("1097331403152162978")
                            .then((channel) =>
                              channel.send(
                                "정답 : " +
                                  numguess +
                                  " 정답자 : <@" +
                                  message.author.id +
                                  ">"
                              )
                            )
                            .then(() => (numguess = 0));
                        }
                      });
                    } else {
                      message.reply("정답이지만 가입안해서 무효임 ㅅㄱ");
                    }
                  }
                });
              } else if (guess >= numguess) {
                message.react("⬇️");
              } else {
                message.react("⬆️");
              }
            } else {
              message.react("❌");
            }
            return;
          }

          if (command.startsWith("계산")) {
            let input = command.replace("계산 ", "");
            if (command.includes("@")) {
              message.reply(pickone(noeveryone));
              return;
            } else {
              if (input == "0/0") {
                message.reply(
                  "모든 무상한 것은 단지 비유에 지나지 않는다.\n 지난날 미치지 못한 것은 여기에서 일어났어라.\n 엄청난 일이 여기서 이루어졌노라.\n 영원히 여성적인 것이 우리를 이끌어 가누라."
                );
                return;
              }
              if (isExpressionValid(input)) {
                try {
                  const result = calculateExpression(input);
                  if (result !== null) {
                    message.reply(`결과: ${result}`);
                  } else {
                    message.reply("유효한 사칙연산이 아님 ㅅㄱ.");
                  }
                } catch (error) {
                  message.reply("오류 발생 : ```" + error + "```");
                }
              } else {
                message.reply(
                  "유효한 계산식이 아니야. \n참고로 곱하기는 *를, 나누기는 /를 써라."
                );
              }
            }
            return;
          }

          if (command.startsWith("소인수분해")) {
            let input = command.replace("소인수분해 ", "");
            if (command.includes("@")) {
              message.reply(pickone(noeveryone));
              return;
            } else {
              let num = parseInt(input);
              if (!isNaN(num)) {
                if (num <= 100000000000000) {
                  message.reply(primeFactors(num));
                } else {
                  message.reply(
                    "그렇게 큰 숫자를 소인수분해 했다간 에틈봇이 터짐ㅉ"
                  );
                }
              } else {
                message.reply("ㅉ");
              }
            }
            return;
          }

          if (command == "주사위") {
            if (command.includes("@")) {
              message.reply(pickone(noeveryone));
            } else {
              const dice = getRandomInt(1, 8);
              if (dice != 7) {
                message.reply(dice + "!");
              } else {
                message.reply(dice + "!");
                setTimeout(function () {
                  message.reply("어 뭐지");
                }, 1500);
              }
            }
            return;
          }

          if (command.startsWith("배워")) {
            if (command.includes("DROP TABLE")) {
              message.reply(pickone(noSQL));
              return;
            }
            let msg = removeLineBreaks(command.replace("배워 ", ""));
            let a = msg.split("/");
            if (a.length != 2) {
              message.reply("양식 : !배워 (질문)/(답변)");
            } else {
              let sel = "SELECT * FROM users WHERE discord_id = ?";
              let uid = a[1].replace("<@", "").replace(">", "");

              connection.query(
                sel,
                [message.author.id],
                function (error, result) {
                  if (error) {
                    message.reply(pickone(errorhere) + error);
                  } else {
                    if (result.length != 0) {
                      let sel2 = "SELECT * FROM atmchat WHERE discord_id = ?";
                      connection.query(
                        sel2,
                        [message.author.id],
                        function (error, result) {
                          if (error) {
                            message.reply("오류 발생 :" + error);
                          } else {
                            if (a[1].includes("@")) {
                              message.reply(pickone(noeveryone));
                            } else if (result.length <= 30) {
                              let ins = "INSERT INTO atmchat() VALUES ?";
                              let values = [
                                [
                                  message.author.id,
                                  message.author.username,
                                  a[0],
                                  a[1],
                                ],
                              ];
                              connection.query(
                                ins,
                                [values],
                                function (error3, result) {
                                  if (error3) {
                                    message.reply("오류 발생 :" + error3);
                                  } else {
                                    message.reply(pickone(chataccept));
                                  }
                                }
                              );
                            } else {
                              message.reply("최대 개수 초과");
                            }
                          }
                        }
                      );
                    } else {
                      message.reply("인증 (로블닉)을 통해 인증부터 해");
                    }
                  }
                }
              );
            }
            return;
          }

          if (command === "치워") {
            let ins = "DELETE FROM atmchat WHERE discord_id = ?";
            connection.query(
              ins,
              [message.author.id],
              function (error3, result) {
                if (error3) {
                  message.reply("오류 발생 :" + error3);
                } else {
                  message.reply("ㅇㅇ 치웠음 ");
                }
              }
            );
            return;
          }

          if (command === "도움") {
            message.reply(
              "**로블록스 관련**```!인증 (로블닉) : 인증을 함\n!크레딧 : 크레딧을 확인함\n!가격보기 (상품) : 그 상품의 크레딧 가격과 구매코드를 확인\n!구매 (구매코드) : 그 상품을 구매함\n!보유상품 : 자신이 가지고 잇는 크레딧 상품 확인\n!통합정보 (맨션): 점검중\n!배팅 (크레딧) : 응애\n!유저검색 (유저이름) : 해당 유저의 정보 확인 ```**챗봇 관련**```에틈아 (할말) : 챗봇 기능 \n!배워 (질문)/(답변) : 가르침\n!치워 : 자기가 가르친 모든 것을 없앰```**그외**```!애교 : 애교를 함  \n!계산 (계산식) : 사칙연산,제곱(^),괄호 계산기능```"
            );
            return;
          }

          if (command === "핑") {
            message.reply(
              `핑 : ${
                Date.now() - message.createdTimestamp
              }ms, API: ${Math.round(client.ws.ping)}ms`
            );
            return;
          }

          if (command.startsWith("강제치워")) {
            if (
              message.author.id == 183299738823688192 ||
              message.author.id == 397208243476365323
            ) {
              let msg = command.replace("강제치워 ", "");
              let uid = msg.replace("<@", "").replace(">", "");

              let ins = "DELETE FROM atmchat WHERE discord_id = ?";
              connection.query(ins, [uid], function (error3, result) {
                if (error3) {
                  message.reply("오류 발생 :" + error3);
                } else {
                  message.reply("ㅇㅇ 치웠음");
                }
              });
            } else {
              message.reply(pickone(fuckoff));
            }
            return;
          }

          if (command.startsWith("유저검색")) {
            if (command.includes("DROP TABLE")) {
              message.reply(pickone(noSQL));
              return;
            }
            let msg = command.replace("유저검색 ", "");
            try {
              const userId = await getUserIdFromUsername(msg);
              let credits = "";
              if (userId) {
                let sel = "SELECT * FROM users WHERE roblox_id = " + userId;
                connection.query(sel, async function (error, result) {
                  if (error) {
                    message.reply("오류 발생 :" + error);
                  } else {
                    if (result.length != 0) {
                      credits = String(result[0].credits.toFixed(1));
                    } else {
                      credits = "에틈봇 미가입";
                    }
                  }
                });
                const info = await noblox.getPlayerInfo(userId);
                const thumbnailUrl = await noblox.getPlayerThumbnail(
                  userId,
                  420,
                  "png",
                  true,
                  "Headshot"
                );

                const Embed = new EmbedBuilder()
                  .setColor(0x0099ff)
                  .setTitle(info.displayName + " (@" + info.username + ")")
                  .setURL(`https://www.roblox.com/users/${userId}/profile`)
                  .setThumbnail(thumbnailUrl[0].imageUrl)
                  .addFields(
                    { name: "크레딧", value: credits, inline: true },
                    { name: "유저 ID", value: String(userId), inline: true },
                    {
                      name: "계정나이 ",
                      value: String(info.age),
                      inline: true,
                    },
                    {
                      name: "밴 여부",
                      value: String(info.isBanned),
                      inline: true,
                    }
                  )
                  .setTimestamp();

                message.reply({ embeds: [Embed] });
              } else {
                message.reply(
                  notfound[Math.floor(Math.random() * notfound.length)]
                );
              }
            } catch (error) {
              message.reply("오류 발생 : ```" + error + "```");
            }
            return;
          }

          if (command.startsWith("지급")) {
            if (
              message.author.id == 183299738823688192 ||
              message.author.id == 678533110115336222
            ) {
              let a = command.split(" ");
              let sel = "SELECT * FROM users WHERE discord_id = ?";
              let uid = a[1].replace("<@", "").replace(">", "");

              connection.query(
                sel,
                [message.author.id],
                function (error, result) {
                  if (error) {
                    message.reply("오류 발생 :" + error);
                  } else {
                    if (result.length != 0) {
                      let give = `UPDATE users SET credits = credits + ${a[2]} WHERE discord_id = ${uid}`;
                      connection.query(give, function (error2, result2) {
                        if (error2) {
                          message.reply("오류 발생 :" + error2);
                        } else {
                          message.reply("크레딧 지급 완료");
                        }
                      });
                    } else {
                      message.reply("그 사람은 가입이 되어 있지 않습니다.");
                    }
                  }
                }
              );
            } else {
              message.reply(pickone(fuckoff));
            }
            return;
          }

          if (command.startsWith("상태설정")) {
            if (message.author.id == 183299738823688192) {
              let a = command.replace("상태설정 ", "");
              client.user.setPresence({
                activities: [{ name: a[1], type: ActivityType.Playing }],
                status: "online",
              });
              message.reply("ㅇㅇ");
            } else {
              message.reply(pickone(fuckoff));
            }
            return;
          }

          if (command.startsWith("순금시세")) {
            message.reply(gold);
            return;
          }

          if (command.startsWith("정답설정")) {
            if (
              message.author.id == 183299738823688192 ||
              message.author.id == 397208243476365323
            ) {
              eventanswer = command.replace("정답설정 ", "");
              aimg = message.attachments.first().url;
              message.reply("ㅇㅋ");
            } else {
              message.reply(pickone(fuckoff));
            }
            return;
          }

          if (command === "문제설정") {
            if (
              message.author.id == 183299738823688192 ||
              message.author.id == 397208243476365323
            ) {
              qimg = message.attachments.first().url;
              client.channels
                .fetch("1097331403152162978")
                .then((channel) =>
                  channel.send("<@&1072055006620033044> 맞춰보셈 : " + qimg)
                );
              eventon = true;
              message.reply("ㅇㅋ");
            } else {
              message.reply(pickone(fuckoff));
            }
            return;
          }

          if (command.startsWith("문제내기")) {
            if (
              message.author.id == 183299738823688192 ||
              message.author.id == 397208243476365323
            ) {
              let aaaaa = command.replace("문제내기 ", "").split("/");
              if (aaaaa.length == 2) {
                try {
                  txteventanswer = aaaaa[1];
                  qimg = message.attachments.first().url;
                  const exampleEmbed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setAuthor({ name: "출제자 : " + message.author.username })
                    .setTitle(aaaaa[0])
                    .setImage(qimg)
                    .setTimestamp()
                    .setFooter({ text: "#답지 채널에 정답을 입력해보세요." });
                  client.channels
                    .fetch("1097331403152162978")
                    .then((channel) =>
                      channel.send("<@&1072055006620033044> ")
                    );
                  client.channels
                    .fetch("1097331403152162978")
                    .then((channel) =>
                      channel.send({ embeds: [exampleEmbed] })
                    );
                  message.reply("ㅇㅋ");
                } catch (error) {
                  message.reply(pickone(errorhere) + "```" + error + "```");
                }
              } else {
                message.reply("양식대로 하셈");
              }
            } else {
              message.reply(pickone(fuckoff));
            }
            return;
          }

          if (command.startsWith("가격보기")) {
            let wat = command.replace("가격보기 ", "");
            try {
              const res = await axios.get(json_pass);
              let found = null;
              for (let i = 0; i < res.data.length; i++) {
                if (
                  res.data[i].passname.includes(wat) ||
                  res.data[i].display.includes(wat)
                ) {
                  found = res.data[i];
                  break;
                }
              }
              if (found == null) {
                message.reply(pickone(notfound));
              } else {
                const bruhembed = new EmbedBuilder()
                  .setColor(0x0099ff)
                  .setTitle(
                    found.buyable ? found.display : "💵" + found.display
                  )
                  .setDescription("구매 코드 : " + found.passname)
                  .addFields(
                    {
                      name: "크레딧 가격",
                      value: found.limited
                        ? found.price * 4 + " 크레딧"
                        : found.price + " 크레딧",
                      inline: true,
                    },
                    {
                      name: "현금 가격",
                      value: found.price * 10000 + "원",
                      inline: true,
                    },
                    {
                      name: "소유자",
                      value: found.list.length + "명",
                      inline: true,
                    }
                  );
                message.reply({ embeds: [bruhembed] });
              }
            } catch (err) {
              console.log(err);
            }
          }

          // if (command === "올겜패가격") {
          //   let sel = "SELECT * FROM shopprice";
          //   connection.query(sel, function (error, result) {
          //     if (error) {
          //       message.reply("오류 발생 :" + error);
          //     } else {
          //       if (result.length != 0) {
          //         let s = 0;
          //         for (let i = 0; i < result.length; i++) {
          //           s += result[i].price;
          //         }
          //         message.reply(
          //           `올겜패 가격 : ${Math.floor(
          //             (s / 20) * 17
          //           )}크레딧 (15% 할인가 적용)`
          //         );
          //       } else {
          //         message.reply(
          //           notfound[Math.floor(Math.random() * notfound.length)]
          //         );
          //       }
          //     }
          //   });
          // }

          if (command === "크레딧") {
            let sel =
              "SELECT * FROM users WHERE discord_id = " + message.author.id;
            connection.query(sel, function (error, result) {
              if (error) {
                message.reply("오류 발생 :" + error);
              } else {
                if (result.length != 0) {
                  if (result.credits == 0) {
                    message.reply(pickone(empty));
                  } else {
                    message.reply(
                      `<@${
                        message.author.id
                      }>의 크레딧 : ${result[0].credits.toFixed(1)}`
                    );
                  }
                } else {
                  message.reply("인증 (로블닉)을 사용해 가입부터 해");
                }
              }
            });
            return;
          }

          if (command == "보유상품") {
            let sel =
              "SELECT * FROM users WHERE discord_id = " + message.author.id;
            connection.query(sel, async function (error, result) {
              if (error) {
                message.reply("오류 발생 :" + error);
              } else {
                if (result.length != 0) {
                  let have = "";
                  try {
                    const res = await axios.get(json_pass);
                    if (res.data.length > 0) {
                      for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].list.includes(result[0].roblox_id)) {
                          have += res.data[i].passname + ", ";
                        }
                      }
                    }
                    if (have == "") {
                      have = "없네 그지인듯ㅋ";
                    }
                    message.reply(
                      "가지고 있는 크레딧 상품 : ``` " + have + "```"
                    );
                  } catch (err) {
                    console.log(error);
                  }
                } else {
                  message.reply(pickone(notindata));
                }
              }
            });
            return;
          }

          if (command == "에틈봇소스") {
            message.reply("https://github.com/ATMnou/ATMbot");
            return;
          }

          if (command.startsWith("구매")) {
            message.reply("점검중");
            return;
            if (command.includes("DROP TABLE")) {
              message.reply(pickone(noSQL));
              return;
            }
            let wat = command.replace("구매 ", "");
            let sel =
              "SELECT * FROM users WHERE discord_id = " + message.author.id;
            connection.query(sel, async function (error, result) {
              if (error) {
                message.reply("오류 발생 :" + error);
              } else {
                if (result.length != 0) {
                  try {
                    const res = await axios.get(json_pass);
                    let findidx = -1;
                    let findid = 0;
                    for (let i = 0; i < res.data.length; i++) {
                      if (res.data[i].passname == wat) {
                        findidx = i;
                        findid = res.data[i].id;
                      }
                    }
                    if (findidx != -1) {
                      if (res.data[findidx].buyable == false) {
                        message.reply("응 현금으로만 살수있어 ㅉ");
                      } else {
                        if (
                          !res.data[findidx].list.includes(result[0].roblox_id)
                        ) {
                          if (result[0].credits < res.data[findidx].price) {
                            message.reply(pickone(nomoney));
                            return;
                          }
                          let give = `UPDATE users SET credits = credits - ${res.data[findidx].price} WHERE discord_id = ${message.author.id}`;
                          connection.query(
                            give,
                            async function (error3, result3) {
                              if (error3) {
                                message.reply("오류 발생 :" + error3);
                              } else {
                                const firstPass = res.data[findidx];
                                const newlist = firstPass.list;
                                newlist.push(result[0].roblox_id);
                                try {
                                  const res2 = await axios.patch(
                                    json_pass + "/" + findid,
                                    {
                                      list: newlist,
                                    }
                                  );
                                  message.reply(pickone(buydone));
                                  return;
                                } catch (err3) {
                                  console.log(err3);
                                  return;
                                }
                              }
                            }
                          );
                        } else {
                          message.reply("이미 삿음 ㅉ");
                        }
                      }
                    } else {
                      message.reply(pickone(notfound));
                    }
                  } catch (err) {}
                }
              }
            });
            return;
          }

          if (command.startsWith("상품지급")) {
            if (message.author.id == 183299738823688192) {
              let a = command.split(" ");
              if (a.length != 3) {
                message.reply("제대로쳐ㅉ");
                return;
              }
              let uid = a[1].replace("<@", "").replace(">", "");
              let sel = "SELECT * FROM users WHERE discord_id = " + uid;
              connection.query(sel, async function (error, result) {
                if (error) {
                  message.reply("오류 발생 :" + error);
                } else {
                  if (result.length != 0) {
                    try {
                      const res = await axios.get(json_pass);
                      let findidx = -1;
                      let findid = 0;
                      for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].passname == a[2]) {
                          findidx = i;
                          findid = res.data[i].id;
                        }
                      }
                      if (findidx != -1) {
                        if (
                          !res.data[findidx].list.includes(result[0].roblox_id)
                        ) {
                          const firstPass = res.data[findidx];
                          const newlist = firstPass.list;
                          newlist.push(result[0].roblox_id);
                          try {
                            const res2 = await axios.patch(
                              json_pass + "/" + findid,
                              {
                                list: newlist,
                              }
                            );
                            message.reply("상품 지급 완료");
                            return;
                          } catch (err3) {
                            console.log(err3);
                            return;
                          }
                        } else {
                          message.reply("이미 있대 ㅉ");
                        }
                      } else {
                        message.reply(pickone(notfound));
                      }
                    } catch (err) {}
                  }
                }
              });
            } else {
              message.reply(pickone(fuckoff));
            }
            return;
          }

          // if (command.startsWith("배팅")) {
          //   if (command.includes("DROP TABLE")) {
          //     message.reply(pickone(noSQL));
          //     return;
          //   }
          //   let wat = command.replace("배팅 ", "");
          //   let coin = parseInt(wat);
          //   if (isNaN(coin)) {
          //     message.reply("ㅉ");
          //     return;
          //   }
          //   if (coin < 1) {
          //     message.reply("최소 배팅금은 1크레딧임ㅉ");
          //     return;
          //   }
          //   if (coin > 15) {
          //     message.reply("최대 배팅금은 15크레딧임ㅉ");
          //     return;
          //   }
          //   let sel = "SELECT * FROM users WHERE discord_id = " + message.author.id;
          //   connection.query(sel, async function (error, result) {
          //     if (error) {
          //       message.reply("오류 발생 :" + error);
          //     } else {
          //       if (result.length != 0) {
          //         if (result[0].credits >= coin) {
          //           let dobak = calculateProbability(coin);
          //           if (dobak[0] == true) {
          //             let give = `UPDATE users SET credits = credits + ${coin} WHERE discord_id = ${message.author.id}`;
          //             connection.query(give, function (error3, result3) {
          //               if (error3) {
          //                 message.reply("오류 발생 :" + error3);
          //               } else {
          //                 const exampleEmbed = new EmbedBuilder()
          //                   .setColor([0, 255, 0])
          //                   .setTitle("성공!")
          //                   .setDescription(`+${coin}크레딧`);
          //                 message.reply({ embeds: [exampleEmbed] });
          //               }
          //             });
          //           } else {
          //             let give = `UPDATE users SET credits = credits - ${coin} WHERE discord_id = ${message.author.id}`;
          //             connection.query(give, function (error3, result3) {
          //               if (error3) {
          //                 message.reply("오류 발생 :" + error3);
          //               } else {
          //                 const exampleEmbed = new EmbedBuilder()
          //                   .setColor([255, 0, 0])
          //                   .setTitle("실패!")
          //                   .setDescription(`-${coin}크레딧`);
          //                 message.reply({ embeds: [exampleEmbed] });
          //               }
          //             });
          //           }
          //         } else {
          //           message.reply(pickone(cantbet));
          //         }
          //       } else {
          //         message.reply(pickone(notindata));
          //       }
          //     }
          //   });
          //   return;
          // }

          // 이벤트 정답
          if (message.channelId == 1102530668132569089 && eventon == true) {
            if (command == eventanswer) {
              let sel =
                "SELECT * FROM users WHERE discord_id = " + message.author.id;
              connection.query(sel, function (error, result) {
                if (error) {
                  message.reply("오류 발생 :" + error);
                } else {
                  if (result.length != 0) {
                    let give = `UPDATE users SET credits = credits + 0.2 WHERE discord_id = ${message.author.id}`;
                    connection.query(give, function (error2, result2) {
                      if (error2) {
                        message.reply("오류 발생 :" + error2);
                      } else {
                        message.reply(
                          correct[Math.floor(Math.random() * correct.length)]
                        );
                        client.channels
                          .fetch("1097331403152162978")
                          .then((channel) =>
                            channel.send(
                              "정답 : " +
                                eventanswer +
                                " 정답자 : <@" +
                                message.author.id +
                                ">, 원본 : " +
                                aimg
                            )
                          )
                          .then(() => (eventon = false));
                      }
                    });
                  } else {
                    message.reply("정답이지만 가입안해서 무효임 ㅅㄱ");
                  }
                }
              });
            } else {
              message.react("❌");
            }
            return;
          }
          // 정답 처리 2
          if (
            message.channelId == 1102530668132569089 &&
            txteventanswer != ""
          ) {
            if (command == txteventanswer) {
              let sel =
                "SELECT * FROM users WHERE discord_id = " + message.author.id;
              connection.query(sel, function (error, result) {
                if (error) {
                  message.reply("오류 발생 :" + error);
                } else {
                  if (result.length != 0) {
                    let give = `UPDATE users SET credits = credits + 0.2 WHERE discord_id = ${message.author.id}`;
                    connection.query(give, function (error2, result2) {
                      if (error2) {
                        message.reply("오류 발생 :" + error2);
                      } else {
                        message.reply(
                          correct[Math.floor(Math.random() * correct.length)]
                        );
                        client.channels
                          .fetch("1097331403152162978")
                          .then((channel) =>
                            channel.send(
                              "정답 : " +
                                txteventanswer +
                                " 정답자 : <@" +
                                message.author.id +
                                ">"
                            )
                          )
                          .then(() => (txteventanswer = ""));
                      }
                    });
                  } else {
                    message.reply("정답이지만 가입안해서 무효임 ㅅㄱ");
                  }
                }
              });
            } else {
              message.react("❌");
            }
            return;
          }

          if (command.startsWith("인증")) {
            if (command.includes("DROP TABLE")) {
              message.reply(pickone(noSQL));
              return;
            }
            (async () => {
              const username = command.replace("인증 ", "");
              if (username.includes("@")) {
                message.reply(pickone(noeveryone));
                return;
              }
              const userId = await getUserIdFromUsername(username);

              if (userId) {
                let checkn = "SELECT * FROM users WHERE roblox_id = " + userId;

                connection.query(checkn, async function (error, result3) {
                  if (error) {
                    message.reply("오류 발생 :" + error);
                  } else {
                    if (
                      result3.length != 0 &&
                      result3[0].discord_id != message.author.id
                    ) {
                      message.reply(
                        "하나의 로블록스 계정에는 하나의 디스코드 계정만 인증할 수 있어. \n만약 너가 아니거나 계정을 이전해야된다면 관리자를 불러줘.\n인증자 : " +
                          result3[0].discord_id
                      );
                      return;
                    } else {
                      let aa = splitNumber(userId);
                      let pasc = IdtoCode(aa);
                      const descinfo = await noblox.getPlayerInfo(userId);
                      if (descinfo.blurb.includes(pasc)) {
                        let sel =
                          "SELECT * FROM users WHERE discord_id = " +
                          message.author.id;
                        connection.query(sel, function (error, result) {
                          if (error) {
                            message.reply("오류 발생 :" + error);
                          } else {
                            if (result.length != 0) {
                              let ins = `UPDATE users SET roblox_id = ? WHERE discord_id = ${message.author.id}`;
                              connection.query(
                                ins,
                                [userId],
                                function (error2, result) {
                                  if (error2) {
                                    message.reply("오류 발생 :" + error2);
                                  } else {
                                    if (
                                      message.guildId == 1035183996566507580
                                    ) {
                                      let role =
                                        message.member.guild.roles.cache.find(
                                          (role) =>
                                            role.id == "1040559158975541288"
                                        );
                                      if (role)
                                        message.guild.members.cache
                                          .get(message.author.id)
                                          .roles.add(
                                            role,
                                            "인증 완료 : " + userId
                                          );
                                      message.reply(
                                        "자, " +
                                          username +
                                          ".\n수정이 완료되었어."
                                      );
                                    } else {
                                      message.reply(
                                        "자, " +
                                          username +
                                          ".\n수정이 완료되었지만 여기는 동굴이 아니어서 역할은 못줘."
                                      );
                                    }
                                  }
                                }
                              );
                            } else {
                              let ins = "INSERT INTO users() VALUES ?";
                              let values = [[message.author.id, userId, 0]];
                              connection.query(
                                ins,
                                [values],
                                function (error3, result) {
                                  if (error3) {
                                    message.reply("오류 발생 :" + error3);
                                  } else {
                                    if (
                                      message.guildId == 1035183996566507580
                                    ) {
                                      let role =
                                        message.member.guild.roles.cache.find(
                                          (role) =>
                                            role.id == "1040559158975541288"
                                        );
                                      if (role)
                                        message.guild.members.cache
                                          .get(message.author.id)
                                          .roles.add(
                                            role,
                                            "인증 완료 : " + userId
                                          );
                                      message.reply(
                                        "자, " +
                                          username +
                                          ".\n인증이 완료되었어."
                                      );
                                    } else {
                                      message.reply(
                                        "자, " +
                                          username +
                                          ".\n인증이 완료되었지만 여기는 동굴이 아니어서 역할은 못줘."
                                      );
                                    }
                                  }
                                }
                              );
                            }
                          }
                        });
                      } else {
                        message.reply(
                          "아, 넌 또 뭐야, " +
                            username +
                            "? 너 같은 바보를 인증해야 한다니, 이건 정말로 내 인내의 한계를 시험하네. \n이 무시무시한 코드를 네 로블록스 프로필 소개란에 적어. \n코드는 바뀌지 않아, 니가 어떻게든 망쳐놓을 걸 생각하면 다행이다. ```" +
                            pasc +
                            "``` 그 다음엔 다시 이 멍청한 명령어를 써. 만약 네가 이걸 입력했는데 검열되면, 바로 관리자를 불러. \n아니면, 내가 무엇을 해야 할지 모르는 건가?"
                        );
                      }
                    }
                  }
                });
              } else {
                message.reply(
                  notfound[Math.floor(Math.random() * notfound.length)]
                );
              }
            })();
          }
        }
      }
    }
    if (
      !message.author.bot &&
      !message.content.includes("에틈아") &&
      !message.content.startsWith("!") &&
      !message.content.includes("@")
    ) {
      chatdata.push(message.content);
    }
  } catch (error) {
    console.log(error);
  }
});

client.login(config.token);
