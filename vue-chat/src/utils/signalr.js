import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import constants from '../constants/constants'
export default {

    listen(method, func){
        const connection = new HubConnectionBuilder()
        .withUrl(constants.SIGNALR_HUB)
        .configureLogging(LogLevel.Information)
        .build();
      connection.on(method, func);
      connection.start();
    }


}