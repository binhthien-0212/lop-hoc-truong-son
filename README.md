# Lớp học của Trường Sơn

Website ôn tập học kỳ I lớp 2 cho năm học 2026–2027. Gói gồm 300 bài với 3.000 câu, chia đều 100 bài và 1.000 câu cho mỗi môn. Mỗi bài có 10 câu và mỗi câu có 4 lựa chọn. Tiếng Anh có 202 câu nghe và 104 tệp WAV đi kèm.

## Đưa lên Netlify

1. Giải nén toàn bộ thư mục. Đảm bảo thấy `netlify.toml`, `package.json`, thư mục `public` và thư mục `netlify` cùng cấp.
2. Chọn một cách triển khai:
   - **Netlify CLI:** cài Node.js 22 trở lên và mở terminal tại thư mục đã giải nén. Chạy các lệnh sau, đăng nhập Netlify và chọn tạo site mới hoặc liên kết một site do bạn quản lý.

     ```sh
     npm install
     npx netlify-cli login
     npx netlify-cli deploy --prod
     ```

   - **Kho Git:** đưa toàn bộ nội dung thư mục lên một kho Git. Trong Netlify chọn **Add new project → Import an existing project** và chọn kho. Để thư mục gốc mặc định, không cần nhập lệnh build. Thư mục xuất bản là `public` và thư mục Functions là `netlify/functions`, đã khai báo trong `netlify.toml`.
3. Mở URL mà Netlify cung cấp. Dùng một tên thử, nộp bài, rồi mở cùng URL trong cửa sổ ẩn danh hoặc thiết bị khác và nhập lại đúng tên đó. Số sticker và lịch sử phải trùng nhau.

Dùng CLI hoặc tích hợp Git để Netlify đóng gói hàm chấm bài và lưu dữ liệu. Netlify Drop chỉ tải nội dung tĩnh nên cách đó không triển khai được toàn bộ website.

## Sử dụng

- Đăng nhập bằng tên. Tên được chuẩn hoá về chữ thường và gộp khoảng trắng. Ai biết tên đều có thể mở hồ sơ đó, nên dùng biệt danh khó đoán cho lớp học gia đình.
- Mỗi lượt nộp hoàn chỉnh có thể nhận sticker, kể cả khi làm lại bài. Điểm 10, 9 và 8 lần lượt nhận 3, 2 và 1 sticker. Từ 7 điểm trở xuống nhận 0. Hiệu ứng tôn trọng tùy chọn giảm chuyển động của thiết bị.
- Sau khi đổi, sticker được trừ và quà được ghi vào Lịch sử. Gia đình trao phần thưởng ngoài website.
- Dữ liệu được lưu theo từng tên trong Netlify Blobs của cùng một site. Kho tự tạo khi ghi lần đầu, không cần cài cơ sở dữ liệu hay nhập khóa API. Những thiết bị truy cập cùng site và cùng tên sử dụng chung dữ liệu. Mỗi site Netlify riêng có kho riêng.
- Sáu bài đầu nằm trong `game.mjs` và giữ nguyên mã bài cho hồ sơ đã lưu. Các bài bổ sung được tạo từ bộ mẫu biên soạn trong `question-bank.mjs` với dữ liệu thay đổi theo từng bài. Âm thanh đi kèm nằm trong `public/audio`. Trang Nguồn đối chiếu trong website ghi các tài liệu đã dùng để xác định phạm vi và dạng câu.

## Tài liệu Netlify

- [Netlify CLI và Functions](https://docs.netlify.com/api-and-cli-guides/cli-guides/manage-functions/)
- [Triển khai production](https://docs.netlify.com/deploy/deploy-types/production-deploy/)
- [Netlify Blobs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/)
