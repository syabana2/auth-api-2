const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should throw error if use case payload not contain content', async () => {
    // Arrange
    const useCasePayload = {};
    const addCommentUseCase = new AddCommentUseCase({});

    // Action and assert
    await expect(addCommentUseCase.execute({}, {}, useCasePayload))
      .rejects
      .toThrowError('ADD_COMMENT_USE_CASE.NOT_CONTAIN_CONTENT');
  });

  it('should throw error if content is not string', async () => {
    // Arrange
    const useCasePayload = {
      content: 123,
    };
    const addCommentUseCase = new AddCommentUseCase({});

    // Action and assert
    await expect(addCommentUseCase.execute({}, {}, useCasePayload))
      .rejects
      .toThrowError('ADD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the add comment correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'ini comment',
    };
    const expectedAddComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'user-123',
    });

    // Creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mocking needed function
    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
      mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddComment));

    const getCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await getCommentUseCase.execute('user-123', 'thread-123', useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddComment);
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith('thread-123');
    expect(mockCommentRepository.addComment).toBeCalledWith('user-123', 'thread-123', useCasePayload);
  });
});