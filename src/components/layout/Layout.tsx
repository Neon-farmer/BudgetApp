import React, { useState } from "react";
import styled from "styled-components";
import { Header } from "./Header";
import { Sidebar, SidebarItem } from "./Sidebar";
import { Main } from "./Main";
import { Footer } from "./Footer";
import { Loading } from "../Loading";

export interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  footerVariant?: "default" | "minimal";
  sidebarItems?: SidebarItem[];
  className?: string;
  loading?: boolean;
  loadingMessage?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showSidebar = true,
  footerVariant = "default",
  sidebarItems = [],
  className,
  loading = false,
  loadingMessage = "Loading...",
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const defaultSidebarItems: SidebarItem[] = [
    { label: "Home", path: "/budget/home" },
    { label: "Add Expense", path: "/budget/add-expense" },
    { label: "Add Income", path: "/budget/add-income" },
    { label: "Envelopes", path: "/budget/envelopes" },
    { label: "Planner", path: "/budget/planner" },
    { label: "Settings", path: "/budget/settings" },
  ];

  const items = sidebarItems.length > 0 ? sidebarItems : defaultSidebarItems;

  return (
    <LayoutContainer className={className}>
      <Header
        onMenuClick={showSidebar ? handleSidebarToggle : undefined}
        showMenuButton={showSidebar}
      />

      {showSidebar && (
        <Sidebar
          items={items}
          isOpen={sidebarOpen}
          onClose={handleSidebarClose}
        />
      )}

      <Main hasSidebar={showSidebar} sidebarOpen={sidebarOpen}>
        {loading ? (
          <Loading message={loadingMessage} size="lg" />
        ) : (
          children
        )}
      </Main>

      {/* <Footer variant={footerVariant} /> */}
    </LayoutContainer>
  );
};

// Styled Components
const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background || "#f8f9fa"};
`;

export default Layout;
