import unix from 'unix-dgram';
import {
  isSystemdManaged,
  notifyReady,
  notifyStopping,
  notifyStatus,
  startWatchdog
} from '../src/index';

// Mock unix-dgram module
jest.mock('unix-dgram');

const sendMock = jest.fn((_message, _offset, _length, _path, callback) => callback(undefined));
const closeMock = jest.fn();
(unix.createSocket as jest.Mock).mockReturnValue({
  send: sendMock,
  close: closeMock,
});

jest.useFakeTimers();

describe('systemdNotifier', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    process.env.NOTIFY_SOCKET = '/tmp/notify.sock';
    process.env.WATCHDOG_USEC = '5000000';
  });

  describe('isSystemdManaged', () => {
    it('should return true if NOTIFY_SOCKET and WATCHDOG_USEC are set', () => {
      expect(isSystemdManaged()).toBe(true);
    });

    it('should return false if NOTIFY_SOCKET is not set', () => {
      delete process.env.NOTIFY_SOCKET;
      expect(isSystemdManaged()).toBe(false);
    });

    it('should return false if WATCHDOG_USEC is not set', () => {
      delete process.env.WATCHDOG_USEC;
      expect(isSystemdManaged()).toBe(false);
    });
  });

  describe('notifyReady', () => {
    it('should send READY=1 to systemd', () => {
      notifyReady();
      expect(unix.createSocket).toHaveBeenCalledWith('unix_dgram');
      expect(sendMock).toHaveBeenCalledWith(expect.any(Buffer), 0, expect.any(Number), '/tmp/notify.sock', expect.any(Function));
      expect(closeMock).toHaveBeenCalled();
    });

    it('should throw an error if sending fails', () => {
      sendMock.mockImplementationOnce((message, offset, length, path, callback) => callback(new Error('send failed')));
      expect(() => notifyReady()).toThrow('Failed to notify systemd: send failed');
    });
  });

  describe('notifyStopping', () => {
    it('should send STOPPING=1 to systemd', () => {
      notifyStopping();
      expect(unix.createSocket).toHaveBeenCalledWith('unix_dgram');
      expect(sendMock).toHaveBeenCalledWith(expect.any(Buffer), 0, expect.any(Number), '/tmp/notify.sock', expect.any(Function));
      expect(closeMock).toHaveBeenCalled();
    });
  });

  describe('notifyStatus', () => {
    it('should send STATUS=custom status to systemd', () => {
      const status = 'Custom status';
      notifyStatus(status);
      expect(unix.createSocket).toHaveBeenCalledWith('unix_dgram');
      expect(sendMock).toHaveBeenCalledWith(expect.any(Buffer), 0, expect.any(Number), '/tmp/notify.sock', expect.any(Function));
      expect(closeMock).toHaveBeenCalled();
    });
  });

  describe('startWatchdog', () => {
    it('should start a watchdog interval', () => {
      jest.spyOn(global, 'setInterval');
      const interval = startWatchdog();
      expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 2500);
      clearInterval(interval);
    });

    it('should throw an error if WATCHDOG_USEC is not set', () => {
      delete process.env.WATCHDOG_USEC;
      expect(() => startWatchdog()).toThrow('WATCHDOG_USEC not set');
    });
  });
});
