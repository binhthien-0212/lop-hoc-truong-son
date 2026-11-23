const make = (prompt, choices, passage = null, audio = null) => ({prompt, choices, passage, audio, answer: 0});

function numeric(value, unit = "") {
  const deltas = value < 3 ? [1, 2, 3] : value >= 99 ? [-1, -2, -3] : [-1, 1, 2];
  return [value, ...deltas.map(delta => value + delta)].map(n => String(n) + unit);
}

function mathQuiz(i) {
  const a = 27 + i % 45;
  const b = 13 + Math.floor(i / 45) * 4 + i % 3;
  const c = 35 + i % 59;
  const d = 13 + Math.floor(i / 59) * 5 + i % 4;
  const e = 10 + i % 59;
  const f = 11 + Math.floor(i / 59) * 8;
  const pieces = [2 + i % 7, 3 + Math.floor(i / 7) % 7, 5 + Math.floor(i / 49)];
  const [x, y, z] = pieces;
  const names = ["An", "Bình", "Hà", "Mai", "Nam", "Lan", "Vy"];
  const name = names[i % names.length];
  const delta = 6 + Math.floor(i / 30) * 3;
  const water = 30 + i % 30;
  const selling = 25 + i % 43;
  const more = 8 + Math.floor(i / 43) * 4;
  const n = i + 2;
  const tens = Math.floor(n / 10);
  const units = n % 10;
  const threshold = 23 + i % 49;
  const step = 1 + Math.floor(i / 49) * 2;
  return [
    make(a + " + " + b + " bằng bao nhiêu?", numeric(a + b)),
    make(c + " − " + d + " bằng bao nhiêu?", numeric(c - d)),
    make("Điền số vào ô trống: " + e + " + □ = " + (e + f) + ".", numeric(f)),
    make("Đường gấp khúc gồm ba đoạn dài " + x + " cm, " + y + " cm và " + z + " cm. Tính độ dài đường gấp khúc.", numeric(x + y + z, " cm")),
    make("Can có " + water + " l nước. " + name + " rót ra " + delta + " l. Trong can còn bao nhiêu nước?", numeric(water - delta, " l")),
    make(name + " có " + selling + " nhãn vở. Bạn của " + name + " có nhiều hơn " + name + " " + more + " nhãn vở. Người bạn đó có bao nhiêu nhãn vở?", numeric(selling + more)),
    make("Mỗi số sau hơn số trước " + step + " đơn vị. Điền số còn thiếu: " + threshold + ", " + (threshold + step) + ", □, " + (threshold + 3 * step) + ".", numeric(threshold + 2 * step)),
    make("Sợi dây dài " + c + " cm. Cắt bỏ " + (d + 1) + " cm. Sợi dây còn bao nhiêu xăng-ti-mét?", numeric(c - d - 1, " cm")),
    make("Số nào có " + tens + " chục và " + units + " đơn vị?", numeric(n)),
    make("Một bao gạo nặng " + (a - 8) + " kg. Một bao khác nặng " + (b + 1) + " kg. Hỏi cả hai bao nặng bao nhiêu?", numeric(a + b - 7, " kg")),
  ];
}

