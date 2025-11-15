const Car = require('../models/car'); // استدعاء موديل السيارة

// ... (الأكواد التانية بتاعة getCars, getCarById فوق)

/**
 * @desc    إضافة سيارة جديدة (للأدمن فقط)
 * @route   POST /api/v1/cars
 * @access  Private (Admin)
 */
exports.addCar = async (req, res) => {
  try {
    // --- 🔽 رجعنا نقرأ كل حاجة من الـ body 🔽 ---
    const { make, model, year, price, description, images } = req.body;

    // نتأكد إن اللينكات جاتلنا
    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'يجب رفع صورة واحدة على الأقل (اللينك بتاعها)',
        data: null
      });
    }

    const newCar = await Car.create({
      make,
      model,
      year,
      price,
      description,
      images // بنحفظ اللينكات اللي جاتلنا
    });
    // --- 🔼 ---

    res.status(201).json({
      success: true,
      message: 'تم إضافة السيارة بنجاح',
      data: newCar
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

// ... (باقي الأكواد بتاعة updateCar, deleteCar تحت)
/**
 * @desc    جلب كل السيارات المتاحة
 * @route   GET /api/v1/cars
 * @access  Public
 */
exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'تم جلب جميع السيارات المتاحة بنجاح',
      data: cars
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
 * @desc    جلب سيارة واحدة بالتفاصيل
 * @route   GET /api/v1/cars/:id
 * @access  Public
 */
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على السيارة',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'تم العثور على السيارة بنجاح',
      data: car
    });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على السيارة (Invalid ID)',
        data: null
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
 * @desc    تعديل بيانات سيارة (للأدمن فقط)
 * @route   PUT /api/v1/cars/:id
 * @access  Private (Admin)
 */
exports.updateCar = async (req, res) => {
  try {
    const carId = req.params.id;
    const updates = req.body;

    let car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على السيارة',
        data: null
      });
    }

    car = await Car.findByIdAndUpdate(carId, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'تم تعديل بيانات السيارة بنجاح',
      data: car
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
 * @desc    مسح سيارة (للأدمن فقط)
 * @route   DELETE /api/v1/cars/:id
 * @access  Private (Admin)
 */
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على السيارة',
        data: null
      });
    }

    await car.deleteOne();

    res.status(200).json({
      success: true,
      message: 'تم مسح السيارة بنجاح',
      data: {}
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