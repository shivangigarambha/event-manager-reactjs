import { redirect } from 'react-router-dom';

export function getTokenDuration() {
  const ttl = new Date(localStorage.getItem('ttl'));
  const now = new Date();
  return ttl.getTime() - now.getTime();
}

export function getAuthToken() {
  const token = localStorage.getItem('token');

  if (!token) return null;

  const tokenDuration = getTokenDuration();
  if(tokenDuration < 0) return 'EXPIRED';
  
  return token;
}

export function tokenLoader() {
  return getAuthToken();
}

export function checkAuthLoader() {
  const token = getAuthToken();

  if (!token) {
    return redirect('/auth');
  }

  return null;
}