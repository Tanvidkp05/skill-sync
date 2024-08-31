const jwt = require('jsonwebtoken');
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('Authorization Header:', authHeader); // Log the authorization header

    const token = authHeader && authHeader.split(' ')[1]; // Extract token

    if (token == null) return res.sendStatus(401); // If no token

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token Verification Error:', err); // Log verification error
            return res.sendStatus(403); // Invalid token
        }

        req.user = user.user; // Attach user to request object
        next();
    });
};

module.exports = authenticateToken;
