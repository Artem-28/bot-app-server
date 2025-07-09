export enum BlockType {
  FREE_TEXT = 'free_text',
  BUTTON = 'button',
}

export interface IBlockType {
  code: BlockType;
  title: string;
}
