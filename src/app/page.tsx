'use client';
import {
  AppShell,
  Button,
  Flex,
  Group,
  Image,
  Loader,
  Text,
} from '@mantine/core';
import useAuth from '@/hooks/useAuth';
import Table from '@/components/Table/Table';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { signOut } from '@/auth';

const Home = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading)
    return (
      <Flex align={'center'} justify={'center'} w={'100vw'} h={'100vh'}>
        <Loader />
      </Flex>
    );

  if (!user) return null;

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md">
          <Flex w={'100%'} align={'center'} justify={'space-between'}>
            <Image
              h={'auto'}
              w={'60px'}
              src={
                'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJqSTM2U0ZBUHp6anhHdE9NMUZDREl5NFZaRCJ9?width=200 1x,https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJqSTM2U0ZBUHp6anhHdE9NMUZDREl5NFZaRCJ9?width=00 2x'
              }
            />
            <Flex align={'center'}>
              <Text mr={'20px'}>Hello, {user.displayName}</Text>
              <Button onClick={signOut}>Logout</Button>
            </Flex>
          </Flex>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Table />
      </AppShell.Main>
    </AppShell>
  );
};

export default Home;
