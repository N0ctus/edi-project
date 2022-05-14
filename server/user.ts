// dependencies
import { connect, Schema, model, PassportLocalModel, PassportLocalDocument } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import dotenv from 'dotenv';

dotenv.config({
  path: `${__dirname}/../.env`
});

connect(`${process.env["DB_CONNECT"]}/${process.env["DB_NAME"]}`);

const User = new Schema({
  username: String,
  password: String
});
// Export Model
User.plugin(passportLocalMongoose);

const UserModel = model('userData', User, 'userData') as PassportLocalModel<PassportLocalDocument>;

export default UserModel;
