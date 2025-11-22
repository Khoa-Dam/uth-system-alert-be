-- Seed dữ liệu truy nã mẫu (từ nguồn công khai)

-- 1. Truy nã về tội giết người
INSERT INTO wanted_criminals (id, name, imageUrl, age, gender, description, crime, district, city, latitude, longitude, reward, status)
VALUES (
  gen_random_uuid(),
  'Nguyễn Văn A',
  'https://congan.com.vn/images/wanted/criminal-001.jpg',
  35,
  'Nam',
  'Đối tượng truy nã về tội giết người. Có tiền án bạo hành gia đình. Cực kỳ nguy hiểm, không được tiếp cận.',
  'Giết người',
  'Quận 1',
  'Hồ Chí Minh',
  10.7769,
  106.7009,
  50000000,
  'active'
) ON CONFLICT DO NOTHING;

-- 2. Truy nã về cướp có vũ khí
INSERT INTO wanted_criminals (id, name, imageUrl, age, gender, description, crime, district, city, latitude, longitude, reward, status)
VALUES (
  gen_random_uuid(),
  'Trần Văn B',
  'https://congan.com.vn/images/wanted/criminal-002.jpg',
  28,
  'Nam',
  'Truy nã về tội cướp giật có vũ khí. Có sử dụng dao cướp giật nhiều lần tại các quận trung tâm.',
  'Cướp có vũ khí',
  'Quận 3',
  'Hồ Chí Minh',
  10.7870,
  106.6900,
  30000000,
  'active'
) ON CONFLICT DO NOTHING;

-- 3. Truy nã về bắt cóc
INSERT INTO wanted_criminals (id, name, imageUrl, age, gender, description, crime, district, city, latitude, longitude, reward, status)
VALUES (
  gen_random_uuid(),
  'Lê Thị C',
  'https://congan.com.vn/images/wanted/criminal-003.jpg',
  42,
  'Nữ',
  'Truy nã về tội bắt cóc trẻ em. Đã bắt cóc nhiều trẻ em trong khu vực TP.HCM. Rất nguy hiểm.',
  'Bắt cóc',
  'Quận 5',
  'Hồ Chí Minh',
  10.7550,
  106.6680,
  100000000,
  'active'
) ON CONFLICT DO NOTHING;

-- 4. Truy nã về buôn lậu ma túy
INSERT INTO wanted_criminals (id, name, imageUrl, age, gender, description, crime, district, city, latitude, longitude, reward, status)
VALUES (
  gen_random_uuid(),
  'Phạm Văn D',
  'https://congan.com.vn/images/wanted/criminal-004.jpg',
  39,
  'Nam',
  'Truy nã về tội buôn bán ma túy tổ chức. Đã nhiều lần trốn tránh pháp luật.',
  'Buôn ma túy',
  'Quận 7',
  'Hồ Chí Minh',
  10.7313,
  106.7197,
  75000000,
  'active'
) ON CONFLICT DO NOTHING;

-- 5. Truy nã về lừa đảo
INSERT INTO wanted_criminals (id, name, imageUrl, age, gender, description, crime, district, city, latitude, longitude, reward, status)
VALUES (
  gen_random_uuid(),
  'Hoàng Văn E',
  'https://congan.com.vn/images/wanted/criminal-005.jpg',
  31,
  'Nam',
  'Truy nã về tội lừa đảo chiếm đoạt tài sản. Đã lừa đảo hàng trăm người.',
  'Lừa đảo',
  'Quận 1',
  'Hồ Chí Minh',
  10.7780,
  106.7050,
  25000000,
  'active'
) ON CONFLICT DO NOTHING;

-- 6. Truy nã về giết người (thêm)
INSERT INTO wanted_criminals (id, name, imageUrl, age, gender, description, crime, district, city, latitude, longitude, reward, status)
VALUES (
  gen_random_uuid(),
  'Võ Thị F',
  'https://congan.com.vn/images/wanted/criminal-006.jpg',
  26,
  'Nữ',
  'Truy nã về tội giết người. Nghi phạm bỏ trốn sau khi gây án.',
  'Giết người',
  'Quận 10',
  'Hồ Chí Minh',
  10.7731,
  106.6744,
  45000000,
  'active'
) ON CONFLICT DO NOTHING;

-- Verify
SELECT id, name, crime, district, reward, status FROM wanted_criminals WHERE status = 'active';


