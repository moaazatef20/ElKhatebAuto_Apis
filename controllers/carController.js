const Car = require('../models/car');

/**
 * @desc    إضافة سيارة جديدة (للأدمن فقط)
 * @route   POST /api/v1/cars
 * @access  Private (Admin)
 */
exports.addCar = async (req, res) => {
  try {
    // --- [ 🔽 رجعنا للطريقة اليدوية (قبل التعديل) 🔽 ] ---
    const { make, model, year, price, description, images, color, category, transmission } = req.body;

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
      images,
      color,
      category,
      transmission
    });
    // --- [ 🔼 نهاية التعديل 🔼 ] ---

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

/**
 * @desc    جلب كل السيارات (المتاحة والمباعة)
 * @route   GET /api/v1/cars
 * @access  Public
 */
exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'تم جلب جميع السيارات بنجاح',
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
    const car = await Car.findOne({ _id: req.params.id });

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
    // --- [ 🔽 رجعنا للطريقة اليدوية (قبل التعديل) 🔽 ] ---
    // (الطريقة دي كانت أصلاً ذكية، بس إحنا بنأكد إنها مبتجيبش minDownPayment)
    const updates = req.body; 
    // --- [ 🔼 نهاية التعديل 🔼 ] ---

    let car = await Car.findOne({ _id: carId });

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
    const car = await Car.findOne({ _id: req.params.id });

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