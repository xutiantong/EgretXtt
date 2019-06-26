import { RES } from "../manager/ResourceManager";
import { CFG } from "../manager/ConfigManager";
import NumberUtil from "../utils/NumberUtil";
import ConfigUtil from "../utils/ConfigUtil";
import StringUtil from "../utils/StringUtil";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ComItem extends cc.Component {

    @property(cc.Label)
    nameLabel:cc.Label = null;
    @property(cc.Label)
    numLabel:cc.Label = null;
    @property(cc.Sprite)
    iconNode:cc.Sprite = null;

    onLoad () {
    }

    start () {
    }

    public setData(name:any, num:any, icon:any)
    {
        if (this.iconNode) {
            RES.loadLocalSprite( icon.toString(), this.iconNode);
        }
        if (this.nameLabel) {
            this.nameLabel.string = name.toString();
        }
        if (this.numLabel) {
            this.numLabel.string = num.toString();
        }
            
    }

}