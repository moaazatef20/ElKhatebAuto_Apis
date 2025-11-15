const SellRequest = require('../models/sellRequest');
const jwt = require('jsonwebtoken');
const { Parser } = require('json2csv'); // <-- [ 1. تم إضافة هذا السطر]

/**
 * @desc    إرسال طلب بيع سيارة (للزائر أو المستخدم)
 * @route   POST /api/v1/sell-requests
 * @access  Public
 */
exports.submitSellRequest = async (req, res) => {
  try {
    const requestData = req.body;
    let userId = null;
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        console.warn('Invalid token submitted, proceeding as guest.');
      }
    }

    if (userId) {
      requestData.userId = userId;
    }

    const newRequest = await SellRequest.create(requestData);

    res.status(201).json({
      success: true,
      message: 'تم إرسال طلب بيع السيارة بنجاح، سيتم التواصل معك قريبا',
      data: newRequest
    });

  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'بيانات غير مكتملة',
        data: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'حدث خطأ في السيرفر',
      data: null
    });
  }
};

/**
 * @desc    جلب كل طلبات بيع السيارات (للأدمن فقط)
 * @route   GET /api/v1/sell-requests
 * @access  Private (Admin)
 */
exports.getSellRequests = async (req, res) => {
  try {
    const requests = await SellRequest.find()
      .populate('userId', 'username email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'تم جلب جميع طلبات بيع السيارات بنجاح',
      data: requests
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في السيرفر',
      data: null
    });
  }
};

/**
 * @desc    تعديل حالة طلب بيع (للأدمن فقط)
 * @route   PUT /api/v1/sell-requests/:id/status
 * @access  Private (Admin)
 */
exports.updateSellRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;

    const allowedStatus = ['pending', 'reviewed', 'accepted', 'rejected'];
    if (!status || !allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `الرجاء إدخال حالة صالحة (${allowedStatus.join(', ')})`,
        data: null
      });
    }

    let request = await SellRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على الطلب',
        data: null
      });
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      success: true,
      message: `تم تحديث حالة الطلب إلى "${status}" بنجاح`,
      data: request
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في السيرفر',
      data: null
    });
  }
};

// --- 🔽 [ 2. تم إضافة هذه الـ Function بالكامل] 🔽 ---

/**
 * @desc    تصدير عروض البيع (Pending) كملف CSV
 * @route   GET /api/v1/sell-requests/export/pending-csv
 * @access  Private (Admin)
 */
exports.exportSellRequests = async (req, res) => {
  try {
    const requests = await SellRequest.find({ status: 'pending' })
      .populate('userId', 'username email')
      .lean();

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'لا توجد عروض بيع قيد المراجعة (Pending) لتصديرها',
        data: null
      });
    }

    // تحديد الحقول (الأعمدة)
    const fields = [
      { label: 'اسم البائع', value: 'sellerName' },
      { label: 'هاتف البائع', value: 'sellerPhone' },
      { label: 'ماركة السيارة', value: 'make' },
      { label: 'موديل السيارة', value: 'model' },
      { label: 'سنة الصنع', value: 'year' },
      { label: 'الحالة', value: 'condition' },
      { label: 'السعر المطلوب', value: 'askingPrice' },
      { label: 'تاريخ العرض', value: 'createdAt' },
      { label: 'ايميل المستخدم', value: 'userId.email' }
    ];

    // تحويل الـ JSON لـ CSV
    const json2csvParser = new Parser({ fields, excelStrings: true });
    const csv = json2csvParser.parse(requests);

    // إعداد الـ Headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=pending_sell_requests.csv');

    // إرسال الملف
    res.status(200).send(csv);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في السيرفر أثناء تحضير الملف',
      data: null
    });
  }
};