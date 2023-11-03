const config = require("../config/auth.config");
const { v4: uuidv4 } = require("uuid");

module.exports = mongoose => {
    const refreshTokenSchema = new mongoose.Schema({
        token: String,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        expiryDate: Date
    });

    // refreshTokenSchema.method( "createToken" , (user) => {
    //     let expiredAt = new Date();
    //     expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);
    //     let _token = uuidv4();
    //     // return refreshTokenlet refreshToken = await this.create({
    //     return this.create({
    //         token: _token,
    //         userId: user,
    //         expiryDate: expiredAt.getTime(),
    //     }).then( result => {
    //         return result.token;
    //     });
    // });

    // refreshTokenSchema.method( "verifyExpiration", (token) => {
    //     let expiryDate = new Date(token.expiryDate);
    //     return expiryDate.getTime() < new Date().getTime();
    // });

    refreshTokenSchema.method("toJSON", () => {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    let tokenFactory = {}

    tokenFactory.dbObject = new mongoose.model("refreshToken", refreshTokenSchema);
    tokenFactory.createToken = (user) => {
        let expiredAt = new Date();
        expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);
        let _token = uuidv4();
        // return refreshTokenlet refreshToken = await this.create({
        return tokenFactory.dbObject.create({
            token: _token,
            userId: user,
            expiryDate: expiredAt.getTime(),
        }).then( result => {
            return result.token;
        });
    };
    tokenFactory.verifyExpiration = (token) => {
        let expiryDate = new Date(token.expiryDate);
        return expiryDate.getTime() < new Date().getTime();
    };
    tokenFactory.toJSON = () => {
        const { __v, _id, ...object } = this.dbObject.toObject();
        object.id = _id;
        return object;
    };

    return tokenFactory;
}
