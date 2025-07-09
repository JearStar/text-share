import api from './axios';

export function signupUser(name: string, email: string, password: string) {
    return api.post('/api/auth/signup', { name, email, password });
}

export function loginUser(email: string, password: string) {
    return api.post('/api/auth/login', { email, password });
}