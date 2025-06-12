
import React from 'react';
// Types enlevés car la structure vient d'ailleurs
// export { FileNode, NodeType } from './types'; // Supprimé

// SVG Icons - Conservés tels quels
export const TekBotLogo: React.FC<{className?: string}> = ({className}) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.236L18.396 7 12 9.764 5.604 7 12 4.236zM5 9.07v7.854l7 3.889 7-3.889V9.07L12 11.93 5 9.07z"/>
  </svg>
);
export const HamburgerIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);
export const TrophyIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2a2.5 2.5 0 00-2.5 2.5V7h5V4.5A2.5 2.5 0 0010 2z"/>
    <path fillRule="evenodd" d="M3.5 8A1.5 1.5 0 002 9.5v1A1.5 1.5 0 003.5 12H4v6.5A1.5 1.5 0 005.5 20h9a1.5 1.5 0 001.5-1.5V12h.5a1.5 1.5 0 001.5-1.5v-1A1.5 1.5 0 0016.5 8h-13zm11.5 1H5v1.5a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5V9H3.5a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5h13a.5.5 0 01.5.5v1a.5.5 0 01-.5.5H15zM7 13h6v5H7v-5z" clipRule="evenodd"/>
  </svg>
);
export const CalendarIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
  </svg>
);
export const DocumentIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
 <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6.414A2 2 0 0016.414 5L13 1.586A2 2 0 0011.586 1H4zm8 5a1 1 0 01-1-1V2l4 4h-3z" clipRule="evenodd"/>
  </svg>
);

export const FolderIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
  </svg>
);
export const MarkdownFileIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
 <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm1.53 3.47a.75.75 0 011.06 0l1.72 1.72 1.72-1.72a.75.75 0 111.06 1.06L9.37 8.53l1.72 1.72a.75.75 0 11-1.06 1.06L8.31 9.59l-1.72 1.72a.75.75 0 01-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 010-1.06zM13 5.75a.75.75 0 01.75.75v5a.75.75 0 01-1.5 0v-5a.75.75 0 01.75-.75z"/>
  </svg>
);
export const CodeIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
 <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
  </svg>
);
export const ChipIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3H4a1 1 0 00-1 1v16a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1h-5M9 3v4M15 3v4M9 3h6M4 9h16M4 15h16M10 12h4"></path>
  </svg>
);
export const WrenchIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
 <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
  </svg>
);

export const ChevronRightIcon: React.FC<{className?: string}> = ({className = "w-5 h-5"}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
  </svg>
);

export const ChevronDownIcon: React.FC<{className?: string}> = ({className = "w-5 h-5"}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
  </svg>
);
// DOCUSAURUS_STRUCTURE a été supprimé.
// Les données de structure de fichiers seront chargées depuis file-manifest.json.
