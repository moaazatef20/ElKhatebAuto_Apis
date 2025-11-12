const InstallmentRequest = require('../models/InstallmentRequest');
const jwt = require('jsonwebtoken');

/**
 * @desc    إرسال طلب تقسيط جديد (للزائر أو المستخدم)
 * @route   POST /api/v1/requests
 * @access  Public
 */
exports.submitInstallmentRequest = async (req, res) => {
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

    const newRequest = await InstallmentRequest.create(requestData);

    res.status(201).json({
      success: true,
      message: 'تم إرسال طلب التقسيط بنجاح، سيتم التواصل معك قريبا',
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
 * @desc    جلب كل طلبات التقسيط (للأدمن فقط)
 * @route   GET /api/v1/requests
 * @access  Private (Admin)
 */
exports.getInstallmentRequests = async (req, res) => {
  try {
    const requests = await InstallmentRequest.find()
      .populate('userId', 'username email phone')
      .populate('carId', 'make model year')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'تم جلب جميع طلبات التقسيط بنجاح',
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
 * @desc    جلب طلبات التقسيط الخاصة بالمستخدم المسجل
 * @route   GET /api/v1/requests/my-requests
 * @access  Private (User)
 */
exports.getMyInstallmentRequests = async (req, res) => {
  try {
    const requests = await InstallmentRequest.find({ userId: req.user.id })
      .populate('carId', 'make model year price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'تم جلب طلباتك بنجاح',
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
 * @desc    تعديل حالة طلب تقسيط (قبول/رفض)
 * @route   PUT /api/v1/requests/:id/status
 * @access  Private (Admin)
 */
exports.updateInstallmentRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال حالة صالحة (pending, approved, rejected)',
        data: null
      });
    }

    let request = await InstallmentRequest.findById(requestId);

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