'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  collection,
  getDocs,
  query,
  limit,
  where,
  startAfter,
  DocumentSnapshot,
  orderBy,
  OrderByDirection,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Subject } from '@/interfaces/subject';
import useAuth from './useAuth';

const fetchSubjects = async ({
  pageParam,
  queryKey,
}: {
  pageParam: DocumentSnapshot | undefined;
  queryKey: string[];
}) => {
  const [, userId, sortBy, order] = queryKey;
  const q = query(
    collection(db, 'subjects'),
    orderBy(sortBy, order as OrderByDirection),
    limit(10),
    where('userId', '==', userId),
    ...(pageParam ? [startAfter(pageParam)] : [])
  );

  const documentSnapshots = await getDocs(q);

  const lastVisible =
    documentSnapshots.docs[documentSnapshots.docs.length - 1] || null;

  const subjects: Subject[] = documentSnapshots.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Subject[];

  return {
    subjects,
    nextCursor: lastVisible,
  };
};

export const useGetSubjects = ({
  sortBy = 'subject',
  order = 'asc',
}: {
  sortBy: string;
  order: 'asc' | 'desc';
}) => {
  const { user } = useAuth();
  return useInfiniteQuery({
    queryKey: ['subjects', user?.uid || '', sortBy, order],
    queryFn: fetchSubjects,
    initialPageParam: undefined,
    enabled: !!user,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};
