import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude } from "class-transformer";

export type UserDocument = Document & {
    email: string;
    password: string;
};

@Schema({ toJSON: { transform(doc, ret) {
    ret.id = ret._id;

    delete ret._id;
    delete ret.password;
    delete ret.__v;
} } })
export class User {
    @Prop()
    email: string;

    @Prop()
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
