import AuthForm from "../components/AuthForm";
import { auth_inputs } from "../utils/helpers";

const Login = () => {
  return (
    <AuthForm method="login" inputs={auth_inputs[1].inputs} route="/api/auth/token/" />
  )
}

export default Login