const scenes = [
  ["vườn rau", "bếp", "sân", "thư viện", "bà", "tưới", "rau cải", "xanh", "bình tưới", "mang nước"],
  ["thư viện", "vườn", "sân trường", "bếp", "cô giáo", "xếp", "sách", "dày", "giá sách", "giữ sách gọn gàng"],
  ["sân nhà", "phòng khách", "bếp", "cổng trường", "mẹ", "quét", "lá", "khô", "chổi", "làm sân sạch"],
  ["phòng khách", "bếp", "thư viện", "sân trường", "anh trai", "gấp", "khăn", "mềm", "rổ", "giúp anh dọn đồ"],
  ["sân trường", "phòng ngủ", "bờ ao", "bếp", "bạn cùng lớp", "nhặt", "giấy", "trắng", "túi", "giữ sân sạch"],
  ["hiên nhà", "lớp học", "thư viện", "cổng trường", "ông", "lau", "ghế", "thấp", "khăn lau", "làm ghế sạch"],
  ["bếp", "vườn", "sân trường", "bờ ao", "mẹ", "rửa", "cà chua", "đỏ", "rổ", "chuẩn bị bữa ăn"],
  ["lớp học", "bờ ao", "công viên", "bếp", "cô giáo", "cất", "bút", "ngắn", "hộp bút", "giữ góc học tập gọn gàng"],
  ["công viên", "thư viện", "phòng ngủ", "bếp", "bố", "nhặt", "cành cây", "khô", "túi", "dọn sạch lối đi"],
  ["phòng ngủ", "sân trường", "bờ ao", "thư viện", "chị", "gấp", "áo", "sạch", "tủ", "giữ phòng gọn gàng"],
  ["nhà kho", "bưu điện", "sân trường", "bếp", "ông", "xếp", "thùng", "nhẹ", "kệ", "giữ đồ đạc gọn gàng"],
  ["cổng trường", "bếp", "phòng ngủ", "vườn", "bạn cùng lớp", "nhặt", "lá", "vàng", "túi", "giữ cổng trường sạch"],
  ["góc học tập", "sân trường", "bếp", "vườn", "chị", "cất", "vở", "mới", "cặp", "giữ vở gọn gàng"],
  ["sân sau", "thư viện", "lớp học", "phòng ngủ", "bà", "rửa", "chậu", "nhỏ", "xô nước", "giúp bà dọn sân"],
];
const children = ["An", "Bình", "Hà", "Lan", "Mai", "Nam", "Vy", "Hoa", "Linh", "Hùng", "Minh", "Thảo", "Tuấn", "Trang", "Ngọc"];
const days = ["thứ Hai", "thứ Ba", "thứ Tư", "thứ Năm", "thứ Sáu", "thứ Bảy", "chủ nhật"];
const cap = text => text[0].toLocaleUpperCase("vi") + text.slice(1);

function vietnameseQuiz(i) {
  const [place, other1, other2, other3, companion, verb, item, feature, tool, reason] = scenes[i % scenes.length];
  const child = children[Math.floor(i / scenes.length)];
  const dayIndex = (Math.floor(i / scenes.length) + i % scenes.length) % days.length;
  const day = days[dayIndex];
  const phrase = item + " " + feature;
  const action = child + " " + verb + " " + phrase;
  const passage = "Sáng " + day + ", " + child + " đến " + place + " cùng " + companion + ". " + action + ". Gần đó có " + tool + ". " + child + " vui vì có thể " + reason + ".";
  const quoted = "“" + action + "”";
  const thanks = companion === "bạn cùng lớp" ? "Mình cảm ơn bạn!" :
    ["bà", "ông"].includes(companion) ? "Cháu cảm ơn ạ!" : companion === "mẹ" ? "Con cảm ơn mẹ ạ!" : "Em cảm ơn ạ!";
  return [
    make(child + " đến đâu vào sáng " + day + "?", [place, other1, other2, other3].map(cap), passage),
    make(child + " đi cùng ai trong đoạn văn?", [companion, ...["bà", "bố", "anh", "chị", "bạn", "cô giáo"].filter(word => word !== companion).slice(0, 3)].map(cap), passage),
    make("Câu chuyện xảy ra vào sáng ngày nào?", [0, 1, 3, 5].map(offset => cap(days[(dayIndex + offset) % days.length])), passage),
    make("Vì sao " + child + " vui?", ["Vì có thể " + reason, "Vì được ăn kem", "Vì nhận được đồ chơi", "Vì được xem phim"], passage),
    make("Trong câu " + quoted + ", từ nào chỉ hoạt động?", [verb, item, feature, child]),
    make("Trong cụm từ “" + phrase + "”, từ nào chỉ đặc điểm?", [feature, item, verb, place], passage),
    make("Câu hỏi “" + child + " đi đâu” cần viết dấu cuối câu thế nào?", [child + " đi đâu?", child + " đi đâu.", child + " đi đâu!", child + " đi đâu,"], passage),
    make("Câu “" + child + " đi cùng " + companion + "” là một câu kể. Cần thêm dấu gì vào cuối câu?", ["Dấu chấm", "Dấu chấm hỏi", "Dấu phẩy", "Dấu hai chấm"], passage),
    make("Ở đầu câu “" + child.toLocaleLowerCase("vi") + " đến " + place + "”, tên riêng cần viết thế nào?", [child, child.toLocaleLowerCase("vi"), child.toLocaleUpperCase("vi"), child[0].toLocaleLowerCase("vi") + child.slice(1).toLocaleUpperCase("vi")], passage),
    make("Nếu " + companion + " đưa " + tool + " để giúp em, em nên nói gì?", [thanks, "Xin lỗi vì đến muộn.", "Mình không nghe thấy.", "Hẹn gặp lại!"], passage),
  ];
}

