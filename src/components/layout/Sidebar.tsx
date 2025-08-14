import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export interface SidebarItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  children?: SidebarItem[];
}

export interface SidebarProps {
  items: SidebarItem[];
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  items, 
  isOpen, 
  onClose,
  className 
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemClick = (item: SidebarItem, index: number) => {
    if (item.children && item.children.length > 0) {
      toggleExpanded(index);
    } else if (item.onClick) {
      item.onClick();
      if (onClose) onClose(); // Close sidebar on mobile after action
    } else if (item.path) {
      navigate(item.path);
      if (onClose) onClose(); // Close sidebar on mobile after navigation
    }
  };

  return (
    <>
      {isOpen && <SidebarOverlay onClick={onClose} />}
      <SidebarContainer $isOpen={isOpen} className={className}>
        <SidebarContent>
          <SidebarMenu items={items} onItemClick={handleItemClick} expandedItems={expandedItems} />
        </SidebarContent>
      </SidebarContainer>
    </>
  );
};

export interface SidebarMenuProps {
  items: SidebarItem[];
  onItemClick: (item: SidebarItem, index: number) => void;
  expandedItems: Set<number>;
  level?: number;
  parentIndex?: number;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ 
  items, 
  onItemClick, 
  expandedItems,
  level = 0,
  parentIndex = 0
}) => {
  return (
    <MenuList $level={level}>
      {items.map((item, index) => {
        const itemIndex = level === 0 ? index : parentIndex * 1000 + index;
        return (
          <MenuItem key={itemIndex}>
            <MenuItemButton
              onClick={() => onItemClick(item, itemIndex)}
              $hasChildren={!!(item.children && item.children.length > 0)}
              $level={level}
            >
              {item.icon && <MenuItemIcon>{item.icon}</MenuItemIcon>}
              <MenuItemLabel>{item.label}</MenuItemLabel>
              {item.children && item.children.length > 0 && (
                <MenuItemExpandIcon $expanded={expandedItems.has(itemIndex)}>
                  ▶
                </MenuItemExpandIcon>
              )}
            </MenuItemButton>
            
            {item.children && item.children.length > 0 && expandedItems.has(itemIndex) && (
              <SidebarMenu 
                items={item.children} 
                onItemClick={onItemClick}
                expandedItems={expandedItems}
                level={level + 1}
                parentIndex={itemIndex}
              />
            )}
          </MenuItem>
        );
      })}
    </MenuList>
  );
};

// Styled Components
const SidebarOverlay = styled.div`
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1099;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const SidebarContainer = styled.aside<{ $isOpen: boolean }>`
  position: fixed;
  top: 64px;
  left: 0;
  bottom: 0;
  width: 280px;
  background: ${({ theme }) => theme.colors.surface || 'white'};
  border-right: 1px solid ${({ theme }) => theme.colors.border || '#e5e7eb'};
  z-index: 1100;
  transform: translateX(${({ $isOpen }) => $isOpen ? '0' : '-100%'});
  transition: transform 0.3s ease;
  overflow-y: auto;
  
  @media (min-width: 768px) {
    top: 72px;
    position: static;
    transform: none;
    width: ${({ $isOpen }) => $isOpen ? '280px' : '0'};
    border-right: ${({ $isOpen }) => $isOpen ? '1px solid' : 'none'} ${({ theme }) => theme.colors.border || '#e5e7eb'};
    overflow: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
    transition: width 0.3s ease;
  }
`;

const SidebarContent = styled.div`
  padding: 20px 0;
`;

const MenuList = styled.ul<{ $level: number }>`
  list-style: none;
  margin: 0;
  padding: 0;
  padding-left: ${({ $level }) => $level * 16}px;
`;

const MenuItem = styled.li`
  margin-bottom: 4px;
`;

const MenuItemButton = styled.button<{ 
  $hasChildren: boolean; 
  $level: number;
}>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray?.[100] || '#f3f4f6'};
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
  }
`;

const MenuItemIcon = styled.span`
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  min-width: 20px;
`;

const MenuItemLabel = styled.span`
  flex: 1;
`;

const MenuItemExpandIcon = styled.span<{ $expanded: boolean }>`
  font-size: 0.7rem;
  transform: rotate(${({ $expanded }) => $expanded ? '90deg' : '0deg'});
  transition: transform 0.2s ease;
`;

export default Sidebar;
