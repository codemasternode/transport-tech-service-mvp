import jwt from 'jsonwebtoken'

export async function verifyToken(req, res, next) {
    const token = req.cookies.token
    try {
        if (!token) {
            return res.status(401).send({
                msg: "Authentication required"
            })
        }
        const decrypt = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            email: decrypt.email
        };
        next();
    } catch (err) {
        return res.status(401).send({
            msg: "Your token expired"
        });
    }
};
