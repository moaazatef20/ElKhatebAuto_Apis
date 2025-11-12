const User = require('../models/user');

/**
 * @desc    جلب كل العملاء (للأدمن فقط)
 * @route   GET /api/v1/users
 * @access  Private (Admin)
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'تم جلب جميع العملاء بنجاح',
      data: users
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
 * @desc    جلب الملف الشخصي للمستخدم المسجل
 * @route   GET /api/v1/users/me
 * @access  Private
 */
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على المستخدم',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'تم جلب بيانات الملف الشخصي بنجاح',
      data: user
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