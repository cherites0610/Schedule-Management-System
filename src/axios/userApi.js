import request from './index'

export const login = (userName, encryptedPassword) => request.post('/login', { userName: userName, encryptedPassword: encryptedPassword });

export const auth = (token) => request.post('/auth', { token: token });