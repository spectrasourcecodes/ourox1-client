// src/utils/binanceWebSocket.js
class BinanceWebSocket {
  constructor(symbol = 'btcusdt', onMessage) {
    this.symbol = symbol.toLowerCase();
    this.onMessage = onMessage;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimeout = null;
  }

  connect() {
    try {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        console.log(`WebSocket already connected for ${this.symbol}`);
        return;
      }

      console.log(`Connecting WebSocket for ${this.symbol}...`);
      this.ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${this.symbol}@kline_1m`
      );

      this.ws.onopen = () => {
        console.log(`WebSocket connected for ${this.symbol}`);
        this.reconnectAttempts = 0; // reset attempts on success
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.k) {
            const kline = {
              time: data.k.t,
              open: parseFloat(data.k.o),
              high: parseFloat(data.k.h),
              low: parseFloat(data.k.l),
              close: parseFloat(data.k.c),
              volume: parseFloat(data.k.v),
              closeTime: data.k.T,
              isFinal: data.k.x
            };
            this.onMessage(kline);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error.message || error);
        // Reconnect only if not open
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
          this.reconnect();
        }
      };

      this.ws.onclose = (event) => {
        console.log(
          `WebSocket closed: code=${event.code}, reason=${event.reason}, wasClean=${event.wasClean}`
        );
        // Reconnect only if the closure was unexpected
        if (!event.wasClean) {
          this.reconnect();
        }
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.reconnect();
    }
  }

  reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn(`Max reconnect attempts reached for ${this.symbol}`);
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);

    console.log(`Reconnecting WebSocket for ${this.symbol} in ${delay}ms (Attempt ${this.reconnectAttempts})`);

    // Clear any previous reconnect timeout
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  changeSymbol(newSymbol) {
    console.log(`Changing WebSocket symbol from ${this.symbol} to ${newSymbol}`);
    this.symbol = newSymbol.toLowerCase();
    this.disconnect();
    this.connect();
  }

  disconnect() {
    if (this.ws) {
      console.log(`Disconnecting WebSocket for ${this.symbol}`);
      this.ws.close(1000, 'Client disconnected'); // normal closure
      this.ws = null;
    }

    // Clear any pending reconnects
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }
}

export default BinanceWebSocket;