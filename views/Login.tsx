import React from 'react';
import {StyleSheet, Text} from 'react-native';
import LoginScreen from 'react-native-login-screen';
function Login() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  return (
    <LoginScreen
      logoImageSource={require('../assets/logo.png')}
      onLoginPress={() => {}}
      onSignupPress={() => {}}
      onEmailChange={setUsername}
      signupText="Crea una nueva cuenta"
      loginButtonText="Iniciar sesión"
      onPasswordChange={setPassword}
      emailContentTooltip={
        <Text>
          Ese <Text style={styles.emailHighlight}>Email</Text> no se ve bien...
        </Text>
      }
      passwordContentTooltip={
        <Text>
          <Text style={styles.emailHighlight}>Password</Text> incorrecto
        </Text>
      }
      enablePasswordValidation
    />
  );
}

const styles = StyleSheet.create({
  emailHighlight: {
    fontWeight: '600',
    color: '#7F02B6',
  },
});

export default Login;
