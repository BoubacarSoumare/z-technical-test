import { Types, Error as MongooseError } from 'mongoose';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import BookModel, { Book } from '../models/book.model';
import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';

interface ValidationError extends MongooseError.ValidationError {
  errors: {
    [key: string]: MongooseError.ValidatorError;
  };
}

describe('Book API Tests', () => {
  const testBook = {
    title: 'Test Book',
    author: 'Test Author',
    note: 'Test Note',
    userId: 'test-user'
  };

  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost:27017/test-library');
    await BookModel.deleteMany({});
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      const res = await request(app)
        .post('/api/books')
        .send(testBook);

      expect(res.status).to.equal(201);
      expect(res.body.title).to.equal(testBook.title);
    });

    it('should fail without required fields', async () => {
      const res = await request(app)
        .post('/api/books')
        .send({ note: 'Just a note' });

      expect(res.status).to.equal(400);
    });
  });

  describe('GET /api/books', () => {
    it('should return all books', async () => {
      await BookModel.create(testBook);

      const res = await request(app)
        .get('/api/books')
        .query({ userId: testBook.userId });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0].title).to.equal(testBook.title);
    });
  });

  describe('PUT /api/books/:id', () => {
    let bookId: string;

    beforeEach(async () => {
      const book = await BookModel.create(testBook);
      bookId = (book._id as Types.ObjectId).toString();
    });

    it('should update a book', async () => {
      const response = await request(app)
        .put(`/api/books/${bookId}`)
        .send({ title: 'Updated Title' });

      expect(response.status).to.equal(200);
      expect(response.body.title).to.equal('Updated Title');
    });
  });

  describe('DELETE /api/books/:id', () => {
    let bookId: string;

    beforeEach(async () => {
      const book = await BookModel.create(testBook);
      bookId = (book._id as Types.ObjectId).toString();
    });

    it('should delete a book', async () => {
      const response = await request(app)
        .delete(`/api/books/${bookId}`);

      expect(response.status).to.equal(200);
      
      const deletedBook = await BookModel.findById(bookId);
      expect(deletedBook).to.be.null;
    });
  });

  it('should fail to create book without required fields', async () => {
    const invalidBook = {
      note: 'Test Note'
    };

    try {
      const book = new BookModel(invalidBook);
      await book.save();
      expect.fail('Should have thrown validation error');
    } catch (error) {
      const validationError = error as ValidationError;
      expect(validationError.name).to.equal('ValidationError');
      expect(validationError.errors).to.have.property('title');
      expect(validationError.errors).to.have.property('author');
    }
  });
});

describe('Book Model Tests', () => {
  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost:27017/test-library');
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create a new book', async () => {
    const validBook = {
      title: 'Test Book',
      author: 'Test Author',
      note: 'Test Note',
      userId: 'test-user',
      lastModifiedDate: new Date()
    };

    const book = new BookModel(validBook);
    const savedBook = await book.save();

    expect(savedBook._id).to.exist;
    expect(savedBook.title).to.equal(validBook.title);
    expect(savedBook.author).to.equal(validBook.author);
  });

  it('should fail to create book without required fields', async () => {
    const invalidBook = {
      note: 'Test Note'
    };

    try {
      const book = new BookModel(invalidBook);
      await book.save();
      expect.fail('Should have thrown validation error');
    } catch (error) {
      const validationError = error as ValidationError;
      expect(validationError).to.exist;
      expect(validationError.name).to.equal('ValidationError');
    }
  });

  it('should update a book', async () => {
    const book = new BookModel({
      title: 'Original Title',
      author: 'Original Author',
      userId: 'test-user',
      lastModifiedDate: new Date()
    });
    await book.save();

    const updatedBook = await BookModel.findByIdAndUpdate(
      book._id,
      { title: 'Updated Title' },
      { new: true }
    );

    expect(updatedBook?.title).to.equal('Updated Title');
  });

  it('should delete a book', async () => {
    const book = new BookModel({
      title: 'Book to Delete',
      author: 'Delete Author',
      userId: 'test-user',
      lastModifiedDate: new Date()
    });
    await book.save();

    await BookModel.findByIdAndDelete(book._id);
    const deletedBook = await BookModel.findById(book._id);
    expect(deletedBook).to.be.null;
  });
});