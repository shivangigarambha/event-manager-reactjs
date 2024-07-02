import axios from 'axios';
import { json, redirect } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get('mode') || 'login';

  if (mode !== 'login' && mode !== 'signup') {
    throw json({ message: 'Unsupported mode.' }, { status: 422 });
  }

  const data = await request.formData();
  const authData = {
    email: data.get('email'),
    password: data.get('password')
  }

  try {
    const response = await axios.post(
      `http://localhost:8080/${mode}`,
      authData,
      { headers: { 'Content-Type': 'application/json' } }
    );
    const resData = response.data;
    const token = resData.token;
    localStorage.setItem('token', token);

    let expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);
    localStorage.setItem('ttl', expiration.toISOString());

    return redirect('/')
  } catch(error) {
    if (error.response.status === 422 || error.response.status === 401) {
      return error.response.data;
    }
    return json({ message: 'Could not authenticate user.'}, { status: 500 });
  }
}