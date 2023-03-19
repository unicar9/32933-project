import { MantineProvider, Text } from '@mantine/core';
import { RegistrationForm } from './components/RegistrationForm';

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Text>Welcome to Mantine!</Text>
      <RegistrationForm />
    </MantineProvider>
  );
}

export default App;
