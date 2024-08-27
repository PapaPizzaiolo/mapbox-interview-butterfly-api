'use strict';

const attachDbToRequest = require('../../src/db/attachDbToRequest');

jest.mock('../../src/db/init', () => {
  return jest.fn();
});

const init = require('../../src/db/init');

describe('src/db/attachDbToRequest', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {};
    mockRes = {};
    mockNext = jest.fn();
  });

  it('attach db to the request and call next', async () => {
    const mockDb = { connected: true };
    init.mockResolvedValue(mockDb);

    await attachDbToRequest(mockReq, mockRes, mockNext);

    expect(mockReq.db).toBe(mockDb);
    expect(mockNext).toHaveBeenCalledWith();
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('call next with error if database fails', async () => {
    const mockError = new Error('Database initialization failed');
    init.mockRejectedValue(mockError);

    await attachDbToRequest(mockReq, mockRes, mockNext);

    expect(mockReq.db).toBeUndefined();
    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});
