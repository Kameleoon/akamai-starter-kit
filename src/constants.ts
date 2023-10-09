// ========== Mock Storage ============
import {
  IExternalStorageConstructor,
  KameleoonStorageKey,
  IExternalStorage,
  KameleoonError,
  Result,
  KameleoonException,
  Err,
  Ok,
  IExternalEventSourceConstructor,
  IExternalEventSource,
  EventSourceOpenParametersType,
  RealTimeEventType,
  IExternalRequestDispatcher,
  TrackParametersType,
  HttpMethod,
  JSONType,
} from "@kameleoon/javascript-sdk-core";

export class MockStorageConstructor implements IExternalStorageConstructor {
  public initialize(key: KameleoonStorageKey): IExternalStorage {
    const storage = new MockStorage(key);

    return storage;
  }
}

class MockStorage implements IExternalStorage {
  private storageKey: KameleoonStorageKey;
  private data?: string;

  constructor(key: KameleoonStorageKey) {
    this.storageKey = key;
  }

  get key(): KameleoonStorageKey {
    return this.storageKey;
  }

  public read(): Result<string, KameleoonError> {
    if (!this.data) {
      return Err(new KameleoonError(KameleoonException.StorageRead, this.key));
    }

    return Ok(this.data);
  }

  public write(data: string): Result<void, KameleoonError> {
    this.data = data;

    return Ok();
  }
}

// ========== Mock EventSource ============
export class MockExternalEventSourceConstructor
  implements IExternalEventSourceConstructor
{
  public initialize(url: string): IExternalEventSource {
    return new MockExternalEventSource(url);
  }
}

class MockExternalEventSource implements IExternalEventSource {
  private eventSource: EventSource;

  constructor(url: string) {
    const eventSource = new EventSource(url);

    this.eventSource = eventSource;
  }

  public open({
    siteCode,
    eventType,
    onEvent,
  }: EventSourceOpenParametersType): void {
    this.eventSource.addEventListener(eventType, (message) => {
      const event: RealTimeEventType = JSON.parse(message.data);
      const { siteCode: eventSiteCode, ts } = event;

      if (siteCode === eventSiteCode) {
        onEvent(ts);
      }
    });
  }

  public close() {
    this.eventSource.close();
  }
}

// ========== Mock Request Dispatcher ============
export class MockExternalRequestDispatcher
  implements IExternalRequestDispatcher
{
  public async track({
    url,
    headers,
    body,
  }: TrackParametersType): Promise<boolean> {
    const response = await fetch(url, {
      method: HttpMethod.Post,
      headers,
      body,
    });

    return response.ok;
  }

  public async getClientConfiguration(url: string): Promise<JSONType> {
    for (let i = 1; i <= 3; i++) {
      try {
        const response = await fetch(url, {
          method: HttpMethod.Get,
        });

        if (response.ok) {
          return response.json();
        }

        if (response.status !== 504) {
          throw new KameleoonError(KameleoonException.ClientConfiguration);
        }
      } catch (err) {
        throw new KameleoonError(KameleoonException.ClientConfiguration);
      }

      if (i < 3) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    throw new KameleoonError(KameleoonException.MaximumRetriesReached);
  }

  public async getRemoteData(url: string): Promise<JSONType> {
    const response = await fetch(url, {
      method: HttpMethod.Get,
    });

    if (response.ok) {
      return response.json();
    }

    throw new KameleoonError(KameleoonException.RemoteData);
  }
}
