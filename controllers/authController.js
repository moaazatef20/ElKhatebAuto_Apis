const User = require('../models/User'); // استدعاء موديل اليوزر
const bcrypt = require('bcryptjs'); // استدعاء مكتبة التشفير
const jwt = require('jsonwebtoken'); // استدعاء مكتبة التوكن

/**
 * @desc    تسجيل مستخدم جديد
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.registerUser = async (req, res) => {
  try {
    // 1. ناخد البيانات من الطلب (الـ body)
    const { username, email, phone, password } = req.body;

    // 2. نتأكد إن مفيش يوزر بنفس الإيميل
    let user = await User.findOne({ email });
    if (user) {
      // لو اليوزر موجود، نرجع رد بالرفض (متوافق مع الهيكل اللي اتفقنا عليه)
      return res.status(400).json({
        success: false,
        message: 'هذا البريد الإلكتروني مسجل بالفعل',
        data: null
      });
    }

    // 3. لو اليوزر مش موجود، نشفر كلمة السر
    const salt = await bcrypt.genSalt(10); // درجة قوة التشفير
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. ننشئ المستخدم الجديد في الداتابيز
    user = await User.create({
      username,
      email,
      phone,
      password: hashedPassword // بنسجل كلمة السر المشفرة
    });

    // 5. ننشئ توكن (JWT) للمستخدم ده
    const payload = {
      id: user._id,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    // 6. نرجع رد بالنجاح ومعاه التوكن
    res.status(201).json({ // 201 معناها "تم الإنشاء بنجاح"
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      data: {
        token: token,
        // (اختياري: ممكن نرجع بيانات اليوزر بدون الباسورد)
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (err) {
    // لو حصل أي خطأ غير متوقع
    console.error(err.message);
    res.status(500).json({ // 500 معناها "خطأ في السيرفر"
      success: false,
      message: 'حدث خطأ في السيرفر، يرجى المحاولة لاحقاً',
      data: null
    });
  }
};
// ... (الكود بتاع registerUser اللي كتبناه فوق)

/**
 * @desc    تسجيل دخول المستخدم
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.loginUser = async (req, res) => {
  try {
    // 1. ناخد الإيميل والباسورد من الطلب
    const { email, password } = req.body;

    // 2. نتأكد إن الإيميل والباسورد موجودين
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال البريد الإلكتروني وكلمة السر',
        data: null
      });
    }

    // 3. نبحث عن اليوزر في الداتابيز بالإيميل
    const user = await User.findOne({ email });

    // 4. لو اليوزر مش موجود، نرجع خطأ
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة السر غير صحيحة',
        data: null
      });
    }

    // 5. لو اليوزر موجود، نقارن الباسورد المدخل بالباسورد المشفر في الداتابيز
    const isMatch = await bcrypt.compare(password, user.password);

    // 6. لو الباسورد غلط، نرجع نفس الخطأ
    // (مهم: منرجعش خطأ يقول "الباسورد غلط" عشان الأمان)
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة السر غير صحيحة',
        data: null
      });
    }

    // 7. لو كل حاجة تمام، ننشئ توكن (JWT)
    const payload = {
      id: user._id,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    // 8. نرجع رد بالنجاح ومعاه التوكن
    res.status(200).json({ // 200 معناها "OK"
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        token: token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
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