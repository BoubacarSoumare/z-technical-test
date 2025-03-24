export interface IBook {
  title: string;
  author: string;
  note?: string;
  lastModifiedDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}