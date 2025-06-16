
import React, { useState, useEffect, useMemo } from 'react';
import { FileNode, NodeType } from '../types';
import { 
  ChevronRightIcon, 
  ChevronDownIcon, 
  FolderIcon, 
  MarkdownFileIcon,
  CodeIcon,
  ChipIcon,
  WrenchIcon
} from '../constants';

interface SidebarItemProps {
  node: FileNode;
  level: number;
  onFileSelect: (node: FileNode) => void;
  selectedFileId: string | null;
  customIcon?: React.FC<{ className?: string }>;
  isInitiallyOpen?: boolean;
}

const getIconForNode = (node: FileNode, isSelected: boolean, customIcon?: React.FC<{className?: string}>): React.ReactElement => {
  const className = `w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`;
  if (customIcon) return React.createElement(customIcon, { className });

  if (node.type === NodeType.FOLDER) {
    if (node.name.toLowerCase().includes('mécanique')) return <WrenchIcon className={`${className} text-orange-500`} />;
    if (node.name.toLowerCase().includes('it')) return <CodeIcon className={`${className} text-sky-500`} />;
    if (node.name.toLowerCase().includes('électronique')) return <ChipIcon className={`${className} text-emerald-500`} />;
    return <FolderIcon className={className} />;
  }
  if (node.name.endsWith('.md')) {
    return <MarkdownFileIcon className={className} />;
  }
  return <div className="w-5 h-5" />; // Placeholder for non-MD files not handled above
};


const SidebarItem: React.FC<SidebarItemProps> = ({ node, level, onFileSelect, selectedFileId, customIcon, isInitiallyOpen = false }) => {
  // Convention: masquer si le nom commence par '_'
  if (node.name.startsWith('_')) {
    return null;
  }

  const isSelected = selectedFileId === node.id;
  const isFolder = node.type === NodeType.FOLDER;
  
  const visibleChildren = useMemo(() => 
    node.children?.filter(child => !child.name.startsWith('_')) || []
  , [node.children]);

  const hasVisibleChildren = useMemo(() => 
    isFolder && visibleChildren.length > 0
  , [isFolder, visibleChildren]);

  const [isOpen, setIsOpen] = useState(() => {
    if (isInitiallyOpen) return true;
    if (!isFolder || !selectedFileId || !node.children) return false;
    
    const checkSelected = (currentNode: FileNode): boolean => {
      if (currentNode.name.startsWith('_')) return false; // Ignorer les enfants cachés
      if (currentNode.id === selectedFileId) return true;
      if (currentNode.type === NodeType.FOLDER && currentNode.children) {
        return currentNode.children.some(child => checkSelected(child));
      }
      return false;
    };
    return checkSelected(node);
  });


  useEffect(() => {
    if (isFolder && selectedFileId && !isOpen) {
      const checkNestedSelected = (currentNode: FileNode): boolean => {
        if (currentNode.name.startsWith('_')) return false;
        if (currentNode.id === selectedFileId) return true;
        if (currentNode.type === NodeType.FOLDER && currentNode.children) {
          return currentNode.children.some(child => checkNestedSelected(child));
        }
        return false;
      };
      if (node.children?.some(child => checkNestedSelected(child))) {
        setIsOpen(true);
      }
    }
  }, [selectedFileId, isFolder, node.children, isOpen]);


  const handleToggle = () => {
    // Ne pas permettre de sélectionner un dossier, seulement ouvrir/fermer
    if (isFolder && hasVisibleChildren) {
      setIsOpen(!isOpen);
    }
    // Seulement appeler onFileSelect pour les fichiers .md
    if (node.type === NodeType.FILE && node.name.endsWith('.md')) {
      onFileSelect(node);
    }
  };
  
  // Masquer les fichiers non-MD (sauf les dossiers, qui sont déjà gérés par la convention '_')
  if (node.type === NodeType.FILE && !node.name.endsWith('.md')) {
    return null; 
  }

  const IconComponent = getIconForNode(node, isSelected && node.type === NodeType.FILE, customIcon);
  const paddingLeft = level * 16 + 12;

  return (
    <div>
      <div
        className={`sidebar-item ${isSelected && node.type === NodeType.FILE && node.name.endsWith('.md') ? 'selected' : ''}`}
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={handleToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleToggle(); }}
        aria-expanded={isFolder && hasVisibleChildren ? isOpen : undefined}
        aria-selected={isSelected && node.type === NodeType.FILE && node.name.endsWith('.md')}
        title={node.name.replace('.md', '')}
      >
        {IconComponent}
        <span className="truncate flex-grow">{node.name.replace('.md', '')}</span>
        {isFolder && hasVisibleChildren && (
          <span className="chevron-icon">
            {isOpen ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
          </span>
        )}
      </div>

      {isFolder && isOpen && hasVisibleChildren && (
        <div className="mt-0.5">
          {visibleChildren.map((childNode) => (
            <SidebarItem
              key={childNode.id}
              node={childNode}
              level={level + 1}
              onFileSelect={onFileSelect}
              selectedFileId={selectedFileId}
              isInitiallyOpen={isInitiallyOpen} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
