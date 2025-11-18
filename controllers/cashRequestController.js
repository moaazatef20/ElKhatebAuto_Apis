// ./controllers/cashRequestController.js
const CashRequest = require('../models/cashRequest');

/**
 * @desc    إرسال طلب شراء كاش
 * @route   POST /api/v1/cash-requests
 * @access  Public
 */
exports.submitCashRequest = async (req, res) => {
  try {
    // [الكود الذكي] بيقرأ كل حاجة ويبعتها للموديل
    const newRequest = await CashRequest.create(req.body);

    res.status(201).json({
      success: true,
      message: 'تم إرسال طلبك بنجاح، سيتم التواصل معك قريباً',
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
 * @desc    جلب كل طلبات الشراء الكاش (للأدمن)
 * @route   GET /api/v1/cash-requests
 * @access  Private (Admin)
 */
exports.getCashRequests = async (req, res) => {
  try {
    // --- [ 🔽 التعديل هنا 🔽 ] ---
    // ضفنا .populate('carId') عشان يجيب تفاصيل العربية بدل الـ ID بس
    const requests = await CashRequest.find()
      .populate('carId') 
      .sort({ createdAt: -1 });
    // --- [ 🔼 نهاية التعديل 🔼 ] ---

    res.status(200).json({
      success: true,
      message: 'تم جلب جميع طلبات الشراء الكاش بنجاح',
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
 * @desc    تعديل حالة طلب شراء كاش (للأدمن)
 * @route   PUT /api/v1/cash-requests/:id/status
 * @access  Private (Admin)
 */
exports.updateCashRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;

    const allowedStatus = ['new', 'contacted', 'completed'];
    if (!status || !allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `الرجاء إدخال حالة صالحة (${allowedStatus.join(', ')})`,
        data: null
      });
    }

    let request = await CashRequest.findById(requestId);

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