import UserModel from './models/user';

UserModel.register({ username: 'admin', active: false , admin: true} as any, '1234');

console.log('Dummy data created!');