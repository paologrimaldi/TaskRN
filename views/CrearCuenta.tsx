import {Icon, CloseIcon, CheckIcon, Pressable} from '@gluestack-ui/themed';
import {MessageCircle, AlertTriangleIcon} from 'lucide-react-native';

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
  useToast,
  ToastTitle,
  ToastDescription,
  HStack,
  VStack,
  ButtonText,
  Heading,
  FormControl,
  FormControlLabel,
} from '@gluestack-ui/themed';
import {SafeAreaView} from 'react-native';
import globalStyles from '../styles/Global';
import type {StackNavigationProp} from '@react-navigation/stack';
import {gql, useMutation} from '@apollo/client';

const NUEVA_CUENTA = gql`
  mutation CrearUsuario($input: UsuarioInput) {
    crearUsuario(input: $input)
  }
`;
type RootStackParamList = {
  Login: undefined;
};

type LoginProps = React.PropsWithChildren<{
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
}>;

function CrearCuenta({navigation: {navigate}}: LoginProps) {
  //React navigation
  const [nombre, guardarNombre] = useState('');
  const [email, guardarEmail] = useState('');
  const [password, guardarPassword] = useState('');

  const [inNombre, setInNombre] = useState(false);
  const [inEmail, setInEmail] = useState(false);
  const [inPassword, setInPassword] = useState(false);
  const [crearUsuario] = useMutation(NUEVA_CUENTA);

  const toast = useToast();

  async function handleSubmit() {
    //validar
    nombre === '' ? setInNombre(true) : setInNombre(false);
    email === '' ? setInEmail(true) : setInEmail(false);
    password === '' ? setInPassword(true) : setInPassword(false);

    if (nombre === '' || email === '' || password === '') {
      mostrarAlerta('Debes llenar todos los campos', 'error');
      return;
    }
    //al menos 6 characters
    if (password.length < 6) {
      mostrarAlerta('Tu password es muy corto.', 'error');
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

      mostrarAlerta(data.crearUsuario, 'success');
      navigate('Login');
    } catch (error: any) {
      mostrarAlerta(error.message.replace('GraphQL error: ', ''), 'error');
    }
  }

  const mostrarAlerta = (
    message: string,
    status: 'error' | 'warning' | 'success' | 'info' | 'attention' | undefined,
  ) => {
    toast.show({
      placement: 'bottom right',
      render: ({id}) => {
        return (
          <>
            <Toast nativeID={id} action={status} variant={'solid'}>
              <VStack space="xs">
                <ToastDescription>{message}</ToastDescription>
              </VStack>
              <Pressable m={10} onPress={() => toast.close(id)}>
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

          <FormControl
            isInvalid={inNombre}
            size={'md'}
            isDisabled={false}
            isRequired={true}>
            <FormControlLabel>
              <FormControlLabelText>Nombre</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                defaultValue=""
                placeholder="Juan Lopez"
                onChangeText={texto => guardarNombre(texto)}
              />
            </Input>

            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>Debes poner un nombre</FormControlErrorText>
            </FormControlError>
          </FormControl>

          <FormControl
            isInvalid={inEmail}
            size={'md'}
            isDisabled={false}
            isRequired={true}>
            <FormControlLabel>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                keyboardType="email-address"
                textTransform="lowercase"
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
            isInvalid={inPassword}
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
            isFocusVisible={false}
            onPress={handleSubmit}>
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

export default CrearCuenta;
