'use client';
import { signInWithGoogle } from '@/auth';
import useAuth from '@/hooks/useAuth';
import {
  Button,
  Card,
  Container,
  Flex,
  Group,
  Image,
  Loader,
  Text,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const SignIn = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [loading, user, router]);

  if (loading)
    return (
      <Flex align={'center'} justify={'center'} w={'100vw'} h={'100vh'}>
        <Loader />
      </Flex>
    );

  if (user) return null;

  const handleSignInClick = async () => {
    await signInWithGoogle();
    router.push('/');
  };

  return (
    <Container w={'100vw'} h={'100vh'} p={0}>
      <Flex align={'center'} justify={'center'} w={'100%'} h={'100%'}>
        <Card w={300} shadow="md" padding="lg" radius="md">
          <Card.Section>
            <Image
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
              height={160}
              alt="Norway"
            />
          </Card.Section>
          <Group justify="space-between" mt="md" mb="xs">
            <Text fz={20} fw={500}>
              Get Started
            </Text>
            <Text size="sm" c="dimmed">
              Start with sign in with your Google account
            </Text>
          </Group>
          <Button onClick={handleSignInClick}>Sign In</Button>
        </Card>
      </Flex>
    </Container>
  );
};

export default SignIn;
