const validator = require('validator');

module.exports = mongoose => {
    const userSchema = new mongoose.Schema({
        username: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            validate: (value) => {
                return validator.isAlphanumeric(value);
            }
        },
        firstName: {
            type: String,
            validate: (value) => {
                return validator.isAlpha(value);
            }
        },
        lastName: {
            type: String,
            validate: (value) => {
                return validator.isAlpha(value);
            }
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: (value) => {
                return validator.isEmail(value);
            }
        },
        password: {
            type: String,
            required: true,
            validate: (value) => {
                return validator.isStrongPassword(value) //.isAlphanumeric(value);
            }
        },
        createdAt: Date,
        updatedAt: Date,
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }
        ]
    });

    userSchema.virtual('fullName').set((name) => {
        let str = name.split(' ');

        if (str.size > 1) {
            this.firstName = str[0];
            this.lastName = str[1];
        } else {
            this.firstName = name;
        }
    });

    userSchema.virtual('fullName').get(() => {
        return this.firstName + ' ' + this.lastName;
    });

    userSchema.methods.getInitials = function () {
        return this.firstName[0] + this.lastName[0];
    };

    userSchema.pre('save', function (next) {
        let now = Date.now();

        this.updatedAt = now;
        // Set a value for createdAt only if it is null
        if (!this.createdAt) {
            this.createdAt = now;
        }

        // Call the next function in the pre-save chain
        next();
    });

    userSchema.method("toJSON", () => {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model("User", userSchema);
}