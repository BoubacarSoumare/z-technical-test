import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { Book, BookDocument, IBook } from '../models/book.model';

describe('Book API', () => {
  const testBook: IBook = {
    title: 'Test Book',
    author: 'Test Author',
    note: 'Test Note',
    lastModifiedDate: new Date()
  };

  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      const response = await request(app)
        .post('/api/books')
        .send(testBook);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(testBook.title);
      expect(response.body.author).toBe(testBook.author);
      expect(response.body.note).toBe(testBook.note);
    });

    it('should fail if title is missing', async () => {
      const response = await request(app)
        .post('/api/books')
        .send({ author: testBook.author });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/books', () => {
    beforeEach(async () => {
      await Book.create(testBook);
    });

    it('should return all books', async () => {
      const response = await request(app).get('/api/books');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe(testBook.title);
    });
  });

  describe('PUT /api/books/:id', () => {
    let bookId: string;

    beforeEach(async () => {
      const book = await Book.create(testBook) as BookDocument;
      bookId = book._id.toString();
    });

    it('should update a book', async () => {
      const response = await request(app)
        .put(`/api/books/${bookId}`)
        .send({ title: 'Updated Title' });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Title');
    });
  });

  describe('DELETE /api/books/:id', () => {
    let bookId: string;

    beforeEach(async () => {
      const book = await Book.create(testBook) as BookDocument;
      bookId = book._id.toString();
    });

    it('should delete a book', async () => {
      const response = await request(app)
        .delete(`/api/books/${bookId}`);

      expect(response.status).toBe(200);
      
      const deletedBook = await Book.findById(bookId);
      expect(deletedBook).toBeNull();
    });
  });
});