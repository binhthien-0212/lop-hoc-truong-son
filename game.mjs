import {extraCatalog, extraQuiz} from "./question-bank.mjs";

const games = {
  "math-1": ["Toán", "Số và phép tính"],
  "math-2": ["Toán", "Đo lường và hình học"],
  "vi-1": ["Tiếng Việt", "Đọc hiểu và từ ngữ"],
  "vi-2": ["Tiếng Việt", "Chính tả và câu"],
  "en-1": ["Tiếng Anh", "Birthday, backyard and seaside"],
  "en-2": ["Tiếng Anh", "Classroom, farm and village"],
};

const banks = {
  "math-1": [
    ["Số 47 gồm mấy chục và mấy đơn vị?", "4 chục và 7 đơn vị|7 chục và 4 đơn vị|4 chục và 4 đơn vị|7 chục và 7 đơn vị"],
    ["Số liền sau của 59 là số nào?", "60|58|69|50"],
    ["Số nào lớn nhất?", "83|38|78|81"],
    ["26 + 17 bằng bao nhiêu?", "43|33|42|53"],
    ["72 − 28 bằng bao nhiêu?", "44|54|46|50"],
    ["Số nào cần điền vào chỗ trống? 36 + □ = 50", "14|24|16|13"],
    ["Số nào cần điền vào chỗ trống? 64, 66, 68, □, 72", "70|69|71|74"],
    ["Mai có 25 nhãn vở. Mẹ cho Mai thêm 19 nhãn vở. Mai có tất cả bao nhiêu nhãn vở?", "44|34|43|45"],
    ["Một rổ có 63 quả cam. Bà lấy ra 27 quả. Trong rổ còn lại bao nhiêu quả cam?", "36|46|34|40"],
    ["Nam có 18 viên bi. Bình có nhiều hơn Nam 7 viên bi. Bình có bao nhiêu viên bi?", "25|11|24|26"],
  ],
  "math-2": [
    ["1 dm bằng bao nhiêu xăng-ti-mét?", "10 cm|1 cm|2 cm|20 cm"],
    ["Băng giấy dài 20 cm. Cắt đi 8 cm thì còn bao nhiêu?", "12 cm|28 cm|18 cm|10 cm"],
    ["Một túi gạo nặng 5 kg, túi kia nặng 7 kg. Cả hai túi nặng bao nhiêu?", "12 kg|2 kg|11 kg|13 kg"],
    ["Một can có 15 l nước. Rót ra 6 l nước. Trong can còn bao nhiêu?", "9 l|21 l|8 l|10 l"],
    ["Hình tứ giác có bao nhiêu cạnh?", "4 cạnh|3 cạnh|5 cạnh|6 cạnh"],
    ["Đường gấp khúc có ba đoạn dài 4 cm, 5 cm và 6 cm. Đường gấp khúc dài bao nhiêu?", "15 cm|14 cm|16 cm|11 cm"],
    ["Hôm nay là thứ Tư. Ngày mai là thứ mấy?", "Thứ Năm|Thứ Ba|Thứ Sáu|Thứ Hai"],
    ["Kim phút chỉ số 12, kim giờ chỉ số 8. Đồng hồ chỉ mấy giờ?", "8 giờ|12 giờ|4 giờ|9 giờ"],
    ["Tháng nào có ngay sau tháng 11?", "Tháng 12|Tháng 10|Tháng 1|Tháng 9"],
    ["Thùng đỏ có 32 l nước. Thùng xanh có ít hơn thùng đỏ 9 l. Thùng xanh có bao nhiêu lít nước?", "23 l|41 l|22 l|24 l"],
  ],
  "vi-1": [
    ["Ai giúp bà tưới rau?", "Lan|Mẹ|Bạn của Lan|Ông"],
    ["Lan tưới rau vào lúc nào?", "Sáng chủ nhật|Chiều chủ nhật|Sáng thứ hai|Tối thứ bảy"],
    ["Hai bà cháu hái gì?", "Rau cải|Quả cam|Hoa hồng|Cà chua"],
    ["Vì sao Lan vui?", "Vì đã giúp được bà|Vì được tặng đồ chơi|Vì được đi công viên|Vì được ăn kem"],
    ["Từ nào chỉ hoạt động?", "Tưới|Vườn|Rau|Rổ"],
    ["Từ nào chỉ đặc điểm?", "Xanh|Nhặt|Bà|Vườn"],
    ["Từ nào chỉ đồ vật?", "Bình tưới|Chạy|Vui|Chăm chỉ"],
    ["Từ nào có nghĩa trái ngược với “vui”?", "Buồn|Mừng|Thích|Cười"],
    ["Câu nào hỏi về nơi chốn?", "Lan tưới rau ở đâu?|Lan tưới rau khi nào?|Ai tưới rau?|Lan tưới rau bằng gì?"],
    ["Từ nào chỉ người trong gia đình?", "Bà|Bạn học|Bác sĩ|Cô giáo"],
  ],
  "vi-2": [
    ["Từ nào viết đúng chính tả?", "Nghỉ ngơi|Ngỉ ngơi|Nghỉ nghơi|Ngỉ nghơi"],
    ["Từ nào viết đúng chính tả?", "Ghế gỗ|Gế gỗ|Ghế ghỗ|Gế ghỗ"],
    ["Điền chữ còn thiếu vào “...ể chuyện”.", "k|c|q|g"],
    ["Tên riêng nào được viết đúng?", "Nguyễn An|nguyễn An|Nguyễn an|nguyễn an"],
    ["Cuối câu “Bạn tên là gì” cần dấu gì?", "Dấu chấm hỏi|Dấu chấm|Dấu phẩy|Dấu hai chấm"],
    ["Câu nào dùng dấu chấm đúng?", "Em đang đọc sách.|Em đang đọc. sách|Em. đang đọc sách|Em đang. đọc sách"],
    ["Câu nào giới thiệu một người?", "Đây là bạn Minh.|Bạn Minh đang chạy.|Chiếc cặp màu xanh.|Minh có khỏe không?"],
    ["Trong câu “Chú mèo nằm ngủ”, từ nào cho biết chú mèo làm gì?", "nằm ngủ|chú mèo|chú|mèo"],
    ["Trong cụm từ “bông hoa đỏ”, từ nào chỉ màu sắc?", "đỏ|bông|hoa|bông hoa"],
    ["Câu nào nói lời cảm ơn?", "Em cảm ơn chị đã giúp em.|Em xin lỗi vì đến muộn.|Chị có khỏe không?|Chúc chị ngủ ngon!"],
  ],
  "en-1": [
    ["Listen and choose the word you hear.", "kite|bike|kitten|pasta", "kite"],
    ["Listen and choose what the speaker can see.", "a river|a road|a rainbow|the sea", "I can see a river."],
    ["Listen and choose the food you hear.", "pizza|pasta|popcorn|jam", "pizza"],
    ["Choose the missing letter: _ite.", "k|p|s|r"],
    ["Which word starts with the same letter as “pizza”?", "popcorn|rainbow|kite|sea"],
    ["Which word starts with the letter S?", "sand|road|river|bike"],
    ["Choose the missing word: Let’s look ___ the sea!", "at|am|are|can"],
    ["Choose the best answer to “What can you see?”", "I can see a rainbow.|Yes, she is.|Here you are.|Thank you."],
    ["Which one can you ride?", "a bike|a kite|a rainbow|a river"],
    ["Choose the best answer to “Is she flying a kite?”", "Yes, she is.|Yes, I am.|Yes, there is.|Yes, I can."],
  ],
  "en-2": [
    ["Listen and choose the word you hear.", "square|quiz|question|box", "square"],
    ["Listen and choose what the speaker asks for.", "jam|jelly|juice|pizza", "Pass me the jam, please."],
    ["Listen and choose what the speaker can draw.", "a van|a box|an ox|a square", "I can draw a van."],
    ["Which word starts with the letter Q?", "quiz|fox|van|jam"],
    ["Which word ends in the same letter as “box”?", "fox|juice|van|jam"],
    ["Choose the missing letter: _an.", "v|x|q|j"],
    ["Which one can you drink?", "juice|jam|jelly|a square"],
    ["Choose the best answer to “Can you draw a van?”", "Yes, I can.|Yes, he is.|Yes, there is.|Here you are."],
    ["Choose the best answer to “What is he doing?”", "He is doing a quiz.|Yes, I can.|It is a box.|Here you are."],
    ["Choose the best answer to “Is there a fox?”", "Yes, there is.|Yes, she is.|Yes, I can.|This is a van."],
  ],
};

