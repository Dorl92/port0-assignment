'use client';
import { useState } from 'react';
import EditRowModal from '@/components/EditRowModal/EditRowModal';
import { useDeleteSubject } from '@/hooks/useDeleteSubject';
import { useGetSubjects } from '@/hooks/useGetSubjects';
import { useUpdateSubject } from '@/hooks/useUpdateSubject';
import { Subject } from '@/interfaces/subject';
import { UpdateSubjectData } from '@/interfaces/updated-subject';
import { ActionIcon, Container, Group } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';

const Table = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<Subject | null>(null);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Subject>>({
    columnAccessor: 'score',
    direction: 'desc',
  });

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetSubjects({
      sortBy: sortStatus.columnAccessor,
      order: sortStatus.direction,
    });
  const { mutate: deleteSubject } = useDeleteSubject();
  const { mutate: updateSubject } = useUpdateSubject();

  const handleSort = ({
    columnAccessor,
    direction,
  }: {
    columnAccessor: string;
    direction: 'asc' | 'desc';
  }) => {
    setSortStatus({ columnAccessor, direction });
  };

  const handleEditRowClick = (subject: Subject) => {
    setCurrentRow(subject);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleDeleteSubject = (id: string) => {
    deleteSubject(id);
  };

  const handleUpdateSubject = (id: string, updatedData: UpdateSubjectData) => {
    setIsEditModalOpen(false);
    updateSubject({ id, updatedData });
  };

  const handleScrollToBottom = () => {
    if (hasNextPage) fetchNextPage();
  };

  return (
    <Container w={'100%'} h={'100%'} p={0}>
      <DataTable
        withTableBorder
        withColumnBorders
        borderRadius="md"
        height={300}
        columns={[
          { accessor: 'subject', sortable: true, width: '45%' },
          { accessor: 'score', sortable: true, width: '45%' },
          {
            accessor: 'actions',
            textAlign: 'center',
            width: '10%',
            render: (subject) => (
              <Group gap={4} justify="right" wrap="nowrap">
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="blue"
                  onClick={() => handleEditRowClick(subject)}
                >
                  <IconEdit size={16} />
                </ActionIcon>
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="red"
                  onClick={() => handleDeleteSubject(subject.id)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            ),
          },
        ]}
        styles={{
          header: {
            backgroundColor: '#f8f6f6',
          },
        }}
        records={data?.pages.flatMap((page) => page.subjects)}
        fetching={isLoading || isFetchingNextPage}
        sortStatus={sortStatus}
        onSortStatusChange={handleSort}
        onScrollToBottom={handleScrollToBottom}
        loaderBackgroundBlur={3}
        loaderSize={'sm'}
      />
      <EditRowModal
        row={currentRow}
        isOpen={isEditModalOpen}
        toggleModal={handleCloseModal}
        onSave={handleUpdateSubject}
      />
    </Container>
  );
};

export default Table;
