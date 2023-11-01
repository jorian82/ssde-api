module.exports = mongoose => {
    const postSchema = new mongoose.Schema({
        title: String,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        content: String,
        createdAt: Date,
        updatedAt: Date,
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ]
    });

    postSchema.pre('save', (next) => {
        let now = Date.now();

        this.updatedAt = now;
        // Set a value for createdAt only if it is null
        if (!this.createdAt) {
            this.createdAt = now;
        }

        // Call the next function in the pre-save chain
        next();
    });

    postSchema.method("toJSON", () => {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    return new mongoose.model("Post", postSchema);
}
