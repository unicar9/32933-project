import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { PasswordInput, TextInput, Button } from '@mantine/core';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface FormData {
  username: string;
  password: string;
}

interface Props {
  onSubmit: (data: FormData) => void;
}

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

export const RegistrationForm = ({ onSubmit }: any) => {
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  // const { theme } = useMantineTheme();
  const { errors } = formState;

  const handleFormSubmit: SubmitHandler<FormData> = async (data) => {
    const response = await axios.post('/register', data);

    onSubmit(response.data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <TextInput
        label="Username"
        {...register('username')}
        error={errors.username?.message}
      />
      <PasswordInput
        label="Password"
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />
      <Button type="submit">Register</Button>
    </form>
  );
};