const themes = [
  {title:"Birthday party", place:"at a birthday party", words:["pizza","pasta","popcorn"], letter:"p", extra:"jelly", verb:"eating", idea:"What is yummy?", context:"The <A> is yummy.", frame:"The <A> ___ yummy.", fill:["is","am","can","do"]},
  {title:"In the backyard", place:"in the backyard", words:["kite","bike","kitten"], letter:"k", extra:"jam", verb:"playing", idea:"Is she flying a kite?", context:"Yes, she is.", frame:"___ she flying a kite?", fill:["Is","Am","Are","Do"]},
  {title:"At the seaside", place:"at the seaside", words:["sail","sand","sea"], letter:"s", extra:"quiz", verb:"playing", idea:"What can you see?", context:"I can see the sea.", frame:"Let’s look ___ the sea.", fill:["at","am","is","can"]},
  {title:"In the countryside", place:"in the countryside", words:["rainbow","river","road"], letter:"r", extra:"box", verb:"looking at the river", idea:"What can you see?", context:"I can see a <A>.", frame:"What ___ you see?", fill:["can","is","am","at"]},
  {title:"In the classroom", place:"in the classroom", words:["question","quiz","square"], letter:"q", extra:"juice", verb:"doing a quiz", idea:"What is he doing?", context:"He is doing a quiz.", frame:"He ___ doing a quiz.", fill:["is","am","at","can"]},
  {title:"On the farm", place:"on the farm", words:["box","fox","ox"], letter:"x", extra:"van", verb:"looking for a fox", idea:"Is there a fox?", context:"Yes, there is a fox.", frame:"Is ___ a fox?", fill:["there","can","am","see"]},
  {title:"In the kitchen", place:"in the kitchen", words:["juice","jelly","jam"], letter:"j", extra:"kite", verb:"helping in the kitchen", idea:"Pass me the <A>, please.", context:"Here you are.", frame:"___ me the <A>, please.", fill:["Pass","Am","Is","Does"]},
  {title:"In the village", place:"in the village", words:["village","van","volleyball"], letter:"v", extra:"sand", verb:"drawing a van", idea:"Can you draw a van?", context:"Yes, I can draw a van.", frame:"Can you ___ a van?", fill:["draw","yummy","at","is"]},
];
const englishNames = ["Amy","Ben","Emma","Finn","Grace","Hugo","Ivy","Jack","Kim","Lily","Mia","Noah","Olivia","Paul","Rose","Sam","Tina","Victor","Wendy","Zoe","Anna","Daisy","Leo","Max","Sophie"];
const spellingClues = {
  "pizza": "a food with cheese on top",
  "pasta": "a food like spaghetti",
  "popcorn": "a snack made from corn",
  "kite": "a toy that flies on a string",
  "bike": "something with two wheels you can ride",
  "kitten": "a baby cat",
  "sail": "cloth that catches the wind on a boat",
  "sand": "the tiny grains on a beach",
  "sea": "a large area of salt water",
  "rainbow": "a band of colors in the sky",
  "river": "water that flows across land",
  "road": "a path for cars",
  "question": "something you ask",
  "quiz": "a short test",
  "square": "a shape with four equal sides and four right angles",
  "box": "a container with flat sides",
  "fox": "a wild animal with a bushy tail",
  "ox": "a large animal like a cow",
  "juice": "a drink made from fruit",
  "jelly": "a soft dessert that can wobble",
  "jam": "a sweet fruit spread",
  "village": "a small place where people live",
  "van": "a vehicle that can carry people or packages",
  "volleyball": "a game in which players hit a ball over a net"
};
const englishDays = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

