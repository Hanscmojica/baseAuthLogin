const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            message: 'Email y contraseña son requeridos' 
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            message: 'Formato de email inválido' 
        });
    }

    if (password.length < 6) {
        return res.status(400).json({ 
            message: 'La contraseña debe tener al menos 6 caracteres' 
        });
    }

    next();
};

module.exports = { validateLogin };