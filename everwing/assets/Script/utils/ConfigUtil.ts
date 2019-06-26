

// import { CFG } from "../Common/ConfigManager";
import { ConfigConst } from "../GameConst";
import NumUtil from "./NumberUtil";
import { CFG } from "../manager/ConfigManager";
export default class ConfigUtil {
    /**
     * 每日奖励领取读表
     */
    public static getPrizeInfo(id:number) {
        let info = null;
        if (id > 0) {
            let prizeItemConfig: any = CFG.getCfgDataById(ConfigConst.PRIZE, String(id));
            // console.log('prizeItemConfig')
            // console.log(prizeItemConfig)
            do {
                if (prizeItemConfig == null) {
                    break;
                }
                let goods: string = String(prizeItemConfig.goods);
                let arr = goods.split("|");
                if (arr.length < 1) {
                    break;
                }
                arr = String(arr[0]).split(";")
                if (arr.length < 2) {
                    break;
                }
                let itemId = arr[0];
                let itemConfig: any = CFG.getCfgDataById(ConfigConst.RESOURCE, itemId);
                if (itemConfig == null) {
                    break;
                }
                let itemNum = NumUtil.toInt(arr[1]);


                if (prizeItemConfig.name != null && prizeItemConfig.name != "") {
                    info = {name: prizeItemConfig.name, icon: prizeItemConfig.icon,random_num:prizeItemConfig.random_num , num: itemNum};
                    break;
                }
                if (prizeItemConfig.goods === null) {
                    break;
                }
 
                // info = {id: itemId, name: itemConfig.name, icon: itemConfig.icon, num: itemNum,random_num:prizeItemConfig.random_num};                 
            } while(false);
        }
        return info;
    }
    public static getGoodsKey(goodType:number): string{
        let idx = goodType;
        let key="goods"
        switch(idx){
            case 1:
               key = "goods_second"; 
            break;
            case 2:
                key = "goods_third"; 
            break;
        }
        return key;
    }
}