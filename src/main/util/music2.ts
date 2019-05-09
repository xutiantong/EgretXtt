/**
 * 音乐切换工具2.0
 */
class music2 extends eui.Component implements eui.UIComponent {
	soundarray: any = new Array();
	public constructor(...sounds) {
		super();
		for (let n of sounds) {
			let m = new M();
			m.sound = n;
			this.soundarray.push(m);
			console.log(sounds.length + "个声音注册成功")
		}
	}
	/**
	 * 对外提供音乐切换服务
	 */
	play(soundi: egret.Sound, nn?: number) {
		for (let n of this.soundarray) {
			if (n.sound == soundi) {
				if (nn) {
					if (n.channel == null) {
						let channel: egret.SoundChannel = n.sound.play(0, nn);
						n.channel = channel;
					} else {

						n.channel = n.sound.play(0, nn);

					}
				} else {
					if (n.channel == null) {
						let channel: egret.SoundChannel = n.sound.play(0, 1);
						n.channel = channel;
					} else {
						n.channel = n.sound.play(0, 1);
					}
				}


				return n.channel;
			}
		}
	}

	/**
	 *  对外提供已创建声道返回服务
	 */
	getchannel(soundi: egret.Sound): any {
		let s = null;
		for (let n of this.soundarray) {
			if (n.sound == soundi) {
				s = n.channel;
			}


		}
		return s;


	}

}