export const catalog = [...Object.entries(games).map(([id, [subject, title]]) => ({id, subject, title})), ...extraCatalog];
export const rewards = [
  ["kit", 500, "1 bộ quần áo Ronaldo", "👕"],
  ["gloves", 500, "1 đôi găng tay thủ môn", "🧤"],
  ["ball", 500, "1 quả bóng đá", "⚽"],
  ["chicken", 200, "1 lần đi ăn gà rán", "🍗"],
  ["mall", 200, "1 lần đi chơi trung tâm thương mại", "🛍️"],
  ["candy", 100, "1 gói kẹo Lot 100", "🍬"],
  ["icecream", 100, "2 cái kem bất kỳ", "🍦"],
  ["potato", 50, "1 lần ăn khoai nướng phô mai mẹ làm", "🧀"],
  ["ribs", 50, "1 lần ăn sườn nướng siêu ngon mẹ làm", "🍖"],
  ["ipad", 30, "1 giờ chơi FIFA hoặc cờ vua trên iPad", "🎮"],
].map(([id, cost, title, icon]) => ({id, cost, title, icon}));

const textVi = "Sáng chủ nhật, Lan theo bà ra vườn. Lan lấy bình tưới, nhẹ nhàng tưới từng luống rau xanh. Bà và Lan hái một rổ rau cải đem vào bếp. Lan rất vui vì đã giúp được bà.";

export function getQuiz(id) {
  if (!Object.hasOwn(banks, id)) return typeof id === "string" ? extraQuiz(id) : null;
  return banks[id].map(([prompt, options, speech], index) => {
    const choices = options.split("|");
    const audio = speech ? `/audio/${id}-${index + 1}.wav` : null;
    return {prompt, choices, audio, answer: 0, passage: id === "vi-1" && index < 4 ? textVi : null};
  });
}
