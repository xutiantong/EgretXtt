import { GAME } from "../model/GameData";

/**
 * ABTest 开关管理
 */
export default class AbTestSwitchMg{
    private static _instance: AbTestSwitchMg = null;
    public static getInstance(): AbTestSwitchMg {
        if (AbTestSwitchMg._instance == null) {
            AbTestSwitchMg._instance = new AbTestSwitchMg();
            
        }
        return AbTestSwitchMg._instance;
    }

    public getGuideABTest(){
        if(GAME._abTestSwitchData["10008"]&&GAME._abTestSwitchData["10008"]=="a"){
            return true;
        }else{
            return false;
        }
    }
}

export var ABTEST = AbTestSwitchMg.getInstance();