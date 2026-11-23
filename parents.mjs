import {randomBytes, timingSafeEqual, scrypt} from "node:crypto";
import {promisify} from "node:util";

const derive = promisify(scrypt);
export const roles = {dad:"Bố", mom:"Mẹ"};
export const parentActions = new Set(["parent-setup", "parent-login", "parent-password", "gift"]);
const validPassword = value => typeof value === "string" && value.length >= 8 && value.length <= 128;
const equal = (a,b) => a.length === b.length && timingSafeEqual(a,b);
const waitMs = 5 * 60 * 1000;

async function hash(password, salt = randomBytes(16).toString("hex")) {
  return {salt, digest: (await derive(password, salt, 64)).toString("hex")};
}

export async function parentOperation(profile, body, setupCode) {
  const {action, role, password, newPassword, amount} = body;
  const reason = typeof body.reason === "string" ? body.reason.trim() : "";
  const fail = (status, error, save = false) => ({status, error, save});
  if (!Object.hasOwn(roles, role) || !validPassword(password)) {
    return fail(400, "Chọn Bố hoặc Mẹ và nhập mật khẩu từ 8 đến 128 ký tự.");
  }
  if (action === "parent-password" && !validPassword(newPassword)) {
    return fail(400, "Mật khẩu mới cần từ 8 đến 128 ký tự.");
  }
  if (action === "gift" && (!Number.isSafeInteger(amount) || amount < 1 ||
      !Number.isSafeInteger(profile.balance + amount) || !reason || reason.length > 300)) {
    return fail(400, "Nhập số sticker nguyên dương và lý do từ 1 đến 300 ký tự.");
  }
  profile.parents ??= {};
  const current = profile.parents[role];
  if (action === "parent-setup") {
    if (current) return fail(409, "Vai trò này đã có mật khẩu. Hãy đăng nhập.");
    if (!setupCode || typeof body.setupCode !== "string" ||
        !equal(Buffer.from(setupCode), Buffer.from(body.setupCode))) {
      return fail(403, "Mã thiết lập chưa đúng hoặc chưa được cấu hình trên Netlify.");
    }
    profile.parents[role] = await hash(password);
    return {save:true};
  }
  if (!current) return fail(409, "Hãy thiết lập mật khẩu lần đầu cho vai trò này.");
  const now = Date.now();
  if (current.blockUntil > now) return fail(429, "Đã nhập sai nhiều lần. Hãy thử lại sau 5 phút.");
  const candidate = await hash(password, current.salt);
  if (!equal(Buffer.from(candidate.digest,"hex"), Buffer.from(current.digest,"hex"))) {
    const failures = current.startedAt > now - waitMs ? (current.failures ?? 0) + 1 : 1;
    current.startedAt = failures === 1 ? now : current.startedAt;
    current.failures = failures;
    if (failures >= 5) current.blockUntil = now + waitMs;
    return fail(403, "Mật khẩu không đúng.", true);
  }
  const hadFailures = Boolean(current.failures);
  delete current.failures;
  delete current.startedAt;
  delete current.blockUntil;
  if (action === "parent-login") return {save:hadFailures};
  if (action === "parent-password") {
    profile.parents[role] = await hash(newPassword);
    return {save:true};
  }
  const previous = profile.history.find(item => item.token === body.token);
  if (previous) {
    if (previous.kind !== "gift" || previous.role !== role || previous.amount !== amount || previous.reason !== reason) {
      return fail(409, "Mã lượt đã được sử dụng.");
    }
    return {save:hadFailures, result:previous};
  }
  profile.balance += amount;
  const result = {kind:"gift", title:roles[role] + " tặng sticker", role, amount, reason,
    token:body.token, date:new Date().toISOString()};
  profile.history.unshift(result);
  return {save:true, result};
}

export function publicProfile(profile) {
  return {balance:profile.balance, history:profile.history,
    parents:Object.fromEntries(Object.keys(roles).map(role => [role, Boolean(profile.parents?.[role])]))};
}
