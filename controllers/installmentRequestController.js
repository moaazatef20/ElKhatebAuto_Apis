const InstallmentRequest = require('../models/installmentRequest');
const jwt = require('jsonwebtoken');
const { Parser } = require('json2csv');

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

/**
 * @desc    تصدير الطلبات (Pending) كملف CSV
 * @route   GET /api/v1/requests/export/pending-csv
 * @access  Private (Admin)
 */
exports.exportPendingRequests = async (req, res) => {
  try {
    // [1. تعديل] جبنا 'make' و 'model' عشان نظهرهم
    const requests = await InstallmentRequest.find({ status: 'pending' })
      .populate('userId', 'username email')
      .populate('carId', 'make model') 
      .lean();

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'لا توجد طلبات قيد المراجعة (Pending) لتصديرها',
        data: null
      });
    }

    // --- [ 2. تعديل] ---
    // هنعمل "تجهيز" للداتا قبل ما نحولها
    const formattedData = requests.map(req => {
      let carDescription = 'N/A';
      
      // هنا بنشوف لو العربية جاية من الموقع ولا العميل كاتبها
      if (req.carId && req.carId.make) {
        carDescription = `${req.carId.make} ${req.carId.model}`;
      } else if (req.customCarDescription) {
        carDescription = req.customCarDescription; // <-- دي اللي كانت ناقصة
      }

      // هنا بنظبط صيغة التاريخ والوقت
      const formattedDate = new Date(req.createdAt).toLocaleString('ar-EG-u-nu-latn', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      // بنرجع "صف" جديد جاهز للـ CSV
      return {
        applicantName: req.applicantName,
        applicantPhone: req.applicantPhone,
        address: req.address,
        workType: req.workType,
        downPayment: req.downPayment,
        status: req.status,
        formattedDate: formattedDate, // <-- التاريخ المتعدل
        carDescription: carDescription, // <-- السيارة المتعدلة
        userEmail: req.userId ? req.userId.email : 'زائر'
      };
    });
    // --- [نهاية التعديل] ---


    // 3. تحديد الحقول (الأعمدة) الجديدة
    const fields = [
      { label: 'اسم العميل', value: 'applicantName' },
      { label: 'رقم الهاتف', value: 'applicantPhone' },
      { label: 'العنوان', value: 'address' },
      { label: 'نوع العمل', value: 'workType' },
      { label: 'المقدم', value: 'downPayment' },
      { label: 'حالة الطلب', value: 'status' },
      { label: 'تاريخ الطلب', value: 'formattedDate' },
      { label: 'السيارة المطلوبة', value: 'carDescription' },
      { label: 'ايميل المستخدم', value: 'userEmail' }
    ];

    // 4. تحويل الداتا الجديدة لـ CSV
    const json2csvParser = new Parser({ fields, excelStrings: true });
    const csv = json2csvParser.parse(formattedData);

    // 5. إعداد الـ Headers
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=pending_requests.csv');
    
    // 6. إرسال الملف (مع BOM عشان يدعم العربي في Excel)
    const csvWithBom = '\uFEFF' + csv;
    res.status(200).send(csvWithBom);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في السيرفر أثناء تحضير الملف',
      data: null
    });
  }
};
/**
 * @desc    إضافة أو تعديل ملاحظات الأدمن على طلب
 * @route   PUT /api/v1/requests/:id/notes
 * @access  Private (Admin)
 */
exports.addInstallmentRequestNote = async (req, res) => {
  try {
    const { notes } = req.body;
    const requestId = req.params.id;

    // 1. نتأكد إن الـ notes جاية (حتى لو فاضية)
    if (notes === undefined) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إرسال حقل الملاحظات (notes)',
        data: null
      });
    }

    // 2. ندور على الطلب
    let request = await InstallmentRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على الطلب',
        data: null
      });
    }

    // 3. نحدث الملاحظة ونحفظ
    request.notes = notes;
    await request.save();

    // 4. نرجع الرد بالنجاح
    res.status(200).json({
      success: true,
      message: 'تم حفظ الملاحظات بنجاح',
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