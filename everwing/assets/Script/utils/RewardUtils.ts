import { ResourceConst } from "../GameConst";
import { GAME } from "../model/GameData";
import { PANEL } from "../manager/PanelManager";

export default class RewardUtils
{
    public static playReward(resource:any,pos:cc.Vec2)
    {
        for (let key in resource) {
            if (resource.hasOwnProperty(key)) {
                let element = resource[key];
                if(element.itemId == ResourceConst.Gold)
                {
                    var oldGold:number =GAME.playerData.gold;
                    PANEL.mui.playResflyAni(ResourceConst.Gold, pos);
                    GAME.updatePlayerData({gold: (oldGold + element.num)});
                }
                else if(element.itemId == ResourceConst.Exp)
                {
                    var oldExp:number =GAME.playerData.exp;
                    PANEL.mui.playResflyAni(ResourceConst.Exp,pos);
                    GAME.updatePlayerData({exp: (oldExp + element.num)});  
                }
                else if(element.itemId = ResourceConst.DogHomeMaterial)
                {
                    if(GAME.playerData.materials)
                    {
                        let oldDogHomeMaterial = GAME.playerData.materials.dogHomeMaterial;
                        PANEL.mui.playResflyAni(ResourceConst.Exp,pos);//暂时飞到经验头像位置
                        GAME.updatePlayerData({exp: (oldDogHomeMaterial + element.num)});
                    }
                }
            }
        }
    }
}