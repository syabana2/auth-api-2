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

  async addComment(userId, threadId, { content }) {
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: `INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, content, user_id AS owner`,
      values: [id, content, threadId, userId, false, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async verifyCommentOwner(owner, commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    const comment = result.rows[0];
    if (comment.user_id !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    };

    await this._pool.query(query);
  }

  async getCommentsThread(threadId) {
    const query = {
      text: `SELECT c.id,
                    u.username,
                    c.created_at AS date,
                    c.content,
                    c.is_delete
             FROM comments AS c
             INNER JOIN users AS u
             ON c.user_id = u.id
             WHERE c.thread_id = $1
             ORDER BY date`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = ThreadRepositoryPostgres;