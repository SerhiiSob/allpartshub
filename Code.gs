// ╔══════════════════════════════════════════════════════════════════╗
// ║      All Parts Hub — Google Apps Script (захищена версія)      ║
// ║      Серверна валідація · Rate Limit · Захист цін              ║
// ╚══════════════════════════════════════════════════════════════════╝

const SHEET_NAME = 'orders_db';

// ── КАТАЛОГ ТОВАРІВ — ціни для серверної перевірки ───────────────
// ⚠ При зміні ціни на сайті — оновлюй тут також!
const PRODUCT_CATALOG = {
  'APH-001': { name: 'Головка косильна AutoCut 25-2 STIHL',                  price: 580  },
  'APH-002': { name: 'Ланцюг Oregon 3/8 1.3мм 52зв.',                        price: 390  },
  'APH-003': { name: 'Карбюратор Walbro WYL-240 для бензокос',               price: 850  },
  'APH-004': { name: 'Свічка запалювання NGK CMR6H для кос',                 price: 85   },
  'APH-005': { name: 'Головка косильна напівавтомат універсальна',           price: 320  },
  'APH-006': { name: 'Головка косильна Husqvarna T25 (замінник)',            price: 490  },
  'APH-007': { name: 'Струна косильна кругла 2.4мм x 15м',                  price: 65   },
  'APH-008': { name: 'Струна косильна зірочка 3.0мм x 10м',                 price: 95   },
  'APH-009': { name: 'Струна косильна квадратна 2.65мм x 12м',              price: 80   },
  'APH-010': { name: 'Лезо 3-стороннє 255x25.4мм (1.5мм)',                  price: 280  },
  'APH-011': { name: 'Диск 8-зубий металевий 305x25.4мм',                   price: 420  },
  'APH-012': { name: 'Диск 40-зубий для чагарнику 255мм',                   price: 520  },
  'APH-013': { name: 'Повітряний фільтр STIHL FS 38/45/55',                 price: 95   },
  'APH-014': { name: 'Паливний фільтр бензокоси 5мм (10шт)',                price: 120  },
  'APH-015': { name: 'Сальники колінвала бензокоси 20x32x7',                price: 85   },
  'APH-016': { name: 'Стартер у зборі STIHL FS 38/45/55',                   price: 650  },
  'APH-017': { name: 'Мотузка стартера 3мм x 1м (нейлон)',                  price: 35   },
  'APH-018': { name: 'Стартер ручний 168F/170F (мотоблок, генератор)',       price: 480  },
  'APH-019': { name: 'Шків стартера 168F (пластик)',                         price: 95   },
  'APH-020': { name: 'Кільця поршневі 40мм (2 шт) для кос',                 price: 185  },
  'APH-021': { name: 'Кільця поршневі 52мм (2 шт) мотоблок 168F',           price: 220  },
  'APH-022': { name: 'Насадка-культиватор для бензокоси',                    price: 1250 },
  'APH-023': { name: 'Насадка-сучкоріз для бензокоси',                       price: 980  },
  'APH-024': { name: 'Карбюратор STIHL MS 180 (Zama C1Q-S57B)',             price: 780  },
  'APH-025': { name: 'Повітряний фільтр STIHL MS 180/181/211',              price: 95   },
  'APH-026': { name: 'Стартер у зборі STIHL MS 180',                        price: 720  },
  'APH-027': { name: 'Карбюратор Oleo-Mac 726/733/740',                      price: 920  },
  'APH-028': { name: 'Повітряний фільтр Oleo-Mac 726/733',                  price: 110  },
  'APH-029': { name: 'Карбюратор для генератора 168F',                       price: 420  },
  'APH-030': { name: 'Свічка F7RTC для генератора 168F/170F',                price: 65   },
  'APH-031': { name: 'Повітряний фільтр мотоблок 168F (з передфільтром)',    price: 145  },
  'APH-032': { name: 'Ремінь клиновий для мотоблока A-900',                 price: 185  },
  'APH-033': { name: 'Камера 3.50-6 для мотоблока (TR-87)',                 price: 220  },
  'APH-034': { name: 'Покришка 4.00-10 для мотоблока (протектор ялинка)',    price: 680  },
  'APH-035': { name: 'Шина 35см для STIHL MS 180 (50зв.)',                  price: 380  },
  'APH-036': { name: 'Шина 40см для Husqvarna 236 (57зв.)',                 price: 450  },
  'APH-037': { name: 'Ланцюг Oregon 52зв. 1.3мм (стандартний)',             price: 390  },
  'APH-038': { name: 'Ланцюг 57зв. 1.3мм (напівзрізний)',                   price: 460  },
  'APH-039': { name: 'Ланцюг 64зв. 1.3мм для Husqvarna 435',               price: 520  },
  'APH-040': { name: 'Масло ланцюгове Kamberg 1L (мінеральне)',              price: 195  },
  'APH-041': { name: 'Масло 2-тактне Kamberg 1L (1:50)',                     price: 280  },
  'APH-042': { name: 'Масло 2-тактне Kamberg 100мл (промо)',                 price: 75   },
  'APH-043': { name: 'Окуляри захисні відкриті (прозорі)',                   price: 95   },
  'APH-044': { name: 'Маска-щиток захисна з сіткою',                         price: 185  },
  'APH-045': { name: 'Ремінь косаря подвійний (через обидва плечі)',         price: 320  },
  'APH-046': { name: 'Свічка NGK BPMR7A (для 2-тактних пил/кос)',            price: 75   },
  'APH-047': { name: 'Комплект ущільнювачів картера бензокоси 43cc',         price: 220  },
  'APH-048': { name: 'Паливопровід бензокоси/коси 3.5мм x 30см',            price: 45   },
};

// ── RATE LIMIT ────────────────────────────────────────────────────
const RL_MAX  = 10;   // макс. замовлень
const RL_MINS = 60;   // за N хвилин

// ── ЛІМІТИ ПОЛІВ ─────────────────────────────────────────────────
const LIMITS = {
  orderNumber: 10, productId: 10, quantity: 3,
  fullName: 100,   phone: 13,     telegram: 34,
  address: 300,    date: 12,
};


// ════════════════════════════════════════════════════════════════
// doGet — повертає наступний номер замовлення
// ════════════════════════════════════════════════════════════════
function doGet(e) {
  if (!e || !e.parameter || e.parameter.action !== 'nextOrder') {
    return _json({ status: 'error', msg: 'Unknown action' });
  }
  try {
    const sheet = _getSheet();
    if (!sheet) return _json({ status: 'error', msg: 'Sheet not found' });

    const lastRow = sheet.getLastRow();
    let nextNum = 4001;
    if (lastRow > 1) {
      const nums = sheet.getRange(2, 1, lastRow - 1, 1).getValues()
        .map(r => parseInt((r[0] || '').toString().replace('#', '')))
        .filter(n => !isNaN(n) && n > 0);
      if (nums.length) nextNum = Math.max(...nums) + 1;
    }
    return _json({ nextOrder: nextNum });
  } catch (err) {
    _logError('doGet', err.message);
    return _json({ status: 'error', msg: 'Server error' });
  }
}


// ════════════════════════════════════════════════════════════════
// doPost — валідує і записує рядок замовлення
// ════════════════════════════════════════════════════════════════
function doPost(e) {
  try {
    // 1. Розбір тіла
    if (!e || !e.postData || !e.postData.contents) {
      return _json({ status: 'error', msg: 'Empty request' });
    }
    let data;
    try { data = JSON.parse(e.postData.contents); }
    catch (_) { return _json({ status: 'error', msg: 'Invalid JSON' }); }

    // 2. Rate limit по IP
    const ip = _getIp(e);
    if (!_checkRateLimit(ip)) {
      _logSuspicious('rate_limit_exceeded', ip);
      return _json({ status: 'error', msg: 'Too many requests' });
    }

    // 3. Валідація обов'язкових полів
    const err = _validateRow(data);
    if (err) {
      _logSuspicious('validation_failed:' + err, ip);
      return _json({ status: 'error', msg: 'Validation failed' });
    }

    // 4. Санітизація
    const safe = _sanitizeRow(data);

    // 5. Перевірка артикула + ПЕРЕРАХУНОК ЦІНИ (не довіряємо клієнту)
    const product = PRODUCT_CATALOG[safe.productId];
    if (!product) {
      _logSuspicious('unknown_product:' + safe.productId, ip);
      return _json({ status: 'error', msg: 'Unknown product' });
    }
    const safeQty      = Math.max(1, Math.min(99, parseInt(safe.quantity) || 1));
    const serverAmount = product.price * safeQty;

    // 6. Логуємо спробу підміни ціни
    const clientAmount = parseFloat(safe.amount) || 0;
    if (Math.abs(clientAmount - serverAmount) > 0.01) {
      _logSuspicious(
        'price_mismatch id=' + safe.productId +
        ' client=' + clientAmount + ' server=' + serverAmount, ip
      );
    }

    // 7. Запис у таблицю
    const sheet = _getSheet();
    if (!sheet) return _json({ status: 'error', msg: 'Sheet not found' });

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Номер замовлення','Товар','Артикул','Кількість',
        'Сума (грн)','ПІБ','Телефон','Telegram','Адреса','Дата'
      ]);
    }

    sheet.appendRow([
      safe.orderNumber,
      product.name,      // з каталогу — не від клієнта
      safe.productId,
      safeQty,
      serverAmount,      // з каталогу — не від клієнта
      safe.fullName,
      safe.phone,
      safe.telegram || '—',
      safe.address,
      safe.date,
    ]);

    return _json({ status: 'ok' });

  } catch (err) {
    _logError('doPost', err.message);
    return _json({ status: 'error', msg: 'Server error' });
  }
}


