import mongoose , {Schema, model, models} from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
}, {
    timestamps: true,
})


//This pre-save hook hashes the password before saving it to the database.
userSchema.pre('save', async function (next) {
    if(this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        // Generate a salt with 10 rounds that means it will take longer to hash
        // the password, making it more secure.
        this.password = await bcrypt.hash(this.password, salt);
        // Ensure the password is hashed before saving
    }
    next();
})

const User = models?.User || model<IUser>('User', userSchema);
// If the User model already exists, use it; otherwise, create a new one.

export default User;