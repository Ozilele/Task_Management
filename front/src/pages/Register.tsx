import AuthForm from '../components/AuthForm';
import { auth_inputs } from '../utils/helpers';

const Register = () => {
  return (
    <AuthForm method="register" inputs={auth_inputs[0].inputs} route="/api/auth/register/"/>
  )
}

export default Register