// ════════════════════════════════════════════════════════════════
// ДОПОМІЖНІ ФУНКЦІЇ
// ════════════════════════════════════════════════════════════════

function _getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function _getIp(e) {
  return (e && e.parameter && e.parameter.ip)
    ? e.parameter.ip : 'unknown';
}

// Rate limit через PropertiesService (зберігається між запитами)
function _checkRateLimit(ip) {
  const props   = PropertiesService.getScriptProperties();
  const key     = 'rl_' + ip.replace(/[^a-zA-Z0-9]/g, '_');
  const now     = Date.now();
  const windowMs = RL_MINS * 60 * 1000;

  let rec;
  try { rec = JSON.parse(props.getProperty(key) || 'null'); } catch(_) {}

  if (!rec || now - rec.start > windowMs) {
    props.setProperty(key, JSON.stringify({ start: now, count: 1 }));
    return true;
  }
  if (rec.count >= RL_MAX) return false;
  rec.count++;
  props.setProperty(key, JSON.stringify(rec));
  return true;
}

function _validateRow(data) {
  if (!data || typeof data !== 'object') return 'not_object';

  const required = ['orderNumber','productId','quantity','fullName','phone','address','date'];
  for (const f of required) {
    if (!data[f] && data[f] !== 0) return 'missing_' + f;
  }

  // Телефон: +380XXXXXXXXX
  if (!/^\+380\d{9}$/.test(String(data.phone || '').trim())) return 'invalid_phone';

  // Кількість: 1–99
  const qty = parseInt(data.quantity);
  if (isNaN(qty) || qty < 1 || qty > 99) return 'invalid_quantity';

  // Артикул: тільки відомі
  if (!PRODUCT_CATALOG[String(data.productId || '').trim()]) return 'unknown_product';

  // Telegram: якщо є — формат @username
  if (data.telegram && data.telegram !== '—') {
    if (!/^@[a-zA-Z0-9_]{4,32}$/.test(String(data.telegram).trim())) return 'invalid_telegram';
  }
  return null;
}

function _sanitize(val, maxLen) {
  if (val == null) return '';
  return String(val)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, maxLen || 200);
}

function _sanitizeRow(data) {
  return {
    orderNumber: _sanitize(data.orderNumber, LIMITS.orderNumber),
    productId:   _sanitize(data.productId,   LIMITS.productId),
    quantity:    _sanitize(data.quantity,     LIMITS.quantity),
    amount:      _sanitize(data.amount,       20),
    fullName:    _sanitize(data.fullName,     LIMITS.fullName),
    phone:       _sanitize(data.phone,        LIMITS.phone),
    telegram:    _sanitize(data.telegram,     LIMITS.telegram),
    address:     _sanitize(data.address,      LIMITS.address),
    date:        _sanitize(data.date,         LIMITS.date),
  };
}

function _logError(fn, msg) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('_logs');
    if (sheet) sheet.appendRow([new Date().toISOString(), 'ERROR', fn, msg.slice(0, 200)]);
  } catch(_) {}
}

function _logSuspicious(reason, ip) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('_logs');
    if (sheet) sheet.appendRow([new Date().toISOString(), 'SUSPICIOUS', reason.slice(0,200), ip]);

    // ── Email-сповіщення адміністратору (розкоментуй і вкажи email) ──
    // MailApp.sendEmail({
    //   to: 'your@email.com',
    //   subject: '[AllPartsHub] Підозріла активність',
    //   body: 'Подія: ' + reason + '\nIP: ' + ip + '\nЧас: ' + new Date().toISOString()
    // });
  } catch(_) {}
}

// ════════════════════════════════════════════════════════════════
// УТИЛІТА: запусти один раз після деплою вручну
// Розширення → Apps Script → Виконати → createLogsSheet
// ════════════════════════════════════════════════════════════════
function createLogsSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName('_logs')) { Logger.log('_logs already exists'); return; }
  const sheet = ss.insertSheet('_logs');
  sheet.appendRow(['Час', 'Тип', 'Подія', 'IP / Деталі']);
  sheet.setFrozenRows(1);
  sheet.getRange('A1:D1').setFontWeight('bold');
  Logger.log('_logs sheet created OK');
}
