# Animal Restaurant — Request actions without text-based heuristics

Ngày: 2026-11-21

## Mục tiêu

Xóa các quy tắc suy đoán loại hành động từ chữ hiển thị trên nút, tiêu đề nút, màu nút và nội dung thông báo lỗi. Khi đổi tên nút, đổi ngôn ngữ hoặc sửa thông điệp API, hành vi gửi request / khóa request / xác thực không đổi.

**Gói này chứa nội dung hoàn chỉnh của từng file nguồn, không phải diff hay script patch.** Các file của phiên bản tương tác trước được đính kèm lại ở những nơi cần thiết để cả gói đồng bộ với nhau.

## Thay thế

1. Trong `animalrestaurantshop/`, sao chép toàn bộ thư mục `src/` của gói đè lên `src/` hiện có, giữ nguyên các file không có trong gói.
2. Trong `animalrestauranttools/`, thay thế **`proxy.js`** bằng bản trong gói. Việc này là **bắt buộc** để frontend mới phân biệt lỗi xác thực: backend cũ có trường hợp trả HTTP 200 + chỉ có `message`.
3. Build/deploy riêng frontend và backend bằng quy trình hiện tại của bạn. Không sửa thư mục `animalrestaurantshop/assets/` là sản phẩm build.
4. Không cần thay đổi dữ liệu MongoDB, record của game, token đang lưu, key sản phẩm hay định dạng API nghiệp vụ. Không bổ sung migration, fallback hay chuyển dữ liệu cũ.

### File cần xóa

**Không có.** Chỉ ghi đè file được liệt kê trong ZIP; giữ các file còn lại.

## Những thay đổi chính

### 1. Phân loại hành động bằng metadata, không phải nội dung nút

- `src/shared/components/ui/Button.jsx`: bỏ `childText` và `isRequestButton`/regex theo `aria-label`, `title`, caption hay `variant`. Quy tắc duy nhất: `type='submit'` mặc định là tác vụ API, còn nút thường muốn gọi API thì đặt `requestAction`. Nút submit điều hướng thuần dùng `requestAction={false}` và form đánh dấu `data-local-submit`.
- `src/shared/components/ui/Menu.jsx`: từng menu item có thuộc tính `requestAction: true` cho tác vụ gọi API. Đổi `label` không thay đổi logic; menu vẫn dùng trạng thái `disabled` hiện hành.
- `src/shared/components/ui/Feedback.jsx`: nút retry được khai báo `requestAction` vì thực hiện lại hàm tải dữ liệu.
- Các tác vụ đăng nhập, OTP, shop, giỏ hàng, giftcode, người chơi, bạn bè, tài khoản, nhận thưởng, thanh toán, avatar, JSON editor đều được rà soát và gắn cờ đúng ở nơi phát sinh.
- Các thao tác cuộn, vuốt, tìm kiếm, lọc, phân trang, mở/đóng modal, sao chép, lựa chọn và điều hướng cục bộ vẫn hoạt động lúc có request. Thanh loading và animation cũ giữ nguyên.
- `Head.jsx`: compact icon action được quyết định từ `aria-label` khai báo tường minh (dành cho accessibility), không cần trích văn bản con của nút.

Ví dụ khi **bổ sung tính năng mới**:

```jsx
<Button requestAction onClick={reloadData}>Tải danh sách</Button>
<Button type='submit'>Lưu thay đổi</Button>
<Button onClick={() => setDialogOpen(false)}>Đóng</Button>
<Menu items={[{ id: 'delete', label: 'Xoá', requestAction: true, onClick: deleteItem }]} />
<form data-local-submit onSubmit={goToPlayer}><Button type='submit' requestAction={false}>Xem người chơi</Button></form>
```

Không đặt `requestAction` cho nút chỉ làm việc cục bộ; không cần đổi logic nếu đổi các nhãn trên.

### 2. `call` và `callStream` dùng xử lý thống nhất

`src/shared/library/api/client.js`:

- Cùng một `executeRequest`, kiểm soát timeout, auth, bộ đếm request, token và lỗi mạng.
- Bỏ regex kiểm tra `response.message` (`xác thực`, `token`, `unauthori`, `đăng nhập lại`, …). Chỉ coi là hết phiên đăng nhập khi **HTTP 401 hoặc `code === 'UNAUTHORIZED'`**.
- Đối với HTTP 403 / `FORBIDDEN`, không ép đăng xuất.
- Streaming NDJSON nhận diện sự kiện bằng trường `type: 'progress' | 'error' | 'success'`, và kiểm tra `code` theo cùng quy tắc.
- Không ghi đè `response.status` của payload JSON bằng mã HTTP; trạng thái nghiệp vụ như `pending`/`success`/`cancelled` được giữ nguyên.
- Bộ đếm tăng **ngay khi gọi `call()`/`callStream()`**, kể cả khi request còn đang trong hàng đợi, giúp chặn nhấp đúp/submit tiếp trong lúc mạng bận.
- Ngăn thông báo đăng xuất trùng lặp cho cùng một phiên; đặt token mới sẽ cho phép xử lý 401 mới.
- Tiếp tục dùng hàng đợi API như phiên bản hiện tại để không thay đổi thứ tự các thao tác; không thay đổi endpoint hay payload.
- Cờ `coin: true` được truyền từ hàm API thực sự làm mới số dư; không còn `COIN_REQUESTS` so sánh method/path. Chỉ ảnh hưởng trạng thái spinner.

