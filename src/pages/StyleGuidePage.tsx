import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { PageContainer as Container } from "../components/layout/PageContainer";

const StyleGuideWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 0;
`;

const Title = styled.h1`
  color: white;
  margin-bottom: 40px;
  text-align: center;
  font-size: 2.5rem;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const Section = styled.section`
  margin-bottom: 60px;
`;

const SectionTitle = styled.h2`
  color: white;
  margin-bottom: 30px;
  font-size: 1.8rem;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const ComponentExample = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ComponentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

export const StyleGuidePage = () => {
  const navigate = useNavigate();
  const [showBasicModal, setShowBasicModal] = useState(false);
  const [showDangerModal, setShowDangerModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Modal handlers
  const handleModalConfirm = (modalType: string) => {
    setModalLoading(true);
    // Simulate async operation
    setTimeout(() => {
      setModalLoading(false);
      setShowDangerModal(false);
      setShowWarningModal(false);
      setShowInfoModal(false);
      alert(`${modalType} action confirmed!`);
    }, 2000);
  };

  return (
    <StyleGuideWrapper>
      <Container>
        <Title>Design System & Style Guide</Title>
        
        {/* Modal Components Section */}
        <Section>
          <SectionTitle>Modal Components</SectionTitle>
          
          <ComponentExample>
            <h3>Basic Modal</h3>
            <Button onClick={() => setShowBasicModal(true)}>
              Open Basic Modal
            </Button>
          </ComponentExample>

          <ComponentExample>
            <h3>Confirmation Modals</h3>
            <ComponentGrid>
              <Button onClick={() => setShowDangerModal(true)}>
                Delete Confirmation (Danger)
              </Button>
              <Button onClick={() => setShowWarningModal(true)}>
                Warning Confirmation
              </Button>
              <Button onClick={() => setShowInfoModal(true)}>
                Info Confirmation
              </Button>
            </ComponentGrid>
          </ComponentExample>
        </Section>

        <Section>
          <ComponentExample>
            <Button onClick={() => navigate('/budget/home')}>
              Back to Budget App
            </Button>
          </ComponentExample>
        </Section>

        {/* Modal Components */}
        <Modal 
          isOpen={showBasicModal} 
          onClose={() => setShowBasicModal(false)} 
          title="Basic Modal Example"
        >
          <p>This is a basic modal with a title and close functionality.</p>
          <p>You can add any content here including forms, images, or other components.</p>
          <Button onClick={() => setShowBasicModal(false)}>Close</Button>
        </Modal>

        <ConfirmationModal
          isOpen={showDangerModal}
          onClose={() => setShowDangerModal(false)}
          onConfirm={() => handleModalConfirm('Danger')}
          title="Delete Item"
          message="Are you sure you want to delete this item? This action cannot be undone and will permanently remove all associated data."
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={modalLoading}
          variant="danger"
        />

        <ConfirmationModal
          isOpen={showWarningModal}
          onClose={() => setShowWarningModal(false)}
          onConfirm={() => handleModalConfirm('Warning')}
          title="Proceed with Caution"
          message="This action may have unexpected consequences. Please review your selection before proceeding."
          confirmText="Proceed"
          cancelText="Cancel"
          isLoading={modalLoading}
          variant="warning"
        />

        <ConfirmationModal
          isOpen={showInfoModal}
          onClose={() => setShowInfoModal(false)}
          onConfirm={() => handleModalConfirm('Info')}
          title="Confirm Action"
          message="This will update your settings and preferences. Are you sure you want to continue?"
          confirmText="Continue"
          cancelText="Cancel"
          isLoading={modalLoading}
          variant="info"
        />
      </Container>
    </StyleGuideWrapper>
  );
};
