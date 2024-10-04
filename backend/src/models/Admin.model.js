import mongoose from "mongoose";

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    addedMovies: [
        {
            type: Schema.Types.ObjectId,
            ref: "Movie"  
        }
    ]
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin