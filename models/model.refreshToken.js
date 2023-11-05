const config = require("../config/auth.config");
const { v4: uuidv4 } = require("uuid");

module.exports = mongoose => {
    let tokenFactory = {};

    const refreshTokenSchema = new mongoose.Schema({
        token: String,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        expiryDate: Date
    });

    tokenFactory.dbModel = new mongoose.model("refreshToken", refreshTokenSchema);

    tokenFactory.createToken = (user) => {
        let expiredAt = new Date();
        expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);
        let _token = uuidv4();
        return tokenFactory.dbModel.create({
            token: _token,
            userId: user,
            expiryDate: expiredAt.getTime(),
        }).then( result => {
            return result.token;
        });
    };

    tokenFactory.verifyExpiration = (token) => {
        console.log('token: ', token);
        let expiryDate = new Date(token.expiryDate);
        console.log('Expiration date: ', expiryDate);
        return expiryDate.getTime() < new Date().getTime();
    };

    tokenFactory.toJSON = () => {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    };

    return tokenFactory;
}
