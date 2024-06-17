import env from "../../env.json";

export default class DownloadLinkGenerator {
  public static reportDownloadLink(filename: string) {
    return env.DOMAIN + "/download_report" + "/" + filename;
  }
}
