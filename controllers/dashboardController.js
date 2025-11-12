const User = require('../models/user');
const Car = require('../models/car');
const InstallmentRequest = require('../models/InstallmentRequest');
const SellRequest = require('../models/SellRequest');

/**
 * @desc    جلب إحصائيات لوحة التحكم (للأدمن فقط)
 * @route   GET /api/v1/dashboard/stats
 * @access  Private (Admin)
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const availableCars = await Car.countDocuments({ isAvailable: true });
    
    const pendingInstallments = await InstallmentRequest.countDocuments({
      status: 'pending'
    });
    const pendingSellRequests = await SellRequest.countDocuments({
      status: 'pending'
    });
    
    const totalCars = await Car.countDocuments();
    const totalInstallmentRequests = await InstallmentRequest.countDocuments();
    const totalSellRequests = await SellRequest.countDocuments();


    const stats = {
      totalUsers,
      availableCars,
      totalCars,
      pendingInstallments,
      totalInstallmentRequests,
      pendingSellRequests,
      totalSellRequests
    };

    res.status(200).json({
      success: true,
      message: 'تم جلب الإحصائيات بنجاح',
      data: stats
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