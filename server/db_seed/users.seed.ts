import { PassportLocalDocument } from "mongoose";
import UserModel from "../models/user";

const batch: Array<Promise<PassportLocalDocument>> = []

// Admin
batch.push(UserModel.register({ username: 'admin', active: false , admin: true} as any, '1234'));
// Other users
batch.push(UserModel.register({ username: 'intrepid', active: false , admin: false} as any, 'penguin'));
batch.push(UserModel.register({ username: 'lucid', active: false , admin: false} as any, 'geko'));

Promise.all(batch).then(() => {
    console.log('Seed users created!');
    return 0;
})
.catch(err => console.error(err));
