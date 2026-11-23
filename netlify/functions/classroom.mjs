import {getStore} from "@netlify/blobs";
import {createHash} from "node:crypto";
import {catalog, rewards, getQuiz} from "../../game.mjs";

import {parentActions, parentOperation, publicProfile} from "../../parents.mjs";

const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const respond = (status, data) => Response.json(data, {status, headers: {"Cache-Control": "no-store"}});
const failure = (status, message) => respond(status, {error: message});
const empty = () => ({balance: 0, history: []});

function orderedQuiz(id, token, key) {
  const quiz = getQuiz(id);
  return quiz?.map((q, index) => {
    const digest = createHash("sha256").update(`${key}/${id}/${token}/${index}`).digest();
    const positions = [0, 1, 2, 3];
    for (let i = positions.length - 1; i > 0; i--) {
      const j = digest[i] % (i + 1);
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    return {...q, choices: positions.map(i => q.choices[i]), answer: positions.indexOf(q.answer)};
  });
}

export function createHandler(openStore, getSetupCode = () => process.env.PARENT_SETUP_CODE) {
  return async function classroom(request) {
    if (request.method !== "POST") return failure(405, "Dùng phương thức POST.");
    let body;
    try {
      const raw = await request.text();
      if (raw.length > 4096) return failure(413, "Yêu cầu quá dài.");
      body = JSON.parse(raw);
    } catch {
      return failure(400, "Yêu cầu không hợp lệ.");
    }
    const {action, name, id, token, answers} = body ?? {};
    const normalized = typeof name === "string"
      ? name.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("vi") : "";
    if (!/^[\p{L}\p{M}\p{N} _-]{2,32}$/u.test(normalized)) {
      return failure(400, "Tên đăng nhập cần 2–32 ký tự, dùng chữ, số, khoảng trắng, dấu gạch ngang hoặc gạch dưới.");
    }
    const key = createHash("sha256").update(normalized).digest("hex");
    const lesson = catalog.find(item => item.id === id);
    const prize = rewards.find(item => item.id === id);
    if (["quiz", "submit", "redeem", "gift"].includes(action) && (typeof token !== "string" || !uuid.test(token))) {
      return failure(400, "Mã lượt không hợp lệ.");
    }
    const quiz = lesson && orderedQuiz(id, token, key);
    if (action === "quiz" && quiz) {
      return respond(200, {questions: quiz.map(({answer, ...question}) => question)});
    }
    if (action !== "profile" && action !== "submit" && action !== "redeem" && !parentActions.has(action)) {
      return failure(400, "Thao tác không hợp lệ.");
    }
    if (action === "submit" && (!quiz || !Array.isArray(answers) || answers.length !== 10
        || answers.some(i => !Number.isInteger(i) || i < 0 || i > 3))) {
      return failure(400, "Hãy chọn đủ 10 đáp án.");
    }
    if (action === "redeem" && !prize) return failure(400, "Phần thưởng không hợp lệ.");

    try {
      const store = openStore();
      if (action === "profile") {
        const profile = await store.get(key, {type: "json"});
        return respond(200, {profile: publicProfile(profile ?? empty()), catalog, rewards});
      }

      for (let retry = 0; retry < 10; retry++) {
        const entry = await store.getWithMetadata(key, {type: "json"});
        const profile = entry?.data ?? empty();
        const condition = entry ? {onlyIfMatch: entry.etag} : {onlyIfNew: true};
        if (parentActions.has(action)) {
          const operation = await parentOperation(profile, body, getSetupCode());
          if (operation.save && !(await store.setJSON(key, profile, condition)).modified) continue;
          if (operation.error) return failure(operation.status, operation.error);
          return respond(200, {profile: publicProfile(profile), result: operation.result});
        }
        const previous = profile.history.find(item => item.token === token);
        if (previous) {
          if (previous.kind !== action || previous.id !== id) return failure(409, "Mã lượt đã được sử dụng.");
          return respond(200, {profile: publicProfile(profile), result: previous});
        }

        let result;
        if (action === "submit") {
          const review = quiz.map(q => q.answer);
          const score = answers.filter((answer, i) => answer === review[i]).length;
          const earned = Math.max(0, score - 7);
          profile.balance += earned;
          result = {score, earned, answers, review, title: lesson.title, subject: lesson.subject};
        } else {
          if (profile.balance < prize.cost) return failure(409, "Số sticker hiện tại chưa đủ để đổi quà.");
          profile.balance -= prize.cost;
          result = {title: prize.title, cost: prize.cost};
        }
        result = {...result, token, id, kind: action, date: new Date().toISOString()};
        profile.history.unshift(result);
        const write = await store.setJSON(key, profile, condition);
        if (write.modified) return respond(200, {profile: publicProfile(profile), result});
        await new Promise(resolve => setTimeout(resolve, 15 * (retry + 1) + Math.random() * 30));
      }
      return failure(503, "Có nhiều thay đổi cùng lúc. Hãy thử lại.");
    } catch (error) {
      console.error("Classroom storage error:", error?.name);
      return failure(503, "Kho lưu trữ đang bận. Hãy thử lại sau.");
    }
  };
}

export default createHandler(() => getStore({name: "truong-son-classroom-v1", consistency: "strong"}));
