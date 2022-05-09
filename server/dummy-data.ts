import UserModel from './user';

UserModel.register({ username: 'admin', active: false } as any, '1234');

console.log('Dummy data created!');