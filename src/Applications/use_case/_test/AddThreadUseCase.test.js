
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'thread title',
      body: 'thread body',
    };
    const expectedAddThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123'
    })

    // Creating dependency of use case
    const mockThreadRepository = new ThreadRepository();

    // Mocking needed function
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddThread));

    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await getThreadUseCase.execute('user-123', useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddThread);
    expect(mockThreadRepository.addThread).toBeCalledWith('user-123', new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
  });
});