function englishScenario(i) {
  const theme = themes[i % themes.length];
  const round = Math.floor(i / themes.length);
  const child = englishNames[round];
  const day = englishDays[(round + i % themes.length) % 7];
  const words = [0,1,2].map(n => theme.words[(round + n) % 3]);
  const [a,b,c] = words;
  const noun = a === "ox" ? "an ox" : /^(kite|bike|kitten|sail|rainbow|river|road|question|quiz|square|box|fox|village|van|volleyball)$/.test(a) ? "a " + a : a === "sea" ? "the sea" : a;
  const recording = "I am " + child + ". It is " + day + ". I am " + theme.place + ". I can see " + noun + ".";
  return {theme, child, day, words, recording};
}

function englishQuiz(i) {
  const {theme, child, day, words} = englishScenario(i);
  const [a,b,c] = words;
  const clip = "/audio/en-extra-" + (i + 3) + ".wav";
  const narration = child + " is " + theme.place + " on " + day + ". Today, the word on " + child + "’s card is “" + a + "”.";
  const cue = "In " + child + "’s " + day + " lesson " + theme.place + ", ";
  const subst = text => text.replaceAll("<A>", a);
  const isEnd = theme.letter === "x";
  const index = isEnd ? a.length - 1 : 0;
  const missing = a[index];
  const masked = a.slice(0,index) + "_" + a.slice(index + 1);
  const letterOptions = [missing, ...["p","k","s","r","j","v","x","b"].filter(letter => letter !== missing).slice(0,3)];
  const sameLetter = theme.words.filter(word => word !== a && (isEnd ? word.endsWith(missing) : word.startsWith(missing)));
  const otherWords = ["sand","rainbow","juice","pizza","box","van","kite"].filter(word => word !== a && (isEnd ? !word.endsWith(missing) : !word.startsWith(missing)));
  const locationChoices = [theme.place, ...themes.filter(t => t !== theme).slice(0,3).map(t => t.place)];
  const activity = child + " is " + theme.verb + ".";
  return [
    make("Listen to the first part. What is the speaker’s name?", [child, ...englishNames.filter(name => name !== child).slice(0,3)], null, clip),
    make("Listen again. What can the speaker see?", [a,b,c,theme.extra], null, clip),
    make("Where is " + child + " in this story?", locationChoices, narration),
    make("What day is it in " + child + "’s story?", [day, ...englishDays.filter(name => name !== day).slice(0,3)], narration),
    make("Which word is on " + child + "’s card?", [a,b,c,theme.extra], narration),
    make("Choose the missing letter on " + child + "’s card: " + masked + ".", letterOptions,
      child + " is " + theme.place + " on " + day + ". The clue is “" + spellingClues[a] + "”."),
    make("Which word has the same " + (isEnd ? "last" : "first") + " letter as “" + a + "”?", [sameLetter[0] ?? "sea", ...otherWords.slice(0,3)], narration),
    make(cue + "choose the missing word: “" + subst(theme.frame) + "”", theme.fill),
    make("Choose the best reply in " + child + "’s " + day + " lesson " + theme.place + ": “" + subst(theme.idea) + "”", [subst(theme.context), "Good night!", "Thank you for the book.", "It is Monday."]),
    make("What is " + child + " doing?", [activity, ...["sleeping","singing","running","reading"].filter(verb => verb !== theme.verb).slice(0,3).map(verb => child + " is " + verb + ".")], child + " is " + theme.place + " on " + day + ". " + child + " is " + theme.verb + "."),
  ];
}

