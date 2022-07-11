const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const expectedThread = {
      id: threadId,
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding"
    }
    const expectedComments = [{
      id: 'comment-123',
      username: "dicoding",
      date: "2021-08-08T07:19:09.775Z",
      content: "sebuah content",
    }]
    const expectedResult = expectedThread;
    expectedResult['comments'] = expectedComments;

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadDetail = await getThreadUseCase.execute(threadId);

    // Assert
    expect(threadDetail).toStrictEqual(expectedResult);
    expect(mockThreadRepository.checkAvailabilityThread)
      .toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.getThread)
      .toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsThread)
      .toHaveBeenCalledWith(threadId);
  });
});