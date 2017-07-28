import {eventChannel, buffers} from "redux-saga";
import {call, take, cancelled} from "redux-saga/effects";

export function getEmitter(socket, event, buffer = 100) {
  if (typeof buffer === "number") {
    buffer = buffers.expanding(buffer);
  }

  return eventChannel(emit => {
    const handler = data => emit(data);
    socket.on(event, handler);

    return () => socket.off(event, handler);
  }, buffer);
}

export function listen(socket, event, handler, buffer) {
  return function*() {
    const channel = yield call(getEmitter, socket, event, buffer);
    try {
      const data = yield take(channel);
      yield call(handler, data);
    } finally {
      if (yield cancelled()) {
        channel.close();
      }
    }
  };
}