function secondMathQuiz(i) {
  const a = 41 + i % 50;
  const b = 1 + Math.floor(i / 50);
  const c = 21 + i % 50;
  const d = 3 + Math.floor(i / 50);
  const units = 1 + i % 9;
  const decimeters = 1 + Math.floor(i / 9) % 9;
  const length = 10 * decimeters + units;
  const conversion = i < 81
    ? make("Đổi " + decimeters + " dm và " + units + " cm ra xăng-ti-mét.", numeric(length, " cm"))
    : i < 90
      ? make("Đổi " + units + " dm ra xăng-ti-mét.", numeric(10 * units, " cm"))
      : make("Đổi " + (i - 89) * 10 + " cm ra đề-xi-mét.", numeric(i - 89, " dm"));
  const boxes = 12 + i % 40;
  const extra = 4 + Math.floor(i / 40) * 3;
  const hour = 1 + i % 10;
  const later = 1 + Math.floor(i / 10) % 5;
  const minute = i < 50 ? 0 : 30;
  const clock = h => h + " giờ" + (minute ? " 30 phút" : "");
  const child = children[i % children.length];
  const date = new Date(Date.UTC(2026, 8, i + 1));
  const day = (date.getUTCDay() + 6) % 7;
  const gap = 1 + i % 3;
  return [
    make("Tính tổng của " + a + " và " + b + ".", numeric(a + b)),
    make("Tính hiệu của " + c + " và " + d + ".", numeric(c - d)),
    make("Chọn số cần điền: □ − " + d + " = " + c + ".", numeric(c + d)),
    conversion,
    make("Nhà " + child + " có " + boxes + " quả trứng. Mẹ mua thêm " + extra + " quả. Nhà " + child + " có tất cả bao nhiêu quả trứng?", numeric(boxes + extra)),
    make("Bây giờ là " + clock(hour) + ". Sau " + later + " giờ nữa là mấy giờ?", [0, -1, 1, 2].map(offset => clock(hour + later + offset))),
    make("Ngày " + date.getUTCDate() + " tháng " + (date.getUTCMonth() + 1) + " là " + days[day] + ". Sau " + gap + " ngày nữa là thứ mấy?", [0,1,3,5].map(x => cap(days[(day + gap + x) % 7]))),
    make("Thùng A có " + boxes + " l nước. Thùng B có ít hơn " + extra + " l. Thùng B có bao nhiêu lít nước?", numeric(boxes - extra, " l")),
    make("Đội của " + child + " ghi " + a + " điểm. Đội bạn ghi " + b + " điểm. Đội của " + child + " ghi nhiều hơn đội bạn bao nhiêu điểm?", numeric(a - b)),
    make("Tìm số liền sau của " + a + ". Nếu cộng số đó với " + b + " thì được bao nhiêu?", numeric(a + 1 + b)),
  ];
}

const generators = [
  {prefix:"math", subject:"Toán", quiz:i => i < 98 ? mathQuiz(i) : secondMathQuiz(i - 98), title:i => ["Cộng, trừ và giải toán","Số, đơn vị đo và đường gấp khúc","Luyện tập tổng hợp"][i % 3]},
  {prefix:"vi", subject:"Tiếng Việt", quiz:vietnameseQuiz, title:i => cap(scenes[i % scenes.length][0]) + " và luyện từ, câu"},
  {prefix:"en", subject:"Tiếng Anh", quiz:englishQuiz, title:i => themes[i % themes.length].title},
];
export const extraCatalog = generators.flatMap(({prefix, subject, title}) =>
  Array.from({length:198}, (_, i) => ({id:prefix + "-" + (i + 3), title:title(i), subject})));

export function extraQuiz(id) {
  const match = /^(math|vi|en)-([0-9]{1,3})$/.exec(id);
  const number = Number(match?.[2]);
  if (!match || number < 3 || number > 200 || String(number) !== match[2]) return null;
  return generators.find(entry => entry.prefix === match[1]).quiz(number - 3);
}

export const recordings = Array.from({length:198}, (_, i) => ({name:"en-extra-" + (i + 3), text:englishScenario(i).recording}));
