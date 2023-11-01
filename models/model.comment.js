
module.exports = mongoose => {
    const commentSchema = new mongoose.Schema({
        comment: String,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        createdAt: Date,
        updatedAt: Date
    });

    commentSchema.pre('save', function (next) {
        let now = Date.now();

        this.updatedAt = now;
        // Set a value for createdAt only if it is null
        if (!this.createdAt) {
            this.createdAt = now;
        }

        // Call the next function in the pre-save chain
        next();
    });

    commentSchema.method("toJSON", () => {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    return new mongoose.model("Comment", commentSchema);
}
/*
    See https://www.bezkoder.com/angular-16-node-js-express-mongodb/#Configure_MongoDB_database_038_Mongoose
    on how to use an existing DB connection to define an entity and to perform the CRUD operations.
 */