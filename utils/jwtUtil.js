const jwt = require('jsonwebtoken');

function genToken(id, roleId) {
    const accessToken = jwt.sign(
        {
            id: id,
            roleId: roleId
        },
        process.env.JWT_KEY,
        { expiresIn: process.env.EXPIRE_TIME }
    );
    return {
        accessToken
    };
}

module.exports.genToken = genToken;
