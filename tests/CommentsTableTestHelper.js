/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'sebuah comments',
    thread_id = 'thread-123',
    user_id = 'user-123',
    is_delete = false,
  }) {
    const createdAt = '2021-08-08T07:22:33.555Z';
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, content, thread_id, user_id, is_delete, createdAt, updatedAt],
    };

    await pool.query(query);
  },

  async addDeletedComment({
    id = 'comment-999',
    content = 'sebuah comments',
    thread_id = 'thread-123',
    user_id = 'user-123',
    is_delete = true,
  }) {
    const createdAt = '2021-08-08T10:22:33.555Z';
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, content, thread_id, user_id, is_delete, createdAt, updatedAt],
    };

    await pool.query(query);
  },

  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findDeletedCommentsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND is_delete = true',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },


  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
