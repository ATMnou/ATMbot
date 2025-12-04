# 알림
이 레포지토리는 구형 에틈봇의 소스 코드이며 지금 서비스되고 있는 에틈봇 시즌 2 (에그봇)은 이름만 같고 완전히 새로운 봇입니다. 에그봇은 소스를 공개하지 않습니다.

<img src="./logo.png" width="300px" height="300px" title="Github_Logo"/>
<br/>
# 에틈봇
에틈봇은 세상에서 가장 무례한 디스코드 봇입니다.
에틈봇은 다음과 같은 기능이 있습니다:
<ul>
<li>로블록스 인증</li>
<li>로블록스 유저 검색 기능</li>
<li>챗봇(GPT 아님)</li>
<li>애교 기능</li>
<li>계산 기능 - 사칙연산, 제곱, 괄호, 지수(삭제 예정) 지원</li>
<li>채팅 데이터 분석 - 파이썬 이용</li>
<li>특정 채팅에 대한 이모지 반응</li>
<li>특정 메세지 검열 기능</li>
</ul>

# 사용 기술

<Strong>사용 언어</Strong>

- JavaScript
- Node.js
- Python

<Strong>사용 라이브러리</Strong>

- Discord.js
- Noblox.js
- json-server (Fastify로 교체 예정)
- axios
- mysql2
- yarn

  <Strong>데이터베이스</Strong>

- MySQL

# 설치 및 사용법

0. 에틈봇을 사용하기 전, 다음과 같은 것이 필요합니다.
<ul>
<li><a href="https://nodejs.org/ko" target="_blank">Node.js</a> 18 이상의 버전</li>
<li><a href="https://www.python.org/downloads/" target="_blank">파이썬</a>(데이터 분석 시 필요)</li>
<li><a href="https://www.mysql.com/" target="_blank">MySQL</a> 또는 <a href="https://mariadb.org/" target="_blank">MariaDB</a>(인증 기능 사용시 필요)</li>
<li>프로그래밍에 대한 기초적인 지식이 있는 대가리</li>
<li><a href="https://yarnpkg.com/getting-started/install" target="_blank">Yarn</a></li>

</ul>

파이썬 사용 시, cmd에 다음과 같은 명령어를 입력해서 패키지를 설치해주세요.
<br/>

```bash
pip install nltk kiwipiepy textblob wordcloud pandas matplotlib seaborn pillow squarify gensim scikit-learn tqdm afinn py_lex scipy openpyxl --trusted-host pypi.org --trusted-host files.pythonhosted.org
```

1. 디스코드 봇을 <a href="https://discord.com/developers/applications">생성합니다.</a>

2. 디스코드 봇을 생성했다면, 이 레포지토리를 클론하거나, 알아서 받아가세요.

3. 노드 모듈이 포함되지 않았으니, 다음과 같은 명령어를 입력해주세요.

```bash
yarn
```

4. config.json 파일을 루트 폴더에다 만들고, 내용물을 아래와 같이 해주세요.

```json
{
  "token": "(니네 봇 토큰)"
}
```

5. MySQL / MariaDB의 데이터베이스를 추가해 주세요.

6. 당신이 생성한 데이터베이스에 맞춰 에틈봇 소스 초반의 이 부분을 수정해주세요:

   ```js
   const connection = mysql.createConnection({
     host: "localhost",
     user: "root",
     password: "qwer1234",
     database: "atmbot",
   });
   ```

7. 에틈봇 소스를 당신의 서버에 맞춰 수정해주세요.

8. 다음과 같은 명령어를 입력해주세요.

```bash
yarn start
```

9. 그 다음은 당신의 몫입니다.

# 참고사항

- mysql2 라이브러리를 사용하여 MySQL과 MariaDB 둘 다 가능합니다.
- 노드 20을 사용해도 에러는 아직 없지만, 이 봇은 노드 18을 사용하는 것을 권장합니다.
- 특정 라이브러리가 노드 18 이상을 요구합니다. 노드 16은 사용하지 마세요.
- 챗봇 기능은 <a href="https://gpt4all.io/index.html">GPT4All</a>로 교체될 수 있습니다. 무료이며, GPU를 사용하지 않습니다. 그러나 응답 속도가 느리며, ChatGPT보다는 자연스럽지 않으며, 응답을 할 수 없는 경우도 있습니다. 한국어는 알아들으나, 한국어로 대답할 수 없어 번역기를 사용합니다.
- <a href="http://atmbot.kro.kr:3001">에틈봇 웹</a>이 개발되고 있습니다! 리액트를 사용합니다. 소스는 공개 예정입니다.

# 후원

에틈봇 프로젝트를 후원해주시면 감사하겠습니다. 후원은 다음과 같은 방법으로 가능합니다:

<ul>
<li>에틈봇 개발자에게 문상이나 계좌(선호)로 후원하기</li>
<li>에틈 스튜디오의 각종 복장 구매</li>
</ul>

# 지원

- <a href="https://discord.gg/B9AHmXF7yR">디스코드 서버</a>가 있습니다! 에틈봇에 대한 질문을 하거나, 버그를 제보할 수 있습니다.
- 이 레포지토리에 이슈를 남겨주시는 것도 좋습니다.

# 라이선스

대충 MIT로 간주해주세요. 아니, 저는 신경 안 씁니다. 여기에 쓴 고마운 각종 오픈소스 개발자들이 신경쓰겠죠. 그냥 이거 갓다가 자유롭게 쓰세요.
