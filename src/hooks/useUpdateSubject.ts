import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UpdateSubjectData } from '@/interfaces/updated-subject';

const updateSubject = async (id: string, updatedData: UpdateSubjectData) => {
  const subjectRef = doc(db, 'subjects', id);
  await updateDoc(subjectRef, {
    subject: updatedData.subject,
    score: updatedData.score,
  });
};

// export const useUpdateSubject = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({
//       id,
//       updatedData,
//     }: {
//       id: string;
//       updatedData: UpdateSubjectData;
//     }) => updateSubject(id, updatedData),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['subjects'] });
//     },
//   });
// };

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      updatedData,
    }: {
      id: string;
      updatedData: UpdateSubjectData;
    }) => updateSubject(id, updatedData),
    onMutate: async ({
      id,
      updatedData,
    }: {
      id: string;
      updatedData: UpdateSubjectData;
    }) => {
      await queryClient.cancelQueries({ queryKey: ['subjects'] });
      const previousSubjects = queryClient.getQueryData(['subjects']);
      queryClient.setQueryData(['subjects'], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((subject: any) =>
          subject.id === id ? { ...subject, ...updatedData } : subject
        );
      });
      return { previousSubjects };
    },
    onError: (err, variables, context: any) => {
      if (context?.previousSubjects) {
        queryClient.setQueryData(['subjects'], context.previousSubjects);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};
