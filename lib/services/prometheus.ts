import client from '@prometheus-io/client';

class Prometheus {
  public register;

  constructor() {
    const collectDefaultMetrics = client.collectDefaultMetrics;

    this.register = new client.Registry();

    collectDefaultMetrics({
      register: this.register,
    });
  }
}

const prometheus = new Prometheus();

export default prometheus;
