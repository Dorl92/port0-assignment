import { Subject } from '@/interfaces/subject';
import { UpdateSubjectData } from '@/interfaces/updated-subject';
import { Button, Modal, NumberInput, TextInput } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div``;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
`;

interface ModalPropsType {
  row: Subject | null;
  isOpen: boolean;
  toggleModal: () => void;
  onSave: (id: string, updatedData: UpdateSubjectData) => void;
}

const EditRowModal = ({ row, isOpen, toggleModal, onSave }: ModalPropsType) => {
  const [subject, setSubject] = useState<string>('');
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    if (row) {
      setSubject(row.subject);
      setScore(row.score);
    }
  }, [row]);

  const handleSaveClick = () => {
    if (row) {
      onSave(row.id, { subject, score });
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={toggleModal}
      overlayProps={{
        backgroundOpacity: 0.25,
        blur: 3,
      }}
      centered
      withCloseButton={true}
      title={`Edit: ${row?.subject}`}
      padding={'30px'}
      radius={'md'}
      transitionProps={{ transition: 'fade-down' }}
    >
      <Container>
        <EditForm>
          <TextInput
            name="subject"
            label={'Subject Name'}
            mb={'8px'}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <NumberInput
            name="score"
            label={'Score'}
            mb={'8px'}
            value={score}
            onChange={(value) => setScore(+value)}
          />
          <Button mt={'16px'} onClick={handleSaveClick}>
            Save
          </Button>
        </EditForm>
      </Container>
    </Modal>
  );
};

export default EditRowModal;
