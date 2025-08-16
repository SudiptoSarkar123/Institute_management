const jwt = require('jsonwebtoken')

const authCheck = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[0];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: "Auth failed"
        });
    }
}

module.exports = authCheck