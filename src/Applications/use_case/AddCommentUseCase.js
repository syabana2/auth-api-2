class AddCommentUseCase {
  constructor({
    threadRepository,
    commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(userId, threadId, useCasePayload) {
    this._validatePayload(useCasePayload);
    await this._threadRepository.checkAvailabilityThread(threadId);
    return this._commentRepository.addComment(userId, threadId, useCasePayload);
  }

  _validatePayload(payload) {
    const { content } = payload;
    if (!content) {
      throw new Error('ADD_COMMENT_USE_CASE.NOT_CONTAIN_CONTENT');
    }

    if (typeof content !== 'string') {
      throw new Error('ADD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddCommentUseCase;