import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true},
    ciudad: { type: String },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

userSchema.pre('save', function(){
    console.log(`👤 Guardado como usuario: ${this.nombre}`);    
})

userSchema.post('find', function(result) {
    console.log(`🔎 Se consultaron por ${result.length} usuarios`);
});

export const UserModel = mongoose.model("User", userSchema);
