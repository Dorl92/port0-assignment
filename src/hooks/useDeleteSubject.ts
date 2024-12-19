'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const deleteSubject = async (id: string) => {
  await deleteDoc(doc(db, 'subjects', id));
};

// export const useDeleteSubject = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: deleteSubject,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['subjects'] });
//     },
//   });
// };

// Optimistic Delete
export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubject,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['subjects'] });
      const previousSubjects = queryClient.getQueryData(['subjects']);
      queryClient.setQueryData(['subjects'], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.filter((subject: any) => subject.id !== id);
      });
      return { previousSubjects };
    },

    onError: (err, id, context: any) => {
      if (context?.previousSubjects) {
        queryClient.setQueryData(['subjects'], context.previousSubjects);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};
