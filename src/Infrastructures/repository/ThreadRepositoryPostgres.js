const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(userId, thread) {
    const { title, body } = thread;
    const id = `thread-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: `INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6)
             RETURNING id, title, user_id AS owner`,
      values: [id, title, body, userId, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async checkAvailabilityThread(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1 ',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async getThread(threadId) {
    const query = {
      text: `SELECT t.id,
                    t.title,
                    t.body,
                    t.created_at AS date,
                    u.username
             FROM threads AS t
             INNER JOIN users AS u
             ON t.user_id = u.id
             WHERE t.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows[0]
  }
}

module.exports = ThreadRepositoryPostgres;