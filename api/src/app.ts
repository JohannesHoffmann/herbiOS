import AudioService from "./audio/AudioService";
import DatabaseService from "./DatabaseService";
import AppService from "./app/AppService";
import RestService from "./RestService";
import GeoService from "./geo/GeoService";
import LightsService from "./lights/LightsService";
import ClimateService from "./climate/ClimateService";
import ConfigService from "./ConfigService";
import SocketService from "./api/websocket/SocketService";
import AroundMeService from "./aroundMe/AroundMeService";
import TouringService from "./touring/TouringService";
import PoiService from "./poi/PoiService";

const start = async () => {
    ConfigService.getInstance();
    await DatabaseService.getInstance().init();
    RestService.getInstance().start();
    SocketService.getInstance().init(RestService.getInstance().getServer());

    AudioService.getInstance();
    ClimateService.getInstance();
    AppService.getInstance();
    LightsService.getInstance();
    await GeoService.getInstance().init();
    await PoiService.getInstance().init();
    await TouringService.getInstance().init();
    AroundMeService.getInstance();
}

start();