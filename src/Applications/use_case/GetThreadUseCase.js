class GetThreadUseCase {
  constructor({
    commentRepository,
    threadRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    await this._threadRepository.checkAvailabilityThread(threadId);
    const thread = await this._threadRepository.getThread(threadId);
    const comments = await this._commentRepository.getCommentsThread(threadId);

    comments.forEach(comment => {
      if (comment['is_delete']) {
        comment['content'] = '**komentar telah dihapus**';
      }

      delete comment['is_delete'];
    });

    thread["comments"] = comments;

    return thread;
  }
}

module.exports = GetThreadUseCase;