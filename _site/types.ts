
export enum NodeType {
  FILE = 'file',
  FOLDER = 'folder',
}

export interface FileNode {
  id: string;
  name: string;
  type: NodeType;
  path: string; // Chemin relatif pour fetch le fichier (ex: 'docs/intro.md')
  children?: FileNode[];
  // content?: string; // Supprimé, sera chargé dynamiquement via fetch
}
