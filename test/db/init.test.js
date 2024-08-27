'use strict';

jest.mock('lowdb', () => {
  return jest.fn(() => {
    throw new Error('Database error');
  });
});

jest.mock('lowdb/adapters/FileAsync', () => {
  return jest.fn(() => ({}));
});

const init = require('../../src/db/init');

describe('src/db/init', () => {
  it('throw an error if database fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    delete process.env.DB_PATH;
    await expect(init()).rejects.toThrow('Database error');

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy.mock.calls[0][0]).toMatch(/Failed to initialize database, check .*butterflies\.db\.json/);

    consoleErrorSpy.mockRestore();
  });
});
