import {
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  InputField,
  Button,
  Box,
  Divider,
  Center,
  AlertCircleIcon,
  ButtonIcon,
  AddIcon,
} from '@gluestack-ui/themed';

import React, {useState} from 'react';
import {
  Input,
  Toast,
  HStack,
  VStack,
  ButtonText,
  Image,
  Heading,
  FormControl,
  FormControlLabel,
  useToast,
  ToastDescription,
  Pressable,
  Icon,
  CloseIcon,
} from '@gluestack-ui/themed';
import {SafeAreaView} from 'react-native';
import globalStyles from '../styles/Global';
import type {StackNavigationProp} from '@react-navigation/stack';
import {gql, useMutation} from '@apollo/client';
import AsyncStorage from '@react-native-community/async-storage';

const AUTENTICAR_USUARIO = gql`
  mutation AutenticarUsuario($input: AutenticarInput) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`;

type RootStackParamList = {
  CrearCuenta: undefined;
};

type LoginProps = React.PropsWithChildren<{
  navigation: StackNavigationProp<RootStackParamList, 'CrearCuenta'>;
}>;

function NVLogin({navigation: {navigate}}: LoginProps) {
  const [email, guardarEmail] = useState('');
  const [password, guardarPassword] = useState('');

  const [inEmail, setInEmail] = useState(false);
  const [inPassword, setInPassword] = useState(false);
  const [crearUsuario] = useMutation(AUTENTICAR_USUARIO);

  const toast = useToast();

  async function handleSubmit() {
    //validar
    email === '' ? setInEmail(true) : setInEmail(false);
    password === '' ? setInPassword(true) : setInPassword(false);

    if (email === '' || password === '') {
      mostrarAlerta('Debes llenar todos los campos', 'error');
      return;
    }

    //Guardar el usuario
    try {
      const {data} = await crearUsuario({
        variables: {
          input: {
            email,
            password,
          },
        },
      });

      const {token} = data.autenticarUsuario;

      await AsyncStorage.setItem('token', token);

      // navigate('Login');
    } catch (error: any) {
      mostrarAlerta(error.message.replace('GraphQL error: ', ''), 'error');
    }
  }

  const mostrarAlerta = (
    message: string,
    status: 'error' | 'warning' | 'success' | 'info' | 'attention' | undefined,
  ) => {
    toast.show({
      placement: 'bottom',
      render: ({id}) => {
        return (
          <>
            <Toast nativeID={id} action={status} variant={'solid'}>
              <VStack space="md">
                <ToastDescription>{message}</ToastDescription>
              </VStack>
              <Pressable onPress={() => toast.close(id)}>
                <Icon as={CloseIcon} />
              </Pressable>
            </Toast>
          </>
        );
      },
    });
  };

  return (
    <SafeAreaView>
      <Box justifyContent="center" padding={20}>
        <VStack space="lg">
          <Heading
            size="2xl"
            style={[globalStyles.headings, {textAlign: 'center'}]}>
            UpTask
          </Heading>
          <Center mb="$2">
            <Image
              alt="logo"
              size="xl"
              source={require('../assets/task.png')}
            />
          </Center>

          <FormControl
            isInvalid={inPassword}
            size={'md'}
            isDisabled={false}
            isRequired={true}>
            <FormControlLabel>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                defaultValue=""
                placeholder="paolo@gmail.com"
                onChangeText={texto => guardarEmail(texto.toLowerCase())}
              />
            </Input>

            <FormControlHelper>
              <FormControlHelperText>
                Email válido buena onda...
              </FormControlHelperText>
            </FormControlHelper>

            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                Debe ser un email válido
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          <FormControl
            isInvalid={inEmail}
            size={'md'}
            isDisabled={false}
            isRequired={true}>
            <FormControlLabel>
              <FormControlLabelText>Password</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="password"
                placeholder="password"
                secureTextEntry={true}
                onChangeText={texto => guardarPassword(texto)}
              />
            </Input>

            <FormControlHelper>
              <FormControlHelperText>
                Al menos 6 caracteres (Y apuntala...)
              </FormControlHelperText>
            </FormControlHelper>

            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                Requeridos al menos 6 caracteres.
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          <Button
            mt="$3"
            size="md"
            variant="solid"
            action="primary"
            isDisabled={false}
            onPress={handleSubmit}
            isFocusVisible={false}>
            <ButtonText>Iniciar sesión</ButtonText>
          </Button>
          <Button
            size="md"
            onPress={() => navigate('CrearCuenta')}
            variant="link"
            action="secondary"
            isDisabled={false}
            isFocusVisible={false}>
            <ButtonText>Crear cuenta</ButtonText>
          </Button>
          <Center>
            <Divider my="$0.5" />
          </Center>

          <HStack justifyContent="space-around" space="md">
            <Button
              size="sm"
              variant="outline"
              action="secondary"
              isDisabled={true}
              isFocusVisible={false}>
              <ButtonIcon as={AddIcon} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              action="secondary"
              isDisabled={true}
              isFocusVisible={false}>
              <ButtonIcon as={AddIcon} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              action="secondary"
              isDisabled={true}
              isFocusVisible={false}>
              <ButtonIcon as={AddIcon} />
            </Button>
          </HStack>
        </VStack>
      </Box>
    </SafeAreaView>
  );
}

export default NVLogin;
