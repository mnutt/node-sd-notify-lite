import unix from 'unix-dgram';

function notifySocket() {
  return process.env.NOTIFY_SOCKET;
}

export function watchdogUsec() {
  return process.env.WATCHDOG_USEC;
}

function notifySystemd(state: string): void {
  const notifySocketPath = notifySocket();
  if (notifySocketPath) {
    const socket = unix.createSocket('unix_dgram');
    const message = Buffer.from(state);
    socket.send(message, 0, message.byteLength, notifySocketPath, (err: Error | undefined) => {
      socket.close();
      if (err) {
        throw new Error(`Failed to notify systemd: ${err.message}`);
      }
    });
  }
}

export function watchdogPing(): void {
  notifySystemd('WATCHDOG=1');
}

export function isSystemdManaged(): boolean {
  return !!notifySocket() && !!watchdogUsec();
}

export function notifyReady(): void {
  notifySystemd('READY=1');
}

export function notifyStopping(): void {
  notifySystemd('STOPPING=1');
}

export function notifyStatus(status: string): void {
  notifySystemd(`STATUS=${status}`);
}

export function startWatchdog(): ReturnType<typeof setInterval> {
  const watchdogUsecValue = watchdogUsec();
  if (!watchdogUsecValue) {
    throw new Error('WATCHDOG_USEC not set');
  }

  const interval = parseInt(watchdogUsecValue, 10) / 2 / 1000;
  return setInterval(watchdogPing, interval);
}
