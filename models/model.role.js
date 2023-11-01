const validator = require('validator');

module.exports = mongoose => {
    const roleSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate: (value) => {
                return validator.isAlpha(value);
            }
        }
    });

    roleSchema.method("toJSON", () => {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model('Role', roleSchema);
}