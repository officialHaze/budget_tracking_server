export default class CorsConfig {
  public static getOptions() {
    const globalCorsOptions = {
      origin: (origin: any, cb: any) => {
        console.log(origin);
        cb(null, true);
      },
      credentials: true,
      methods: ["GET", "POST"],
    };

    return globalCorsOptions;
  }
}
