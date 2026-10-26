// ข้อมูลตัวอย่างสำหรับ Dashboard (สร้างแบบ deterministic ด้วย seed คงที่)
// เมื่อต่อ backend จริง ให้แทนที่ window.DASHBOARD_DATA ด้วยผลจาก API/ฐานข้อมูล
(function () {
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rnd = mulberry32(2026);
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

  const products = [
    { id: 1,  name: "วิตามินซี 1000 มก.",        category: "วิตามิน",       price: 290,  stock: 48, low: 10 },
    { id: 2,  name: "วิตามินดี3 2000 IU",         category: "วิตามิน",       price: 350,  stock: 6,  low: 10 },
    { id: 3,  name: "วิตามินบีรวม",               category: "วิตามิน",       price: 320,  stock: 22, low: 10 },
    { id: 4,  name: "แมกนีเซียม กลีไซเนต",        category: "แร่ธาตุ",       price: 450,  stock: 4,  low: 8 },
    { id: 5,  name: "ซิงค์ พิโคลิเนต",            category: "แร่ธาตุ",       price: 390,  stock: 31, low: 8 },
    { id: 6,  name: "แคลเซียม + วิตามินดี",       category: "แร่ธาตุ",       price: 420,  stock: 0,  low: 8 },
    { id: 7,  name: "น้ำมันปลา โอเมก้า-3",        category: "น้ำมันปลา/ไขมันดี", price: 590, stock: 27, low: 12 },
    { id: 8,  name: "คริลล์ออยล์",                category: "น้ำมันปลา/ไขมันดี", price: 890, stock: 9,  low: 6 },
    { id: 9,  name: "เวย์โปรตีน ช็อกโกแลต 2 ปอนด์", category: "โปรตีน/ฟิตเนส", price: 1490, stock: 15, low: 5 },
    { id: 10, name: "ครีเอทีน โมโนไฮเดรต",        category: "โปรตีน/ฟิตเนส", price: 690,  stock: 3,  low: 5 },
    { id: 11, name: "BCAA รสส้ม",                 category: "โปรตีน/ฟิตเนส", price: 750,  stock: 18, low: 6 },
    { id: 12, name: "โปรไบโอติก 30 พันล้าน CFU",  category: "ระบบย่อยอาหาร", price: 680,  stock: 25, low: 8 },
    { id: 13, name: "คอลลาเจนเปปไทด์",            category: "ผิวพรรณ",       price: 790,  stock: 7,  low: 8 },
    { id: 14, name: "เมลาโทนิน 3 มก.",            category: "นอนหลับ/ผ่อนคลาย", price: 380, stock: 40, low: 10 },
    { id: 15, name: "แอชวากานดา สกัด",            category: "นอนหลับ/ผ่อนคลาย", price: 520, stock: 12, low: 10 },
    { id: 16, name: "มัลติวิตามิน สำหรับผู้ชาย",   category: "วิตามิน",       price: 480,  stock: 33, low: 10 },
  ];

  const customers = [
    "สมชาย ใจดี","สมหญิง รักสุขภาพ","ณัฐพล วงศ์สุวรรณ","กัญญารัตน์ ศรีสวัสดิ์","ธนากร เพชรรัตน์","พิมพ์ลดา จันทร์เพ็ญ",
    "อนุชา แสงทอง","วริศรา ทองคำ","ปิยะ มั่นคง","ชลธิชา บุญมี","กิตติ พูนทรัพย์","นภัสสร เกษมสุข",
    "รัฐพงษ์ สุขใจ","ศศิธร ประเสริฐ","ภาณุวัฒน์ อินทร์แก้ว","จิราภา คำสุข","วีรภัทร ชัยชนะ","อรทัย สุริยา",
    "สุรชัย พิทักษ์","มนัสนันท์ เรืองศรี","ปรเมศวร์ แก้วมณี","ฐิติมา วัฒนา","เอกชัย ศรีทอง","ลลิตา ภักดี",
  ].map((name, i) => ({ id: i + 1, name }));

  const now = Date.now();
  const DAY = 86400000;
  const orders = [];
  for (let i = 0; i < 120; i++) {
    const daysAgo = Math.floor(Math.pow(rnd(), 1.25) * 30);
    const ts = now - daysAgo * DAY - Math.floor(rnd() * 14 * 3600000);
    const nItems = 1 + Math.floor(rnd() * 3);
    const items = [];
    const used = new Set();
    for (let k = 0; k < nItems; k++) {
      const p = pick(products);
      if (used.has(p.id)) continue;
      used.add(p.id);
      items.push({ productId: p.id, name: p.name, qty: 1 + Math.floor(rnd() * 3), unitPrice: p.price });
    }
    const total = items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
    let status;
    const r = rnd();
    if (daysAgo > 7) status = r < 0.85 ? "completed" : r < 0.93 ? "cancelled" : "shipped";
    else if (daysAgo > 3) status = r < 0.4 ? "completed" : r < 0.7 ? "shipped" : r < 0.9 ? "preparing" : "cancelled";
    else status = r < 0.35 ? "pending_payment" : r < 0.75 ? "preparing" : r < 0.9 ? "shipped" : "completed";
    orders.push({ ts, customer: pick(customers).name, items, total, status });
  }
  orders.sort((a, b) => a.ts - b.ts);
  orders.forEach((o, i) => { o.id = "ORD-" + (1001 + i); });

  window.DASHBOARD_DATA = { generatedAt: now, products, customers, orders };
})();