### 3. API backend nhất quán

`animalrestauranttools/proxy.js`:

| Trạng thái | HTTP | `code` |
|---|---:|---|
| Thiếu/sai token, thiếu tài khoản, tài khoản bị xoá | 401 | `UNAUTHORIZED` |
| Tài khoản không có quyền quản trị | 403 | `FORBIDDEN` |
| Lỗi nội bộ cơ sở dữ liệu / đồng bộ phiên bản | 500 | `INTERNAL_ERROR` |
| Trình duyệt gửi preflight `OPTIONS` | Cho qua | — |

Các response thành công và thông tin `_id`, `openid`, `username`, `coin`, `role` truyền qua header không đổi.

## Danh mục file

**Animal Restaurant Shop (29 file):**

- `src/application/App.jsx`
- `src/features/account/LinkDialog.jsx`
- `src/features/account/LoginStreak.jsx`
- `src/features/account/ProfileCard.jsx`
- `src/features/account/TransactionRow.jsx`
- `src/features/account/Transactions.jsx`
- `src/features/administration/GiftCodes.jsx`
- `src/features/administration/Head.jsx`
- `src/features/administration/PlayerFriends.jsx`
- `src/features/administration/PlayerLookup.jsx`
- `src/features/administration/Players.jsx`
- `src/features/administration/Users.jsx`
- `src/features/avatar/Avatar.jsx`
- `src/features/shop/CartDialog.jsx`
- `src/features/shop/Shop.jsx`
- `src/features/shop/ShopToolbar.jsx`
- `src/shared/components/layout/AppHeader.jsx`
- `src/shared/components/payment/PaymentDialog.jsx`
- `src/shared/components/ui/Button.jsx`
- `src/shared/components/ui/Feedback.jsx`
- `src/shared/components/ui/JsonEditor.jsx`
- `src/shared/components/ui/Menu.jsx`
- `src/shared/components/ui/OtpButton.jsx`
- `src/shared/hooks/useRequestPending.js`
- `src/shared/library/api/auth.js`
- `src/shared/library/api/checkin.js`
- `src/shared/library/api/client.js`
- `src/shared/library/api/shop.js`
- `src/shared/library/api/user.js`

**Animal Restaurant Tools (1 file):**

- `proxy.js`

## Kiểm tra

- Phân tích cú pháp JavaScript/JSX 30 file trong gói bằng TypeScript parser: 0 lỗi cú pháp.
- 10 trường hợp mô phỏng `call`/`callStream`: theo dõi pending đồng bộ, JSON lỗi, thông báo chứa từ `token` nhưng không đăng xuất, HTTP 401, lỗi `code='UNAUTHORIZED'`, trạng thái nghiệp vụ, cờ coin, streaming progress/success/error.
- 8 trường hợp mô phỏng backend proxy: CORS OPTIONS, thiếu token, token sai, tài khoản không tồn tại / bị xoá, phân quyền quản trị, request hợp lệ, lỗi database, lỗi đồng bộ phiên bản.
- Rà soát tĩnh toàn bộ nút phát request trong các màn hình chính và bảo đảm `Button` không còn phân loại theo label/caption.
- **Chưa kiểm thử trong trình duyệt thật và chưa chạy full Vite/Next build** vì không có trọn bộ dependency/build environment trong phiên làm việc này. Vui lòng chạy build bằng repository hiện tại trước khi deploy.

## Giới hạn và quy tắc mở rộng

`requestAction` được đặt **tường minh tại nơi gọi API**. Tác vụ gọi API mới sau này phải được gắn cờ theo chức năng, không thể tự suy đoán an toàn bằng nhãn, class, icon hoặc `function.name`. Các request tự động trong `useEffect`/polling vẫn hoạt động theo lifecycle hiện có; tính năng mới nên xử lý race/cleanup theo từng feature.

Không chỉnh sửa trên GitHub (không commit, branch, push hoặc PR). Không có migration/logic tương thích dữ liệu cũ.
