const jwt = require('jsonwebtoken');

/**
 * @desc    Middleware لحماية المسارات والتأكد من التوكن
 */
exports.protect = async (req, res, next) => {
  let token;

  // 1. نتأكد إن الـ header فيه توكن وإن نوعه Bearer
  // (الـ Front-end هيبعت التوكن بالشكل ده: "Bearer <token_string>")
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. نفصل كلمة "Bearer" عن التوكن نفسه
      token = req.headers.authorization.split(' ')[1];

      // 3. نتأكد من صحة التوكن (بنفس الـ SECRET بتاعنا)
      // لو التوكن غلط أو منتهي الصلاحية، الكود هيدخل في الـ catch
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. نحط بيانات اليوزر (اللي جوه التوكن) في الـ req
      // عشان الـ function اللي جاية (الـ controller) تقدر تستخدمها
      
      // decoded ده هيحتوي على { id: '...', role: '...' } 
      // (زي ما عملناه في الـ Controller بتاع الـ login)
      req.user = decoded; 

      // 5. عدي للخطوة الجاية (الـ Controller)
      next();

    } catch (err) {
      // 401 = غير مصرح له (Unauthorized)
      console.error(err.message);
      return res.status(401).json({
        success: false,
        message: 'التوكن غير صالح أو منتهي الصلاحية',
        data: null
      });
    }
  }

  // 5. لو مفيش توكن أصلاً في الـ header
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'غير مصرح لك بالدخول، لا يوجد توكن',
      data: null
    });
  }
};
// ... (الكود بتاع function "protect" موجود فوق)

/**
 * @desc    Middleware للتأكد من صلاحيات المستخدم (مثلاً: admin)
 * @param   {string} role - الصلاحية المطلوبة (مثل 'admin')
 */
exports.authorize = (role) => {
  return (req, res, next) => {
    // 1. الكود ده بيفترض إن "protect" اشتغل قبله وحط اليوزر في req.user
    if (req.user.role !== role) {
      
      // 403 = Forbidden (ممنوع / محظور)
      // معناه: أنا عارف أنت مين (عشان عديت من protect) 
      // بس أنت معندكش صلاحية تعمل الطلب ده
      return res.status(403).json({
        success: false,
        message: `صلاحية "${role}" مطلوبة. أنت غير مصرح لك بالقيام بهذا الإجراء.`,
        data: null
      });
    }

    // 2. لو الصلاحية تمام (admin)، عدي للخطوة الجاية
    next();
  };
};