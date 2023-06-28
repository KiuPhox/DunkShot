(()=>{"use strict";var t,e={345:(t,e,s)=>{var a=s(260),i=s.n(a);class r extends i().Scene{constructor(){super("preloader")}preload(){const{width:t,height:e}=this.scale,s=this.add.graphics(),a=this.add.text(.5*t,.45*e,"0%",{fontFamily:"AkzidenzGrotesk",fontSize:"36px",color:"#f2a63b"}).setOrigin();this.load.on("progress",(i=>{s.clear(),s.fillStyle(15902267,1),s.fillRect(0,.5*e,t*i,30),a.setText(Math.round(100*i).toString()+"%")})),this.load.on("complete",(()=>{s.destroy(),console.log("Loading complete")})),this.load.spritesheet("ball","assets/textures/ball-sheet.png",{frameWidth:232}),this.load.spritesheet("basket","assets/textures/basket-sheet.png",{frameWidth:354,frameHeight:56.5}),this.load.spritesheet("help","assets/textures/help-sheet.png",{frameWidth:215,frameHeight:1960/6}),this.load.image("net","assets/textures/net.png"),this.load.image("title","assets/textures/title.png"),this.load.image("star","assets/textures/star.png"),this.load.image("mini-wall","assets/textures/miniwall.png"),this.load.image("item","assets/textures/item.png"),this.load.image("reset-btn","assets/textures/btnreset.png"),this.load.image("settings-btn","assets/textures/btnsettings.png"),this.load.image("settings-mainmenu-btn","assets/textures/btnsettings-mainmenu.png"),this.load.image("settings-pause-btn","assets/textures/btnsettings-pause.png"),this.load.image("share-btn","assets/textures/btnshare.png"),this.load.image("pause-btn","assets/textures/btnpause.png"),this.load.image("resume-btn","assets/textures/btnresume.png"),this.load.image("mainmenu-btn","assets/textures/btnmainmenu.png"),this.load.image("customize-mainmenu-btn","assets/textures/btncustomize-mainmenu.png"),this.load.image("customize-btn","assets/textures/btncustomize.png"),this.load.image("back-btn","assets/textures/btnback.png"),this.load.image("cleardata-btn","assets/textures/btncleardata.png"),this.load.spritesheet("rounded-btn","assets/textures/btnrounded-sheet.png",{frameHeight:122,frameWidth:224}),this.load.image("e3","assets/textures/e3.png"),this.load.image("e4","assets/textures/e4.png"),this.load.image("circle","assets/textures/circle.png"),this.load.image("special","assets/textures/special.png"),this.load.bitmapFont("objet","assets/fonts/objet-extrabold.png","assets/fonts/objet-extrabold.xml"),this.loadAudio()}create(){this.scene.start("game").launch("result").launch("main-menu")}loadAudio(){for(let t=1;t<=10;t++)this.load.audio(t.toString(),`assets/audios/notes/${t}.mp3`);this.load.audio("star","assets/audios/star.mp3"),this.load.audio("wall-hit","assets/audios/wall-hit.mp3"),this.load.audio("combo-start","assets/audios/combo-start.mp3"),this.load.audio("combo-shoot","assets/audios/combo-shoot.mp3"),this.load.audio("combo-hit","assets/audios/combo-hit.mp3"),this.load.audio("shoot","assets/audios/shoot.ogg"),this.load.audio("kick","assets/audios/kick.ogg"),this.load.audio("die","assets/audios/die.ogg")}}const n=600,h=1e3;class o{static Float(t,e){return Math.random()*(e-t)+t}static Int(t,e){return Math.floor(Math.random()*(e-t+1)+t)}static Percent(t){return this.Float(0,100)<=t}}var c,l;!function(t){t.READY="ready",t.PLAYING="playing",t.GAME_OVER="game_over",t.PAUSE="pause",t.CUSTOMIZE="customize",t.SETTINGS="settings"}(c||(c={}));class u{static setString(t,e){try{localStorage.setItem(t,e)}catch(e){console.error(`Error saving ${t}:`,e)}}static getString(t){try{const e=localStorage.getItem(t);if(null!==e)return e}catch(e){console.error(`Error load ${t}:`,e)}return"0"}static setNumber(t,e){try{localStorage.setItem(t,e.toString())}catch(e){console.error(`Error saving ${t}:`,e)}}static getInt(t){try{const e=localStorage.getItem(t);if(null!==e)return parseInt(e)}catch(e){console.error(`Error load ${t}:`,e)}return 0}static getFloat(t){try{const e=localStorage.getItem(t);if(null!==e)return parseFloat(e)}catch(e){console.error(`Error load ${t}:`,e)}return 0}static setArray(t,e){try{localStorage.setItem(t,JSON.stringify(e))}catch(t){console.error("Error saving array:",t)}}static getArray(t){try{const e=localStorage.getItem(t);if(null!==e)return JSON.parse(e)}catch(t){console.error("Error retrieving array:",t)}return[]}static deleteAll(){localStorage.clear()}}!function(t){t.STAR="star",t.HIGH_SCORE="high_score",t.CURRENT_SKIN="current-skin",t.SKINS="skins",t.UNLOCKED_SKIN="unlocked-skins",t.SOUND="sound",t.VIBRATION="vibration",t.NIGHT_MODE="night-mode"}(l||(l={}));class d{static init(){this.emitter=new Phaser.Events.EventEmitter}static updateGameState(t,e){switch(this.previousState=this.currentState,this.currentState=t,this.currentState){case c.READY:this.handleReadyState(e);break;case c.PLAYING:this.handlePlayingState(e);break;case c.GAME_OVER:this.handleGameOverState(e);break;case c.PAUSE:this.handlePauseState(e);break;case c.CUSTOMIZE:this.handleCustomizeState(e);break;case c.SETTINGS:this.handleSettingsState(e)}this.emitter.emit("game-state-changed",this.currentState)}static handleReadyState(t){t.scene.start("result").launch("game").launch("main-menu")}static handlePlayingState(t){this.previousState===c.PAUSE&&t.scene.stop().resume("game").wake("main-menu")}static handleGameOverState(t){this.previousState===c.SETTINGS&&t.scene.stop().wake("result")}static handlePauseState(t){this.previousState===c.CUSTOMIZE||this.previousState===c.SETTINGS?t.scene.stop().wake("pause"):this.previousState===c.PLAYING&&t.scene.sleep().pause("game").launch("pause")}static handleCustomizeState(t){this.previousState===c.READY?t.scene.stop("game").stop("result").start("customize"):this.previousState===c.PAUSE&&t.scene.sleep().launch("customize")}static handleSettingsState(t){this.previousState===c.GAME_OVER?t.scene.launch("settings").sleep("result"):this.previousState===c.READY?t.scene.stop("game").stop("result").start("settings"):this.previousState===c.PAUSE&&t.scene.launch("settings").sleep("pause")}static getCurrentState(){return this.currentState}static getPreviousState(){return this.previousState}}d.currentState=c.READY,d.previousState=c.READY;class p{constructor(t){p.curStar=u.getInt(l.STAR),p.curStarText=t.add.bitmapText(528,50,"objet",u.getString(l.STAR),36).setTint(16485157).setDepth(-3).setOrigin(0,.5),t.physics.add.sprite(498,50,"star").setScale(.3)}static updateStar(t){this.curStar=t,d.getPreviousState()!==c.PAUSE&&d.getCurrentState()!==c.PLAYING||this.curStarText.setText(t.toString()),u.setNumber(l.STAR,t)}static increaseStar(){this.updateStar(this.curStar+1)}static getCurrentStar(){return this.curStar}}class g extends Phaser.Physics.Arcade.Sprite{constructor(t){super(t.scene,t.x,t.y,"star"),this.isActive=!0,t.ball&&(this.ball=t.ball,this.scene.physics.add.existing(this),this.scene.physics.add.overlap(this.ball,this,(()=>{this.isActive&&(this.isActive=!1,this.scene.starSound.play(),p.increaseStar(),this.scene.add.tween({targets:this,scale:{value:0},duration:300,ease:"Back.in",onComplete:()=>{this.scale=.3,this.alpha=0}}))})))}}const S=[[0,50],[65,-10],[-65,-10],[45,25],[-45,25]];class m extends Phaser.GameObjects.Container{constructor(t,e,s,a){super(t,e,s),this.otherCirc=[],this.hasBall=!1,this.shootVelocity=new Phaser.Math.Vector2(0,0),this.emitter=new Phaser.Events.EventEmitter,this.ball=a,this.createBasketObjects(t),this.registerOverlapEvent(t),this.registerDragEvents(t),this.isAvaliable=!0}createBasketObjects(t){this.basketTopSprite=t.add.sprite(this.x,this.y,"basket",0).setScale(.4).setOrigin(.5,1.5).setDepth(-3),this.basketBottomSprite=t.add.sprite(0,0,"basket",1).setScale(.4),this.basketEffectSprite=t.add.sprite(0,0,"e3").setScale(.4).setAlpha(0),this.netSprite=t.add.sprite(0,25,"net").setScale(.4),this.centerCirc=t.physics.add.sprite(0,15,"").setCircle(20).setOffset(-4,-4).setAlpha(0);for(let e=0;e<5;e++)this.otherCirc[e]=t.physics.add.sprite(S[e][0],S[e][1],"").setCircle(6).setOffset(10,10).setAlpha(0),this.add(this.otherCirc[e]),t.physics.add.existing(this.otherCirc[e]),this.otherCirc[e].body.setImmovable(!0).setBounce(0).moves=!1,1===e||2===e?t.physics.add.collider(this.otherCirc[e],this.ball,(()=>{this.hasBall||this.ball.resetCombo()})):t.physics.add.collider(this.otherCirc[e],this.ball);this.add(this.netSprite),this.add(this.basketBottomSprite),this.add(this.centerCirc),this.add(this.basketEffectSprite),t.physics.add.existing(this.centerCirc)}createStar(t){this.star||(this.star=new g({scene:t,x:0,y:-70,ball:this.ball}).setScale(.3),this.add(this.star)),this.star.setAlpha(1),this.star.isActive=!0}setMoveable(t){this.moveTween&&this.moveTween.destroy();const e=this.x>300?o.Float(-300,-200):o.Float(200,300),s=o.Percent(50);this.moveTween=s?this.scene.add.tween({targets:this,x:this.x+e,ease:"Sine.easeInOut",duration:2e3,yoyo:!0,repeat:-1}):this.scene.add.tween({targets:this,y:this.y+e,ease:"Sine.easeInOut",duration:2e3,yoyo:!0,repeat:-1}),t?(s?this.scene.dotLine.drawLine(new Phaser.Math.Vector2(this.x,this.y),new Phaser.Math.Vector2(this.x+e,this.y),8):this.scene.dotLine.drawLine(new Phaser.Math.Vector2(this.x,this.y),new Phaser.Math.Vector2(this.x,this.y+e),8),this.moveTween.play()):this.moveTween.pause()}registerOverlapEvent(t){t.physics.add.overlap(this.centerCirc,this.ball,(()=>{!this.hasBall&&this.isAvaliable&&(this.isAvaliable=!1,this.hasBall=!0,this.ball.setBounce(0),this.emitter.emit("onHasBall",this),this.changeBasketTexture(1),this.animateBasketEffect(),this.setMoveable(!1))}))}registerDragEvents(t){t.input.on("dragstart",(t=>{this.hasBall&&(this.dragStartPos=new Phaser.Math.Vector2(t.x,t.y))})),t.input.on("drag",(e=>{this.hasBall&&this.dragStartPos&&(this.handleDragMovement(e),t.dotLine.drawTrajectoryLine(new Phaser.Math.Vector2(this.ball.x,this.ball.y),this.shootVelocity,2e3))})),t.input.on("dragend",(()=>{this.hasBall&&this.shootVelocity.length()>100&&(this.hasBall=!1,this.ball.shoot(this.shootVelocity),t.dotLine.clearTrajectoryLine(),this.changeBasketTexture(0),this.scene.time.delayedCall(300,(()=>{this.isAvaliable=!0})))}))}handleDragMovement(t){this.ball.setGravityY(0),this.ball.setVelocity(0),this.dragPos=new Phaser.Math.Vector2(t.x,t.y),this.shootVelocity=new Phaser.Math.Vector2(7*(this.dragStartPos.x-this.dragPos.x),7*(this.dragStartPos.y-this.dragPos.y));const e=Math.min(this.shootVelocity.length(),1800);this.shootVelocity=new Phaser.Math.Vector2(e*Math.cos(this.shootVelocity.angle()),e*Math.sin(this.shootVelocity.angle())),this.shootVelocity.length()>10&&(this.rotation=this.shootVelocity.angle()+Math.PI/2,Phaser.Math.RotateAroundDistance(this.ball,this.x,this.y,0,2))}animateBasketEffect(){this.basketEffectSprite.setAlpha(1).setScale(.2),this.scene.add.tween({targets:this,rotation:{value:0,duration:300},ease:"Back.out"}),this.scene.add.tween({targets:this.basketEffectSprite,alpha:{value:0,duration:300},scale:{value:1,duration:300},ease:"Quad.out"}),this.scene.add.tween({targets:this.ball,y:{value:this.y+23,duration:150},yolo:!0,ease:"Quad.out"}),this.scene.add.tween({targets:this.netSprite,scaleY:{value:.5,duration:150},yoyo:!0,ease:"Quad.out"})}changeBasketTexture(t){this.basketTopSprite.setTexture("basket",2*t),this.basketBottomSprite.setTexture("basket",2*t+1)}update(){this.basketTopSprite.rotation=this.rotation,this.basketTopSprite.x=this.x,this.basketTopSprite.y=this.y,this.basketTopSprite.setScale(.4*this.scale)}}const b=[[16773923,16763395,16733187],[16720241,16748731,16770215],[15913864,13206644,8866914],[16759739,16737205,11481700],[16719390,16776960,3262164],[16772020,16760745,16755884],[16083527,11742288,6822430],[3355443,14808307,16777215],[16711680,3997696,0],[16770215,16748731,16770215],[2490395,8454196,16711772],[6000569,3153511,196636],[15973576,15242191,9664224],[9614572,16777215,16765516],[3284510,5125686,13441048],[5152573,1986856,1645081]];class x{static init(){this.emitter=new Phaser.Events.EventEmitter,this.currentSkin=u.getInt(l.CURRENT_SKIN),this.unlockedSkins=u.getArray(l.UNLOCKED_SKIN),0===this.unlockedSkins.length&&(this.unlockedSkins=[0])}static unlockSkin(t){this.unlockedSkins.push(t),u.setArray(l.UNLOCKED_SKIN,this.unlockedSkins)}static changeSkin(t){this.currentSkin=t,u.setNumber(l.CURRENT_SKIN,t),this.emitter.emit("skin-changed",t)}static getCurrentSkinColors(){return b[this.currentSkin]}static getCurrentSkin(){return this.currentSkin}static getUnlockedSkins(){return this.unlockedSkins}}x.unlockedSkins=[];class y extends Phaser.Physics.Arcade.Sprite{constructor(t){super(t.scene,t.x,t.y,t.texture,t.frame),this.onSkinChanged=t=>{this.setFrame(t),this.specialParticle.destroy(),this.addSpecialParticle(),this.combo<4&&this.specialParticle.stop()},this._scene=t.scene,this.addSmokeParticle(),this.addSpecialParticle(),this.resetCombo(),t.scene.add.existing(this),t.scene.physics.add.existing(this),x.emitter.on("skin-changed",this.onSkinChanged)}shoot(t){this.setVelocity(t.x,t.y),this.setBounce(.7),this.setGravityY(2e3),this._scene.shootSound.play(),this.combo>3&&this._scene.comboShootSound.play()}getCombo(){return this.combo}increaseCombo(){if(this.combo<10&&this.combo++,3===this.combo&&this.smokeParticle.start(),this.combo>=4){4===this.combo&&this.specialParticle.start();const t=Phaser.Display.Color.IntegerToRGB(b[x.getCurrentSkin()][0]);this._scene.cameras.main.flash(200,t.r,t.g,t.b),this._scene.cameras.main.shake(200,.003)}}resetCombo(){this.combo=0,this.specialParticle.stop(),this.smokeParticle.stop()}addSpecialParticle(){this.specialParticle=this._scene.add.particles(150,450,"special",{color:b[x.getCurrentSkin()],colorEase:"quad.out",lifespan:700,angle:{min:0,max:360},rotate:{min:0,max:360},scale:{start:.35,end:0},speed:{min:10,max:30},frequency:60}),this.specialParticle.startFollow(this,-150,-450),this.specialParticle.setDepth(-4)}addSmokeParticle(){this.smokeParticle=this._scene.add.particles(150,450,"circle",{color:[16777215,15790320,8947848],alpha:{start:.8,end:.1,ease:"sine.out"},colorEase:"quad.out",lifespan:500,angle:{min:0,max:360},rotate:{min:0,max:360},scale:.8,speed:{min:50,max:60},frequency:60}),this.smokeParticle.startFollow(this,-150,-450),this.smokeParticle.setDepth(-5)}update(t,e){if(this.body){const t=this.body.velocity.x;t>10?this.rotation+=.02*e:t<-10&&(this.rotation-=.02*e)}}}var k;class v{constructor(t){this.init(),this.createCurrentScoreText(t),this.createBestScoreText(t),this.createHighScoreText(t)}init(){v.curScore=0,v.highScore=0,v.highScore=u.getInt(l.HIGH_SCORE)}createCurrentScoreText(t){v.curScoreText=t.add.bitmapText(300,170,"objet","0",180).setTint(12698049).setDepth(-3).setOrigin(.5)}createBestScoreText(t){v.bestScoreText=t.add.bitmapText(300,20,"objet","Best Score",40).setTint(16485157).setDepth(-3).setOrigin(.5).setAlpha(0)}createHighScoreText(t){v.highScoreText=t.add.bitmapText(300,70,"objet",u.getString(l.HIGH_SCORE),90).setTint(16485157).setDepth(-3).setOrigin(.5).setAlpha(0)}}k=v,v.updateScore=t=>{k.curScore=t,k.curScore>k.highScore&&(k.highScore=k.curScore,u.setNumber(l.HIGH_SCORE,k.highScore),k.highScoreText.setText(k.highScore.toString())),k.curScoreText.setText(k.curScore.toString())};class C{static init(t){C.scene=t,C.popUpText=t.add.bitmapText(0,0,"objet","",40).setTint(16485157).setDepth(-3).setOrigin(.5).setAlpha(0)}static create(t){this.popUpQueue.push(t)}static playTweenQueue(t,e){const s=this.popUpQueue.shift();s&&(this.popUpText.x=t,this.popUpText.y=e,this.popUpText.setText(s.text).setTint(s.color),this.scene.add.tween({targets:this.popUpText,alpha:{value:1,duration:250,yoyo:!0},y:{value:e-20,duration:300,ease:"Back.out"},onComplete:()=>{this.playTweenQueue(t,e)}}))}}C.popUpQueue=[];class w extends Phaser.GameObjects.NineSlice{constructor(t){super(t.scene,t.x,t.y,"mini-wall",0,25,309,10,10,100,100),this.ball=t.ball,this.scene.add.existing(this).setScale(.65),this.scene.physics.add.existing(this,!1),this.body&&(this.physic=this.body,this.physic.immovable=!0),this.scene.physics.add.collider(this.ball,this,(()=>{this.scene.bounceCount++}))}setActive(t){return this.physic.enable=t,this}}class T extends i().Scene{constructor(){super("game"),this.math=new(i().Math.RandomDataGenerator),this.baskets=[],this.walls=[],this.pointSounds=[],this.handleBallTouch=t=>{if(t===this.targetBasket){this.dotLine.clearNormalLine(),this.generateNextBasket(t),this.draggingZone.y=this.targetBasket.y,this.deadZone.y=t.y+450,this.walls.forEach((t=>t.y=this.targetBasket.y)),this.ball.increaseCombo();const e=this.ball.getCombo();4===e?this.comboStartSound.play():e>4&&this.comboHitSound.play(),this.curScore+=e,this.pointSounds[e-1].play(),v.updateScore(this.curScore),this.bounceCount>1?C.create({text:`Bank shot x${this.bounceCount}`,color:3187455}):1===this.bounceCount&&C.create({text:"Bank shot",color:3187455}),this.previousCombo>0&&e>this.previousCombo&&C.create({text:"Airball",color:16485157}),this.previousCombo=e,C.create({text:`+${e}`,color:13652778}),C.playTweenQueue(t.x,t.y-50)}this.bounceCount=0}}init(){this.dotLine.init()}create(){this.initializeVariables(),this.createBall(),this.createDraggingZone(),this.createDeadZone(),this.createWalls(),this.createBaskets(),this.createMiniWall(),this.configureCamera()}initializeVariables(){this.curScore=0,this.bounceCount=0,this.previousCombo=0,this.camera=this.cameras.main,this.dotLine.init(),this.shootSound=this.sound.add("shoot"),this.kickSound=this.sound.add("kick"),this.dieSound=this.sound.add("die"),this.wallHitSound=this.sound.add("wall-hit"),this.starSound=this.sound.add("star"),this.comboHitSound=this.sound.add("combo-hit"),this.comboShootSound=this.sound.add("combo-shoot"),this.comboStartSound=this.sound.add("combo-start");for(let t=1;t<=10;t++)this.pointSounds[t-1]=this.sound.add(t.toString());this.sound.setMute("false"===u.getString(l.SOUND)),x.init(),C.init(this)}createBall(){this.ball=new y({scene:this,x:150,y:250,texture:"ball",frame:x.getCurrentSkin()}).setDepth(1).setName("Ball").setCircle(116).setScale(.27).setDepth(0).setGravityY(1200).setFriction(0)}createDraggingZone(){this.draggingZone=this.add.rectangle(300,500,n,h,0,0).setInteractive({draggable:!0})}createDeadZone(){this.deadZone=this.add.rectangle(300,h,n,200,0,0),this.physics.add.existing(this.deadZone),this.physics.add.overlap(this.deadZone,this.ball,(()=>{d.getCurrentState()===c.PLAYING&&(d.updateGameState(c.GAME_OVER,this),this.dieSound.play(),this.camera.stopFollow())}))}createWalls(){const t=this.add.image(0,0,"e4").setAlpha(0).setScale(.5),e=[{x:0,y:500,origin:{x:1,y:.5}},{x:n,y:500,origin:{x:0,y:.5}}];this.walls=e.map((t=>this.add.rectangle(t.x,t.y,50,3e3,13224393).setOrigin(t.origin.x,t.origin.y))),this.walls.forEach((e=>{this.physics.add.existing(e),e.body.setImmovable(!0).moves=!1,this.physics.add.collider(this.ball,e,(()=>{this.wallHitSound.play(),t.x=this.ball.x,t.y=this.ball.y,t.setTint(x.getCurrentSkinColors()[0]).setAlpha(0).setScale(.5,.1).setFlipX(t.x>300),this.add.tween({targets:t,alpha:{value:1,duration:100,yoyo:!0},scaleY:{value:2,duration:200},easing:"Quad.out",onComplete:()=>{t.setAlpha(0)}}),this.bounceCount++}))}))}createBaskets(){this.baskets[0]=new m(this,150,400,this.ball),this.baskets[1]=new m(this,480,350,this.ball),this.ball.y=this.baskets[0].y,this.baskets.forEach((t=>{t.emitter.on("onHasBall",this.handleBallTouch),this.add.existing(t)})),this.targetBasket=this.baskets[1],this.add.existing(this.baskets[0]),this.add.existing(this.baskets[1])}configureCamera(){this.input.dragDistanceThreshold=10,this.camera.startFollow(this.ball,!1,0,.01,-150,250)}createMiniWall(){this.miniWall=new w({scene:this,x:300,y:100,ball:this.ball}).setActive(!1).setScale(0)}generateNextBasket(t){const e=this.baskets.indexOf(t),s=this.baskets[1-e];this.targetBasket=s,this.targetBasket.y=this.math.integerInRange(t.y-450,t.y-150),0===e?(this.targetBasket.x=this.math.integerInRange(360,480),this.targetBasket.rotation=this.math.realInRange(-.5,0)):(this.targetBasket.x=this.math.integerInRange(120,240),this.targetBasket.rotation=this.math.realInRange(0,.5)),o.Percent(20)&&this.targetBasket.createStar(this),this.miniWall.setActive(!1).setScale(0),o.Percent(10)?this.targetBasket.setMoveable(!0):o.Percent(10)&&(this.miniWall.setActive(!0).y=this.targetBasket.y-50,this.add.tween({targets:this.miniWall,scale:.65,duration:300,ease:"Back.out"}),this.miniWall.x=this.targetBasket.x+(o.Percent(50)?100:-100)),this.targetBasket.scale=.01,this.add.tween({targets:this.targetBasket,scale:1,duration:300,ease:"Back.out"})}update(t,e){this.ball.update(t,e),this.baskets[0].update(),this.baskets[1].update()}}class B extends Phaser.Plugins.ScenePlugin{constructor(t,e,s){super(t,e,s)}init(){this.scene&&(this.trajectoryLineGraphics=this.scene.add.graphics(),this.normalLineGraphics=this.scene.add.graphics())}drawLine(t,e,s){this.normalLineGraphics.clear();const a=s||10;for(let s=0;s<a;s++){const i=(e.x-t.x)/a*s+t.x,r=(e.y-t.y)/a*s+t.y;this.normalLineGraphics.fillStyle(13224393,1),this.normalLineGraphics.setDepth(-4),this.normalLineGraphics.fillCircle(i,r,7)}}drawTrajectoryLine(t,e,s){this.trajectoryLineGraphics.clear();for(let a=0;a<=10;a++){const i=a/20;let r=t.x+e.x*i;const h=t.y+e.y*i+s*i*i/2;r<0?r=-r:r>n&&(r=n-(r-n)),this.trajectoryLineGraphics.fillStyle(15902267,1),this.trajectoryLineGraphics.setDepth(-2),this.trajectoryLineGraphics.fillCircle(r,h,15/(a+1)+5)}}clearTrajectoryLine(){this.trajectoryLineGraphics.clear()}clearNormalLine(){this.normalLineGraphics.clear()}}class f extends Phaser.GameObjects.Image{constructor(t){super(t.scene,t.x,t.y,t.texture,t.frame),this.setInteractive(),this.pointerDownCallback=t.pointerDownCallback,this.pointerUpCallback=t.pointerUpCallback,this.on("pointerdown",this.onPointerDown),this.on("pointerup",this.onPointerUp),this.on("pointerout",this.onPointerOut),this.defaultScale=t.scale,this.setScale(t.scale),this.isDown=!1,t.scene.add.existing(this)}onPointerDown(){this.setScale(.9*this.defaultScale),this.isDown=!0,void 0!==this.pointerDownCallback&&this.pointerDownCallback()}onPointerUp(){this.setScale(this.defaultScale),this.isDown&&(this.isDown=!1,void 0!==this.pointerUpCallback&&this.pointerUpCallback())}onPointerOut(){this.setScale(this.defaultScale)}}class P extends Phaser.Scene{constructor(){super("main-menu"),this.handlePauseButtonClick=()=>{d.getCurrentState()===c.PLAYING&&d.updateGameState(c.PAUSE,this)},this.handleCustomizeButtonClick=()=>{d.updateGameState(c.CUSTOMIZE,this)},this.handleSettingsButtonClick=()=>{d.updateGameState(c.SETTINGS,this)},this.onGameStateChanged=t=>{t===c.GAME_OVER&&this.tweens.add({targets:this.pauseBtn,alpha:{value:0,duration:500},ease:"Quad.out"})},d.emitter.on("game-state-changed",this.onGameStateChanged)}create(){this.createTitle(),this.createHelpAnimation(),this.createPauseButton(),this.createSettingsButton(),this.createCustomizeButton(),this.setupInputEvents(),new p(this)}createTitle(){this.title=this.add.image(300,-250,"title").setScale(.5),this.tweens.add({targets:this.title,y:{value:250,duration:500},ease:"Quad.out"})}createHelpAnimation(){this.help=this.add.sprite(120,880,"help").setScale(.6),this.help.anims.create({key:"idle",frames:this.anims.generateFrameNames("help",{start:0,end:23}),frameRate:32,repeat:-1}),this.help.play("idle")}createPauseButton(){this.pauseBtn=new f({scene:this,x:36,y:35,texture:"pause-btn",scale:.25,pointerUpCallback:this.handlePauseButtonClick}).setAlpha(0)}createSettingsButton(){this.settingsBtn=new f({scene:this,x:36,y:35,texture:"settings-mainmenu-btn",scale:1,pointerDownCallback:this.handleSettingsButtonClick})}createCustomizeButton(){this.customizeBtn=new f({scene:this,x:420,y:850,texture:"customize-mainmenu-btn",scale:.4,pointerDownCallback:this.handleCustomizeButtonClick})}setupInputEvents(){this.input.on("pointerdown",(()=>{d.getCurrentState()===c.READY&&(d.updateGameState(c.PLAYING,this),this.handleGameStart())}))}handleGameStart(){this.tweens.add({targets:[this.title,this.help,this.customizeBtn,this.settingsBtn],alpha:{value:0,duration:500},ease:"Quad.out"}),this.tweens.add({targets:this.pauseBtn,alpha:{value:1,duration:500},ease:"Quad.out"}),this.help.stop()}}class E extends Phaser.Scene{constructor(){super("result"),this.onGameStateChanged=t=>{t===c.GAME_OVER&&this.showResult()},d.init(),d.emitter.on("game-state-changed",this.onGameStateChanged)}create(){this.score=new v(this),this.shareBtn=new f({scene:this,x:.28*n,y:800,texture:"share-btn",scale:.4}).setScale(0),this.resetBtn=new f({scene:this,x:300,y:800,texture:"reset-btn",scale:.4,pointerUpCallback:()=>{d.updateGameState(c.READY,this)}}).setScale(0),this.settingsBtn=new f({scene:this,x:432,y:800,texture:"settings-btn",scale:.4,pointerUpCallback:()=>{d.updateGameState(c.SETTINGS,this)}}).setScale(0)}showResult(){this.resetBtn.setScale(0),this.settingsBtn.setScale(0),this.shareBtn.setScale(0),this.add.tween({targets:[this.resetBtn,this.settingsBtn,this.shareBtn],scale:{value:.4,duration:300},ease:"Quad.out"}),this.add.tween({targets:[v.highScoreText,v.bestScoreText],alpha:{value:1,duration:500},ease:"Quad.out"})}}class A extends Phaser.Scene{constructor(){super("pause")}create(){new f({scene:this,x:300,y:350,texture:"mainmenu-btn",scale:.4,pointerUpCallback:()=>{d.updateGameState(c.READY,this)}}),new f({scene:this,x:300,y:450,texture:"customize-btn",scale:.4,pointerUpCallback:()=>{d.updateGameState(c.CUSTOMIZE,this)}}),new f({scene:this,x:300,y:550,texture:"settings-pause-btn",scale:.4,pointerUpCallback:()=>{d.updateGameState(c.SETTINGS,this)}}),new f({scene:this,x:300,y:650,texture:"resume-btn",scale:.4,pointerUpCallback:()=>{d.updateGameState(c.PLAYING,this)}})}}class O extends Phaser.Scene{constructor(){super("customize"),this.skins=[]}create(){this.createBackButton(),this.createSkinButtons()}createBackButton(){new f({scene:this,x:36,y:35,texture:"back-btn",scale:.3,pointerUpCallback:()=>{d.getPreviousState()!==c.READY&&d.getPreviousState()!==c.PAUSE||d.updateGameState(d.getPreviousState(),this)}})}createSkinButtons(){const t=x.getUnlockedSkins();this.skins=[];for(let e=0;e<16;e++){if(-1===t.indexOf(e)){const s=new f({scene:this,x:0,y:0,texture:"item",scale:.55,pointerDownCallback:()=>{-1===t.indexOf(e)?p.getCurrentStar()>100&&(p.updateStar(p.getCurrentStar()-100),x.unlockSkin(e),s.setTexture("ball",e)):x.changeSkin(e)}});this.skins.push(s)}else this.skins.push(new f({scene:this,x:0,y:0,texture:"ball",frame:e,scale:.55,pointerDownCallback:()=>{x.changeSkin(e)}}));Phaser.Actions.GridAlign(this.skins,{width:4,height:4,cellWidth:n/4.5,cellHeight:n/4.5,x:0,y:250})}}}class G extends f{constructor(t){super({scene:t.scene,x:t.x,y:t.y,texture:t.textureOn,frame:t.frameOn,scale:t.scale,pointerUpCallback:t.pointerUpCallback,pointerDownCallback:t.pointerDownCallback}),this.isOn=!0,this.s=t}setActive(t){return this.isOn=t,t?this.setTexture(this.s.textureOn,this.s.frameOn):this.setTexture(this.s.textureOff,this.s.frameOff),this}toggle(){this.setActive(!this.isOn)}getActive(){return this.isOn}}class I extends Phaser.Scene{constructor(){super("settings")}create(){this.createBackButton(),this.createTexts(),this.createSwitchButtons(),this.createClearDataButton()}createBackButton(){new f({scene:this,x:36,y:35,texture:"back-btn",scale:.3,pointerUpCallback:()=>{const t=d.getPreviousState();t!==c.READY&&t!==c.PAUSE&&t!==c.GAME_OVER||d.updateGameState(t,this)}})}createTexts(){this.addText(60,300,"SOUNDS"),this.addText(60,400,"VIBRATION"),this.addText(60,500,"NIGHT MODE")}addText(t,e,s){this.add.bitmapText(t,e,"objet",s,50).setTint(12698049).setDepth(-3)}createClearDataButton(){new f({scene:this,x:300,y:700,texture:"cleardata-btn",scale:.5,pointerUpCallback:()=>{u.deleteAll()}})}createSwitchButtons(){this.soundBtn=this.createSwitchButton(420,300,l.SOUND).setActive("true"===u.getString(l.SOUND)),this.vibrationBtn=this.createSwitchButton(420,400,l.VIBRATION).setActive("true"===u.getString(l.VIBRATION)),this.nightModeBtn=this.createSwitchButton(420,500,l.NIGHT_MODE).setActive("true"===u.getString(l.NIGHT_MODE))}createSwitchButton(t,e,s){const a=new G({scene:this,x:t,y:e,textureOn:"rounded-btn",frameOn:0,textureOff:"rounded-btn",frameOff:1,scale:.5,pointerUpCallback:()=>{switch(a.toggle(),u.setString(s,`${a.getActive()}`),s){case l.SOUND:this.scene.get("game").sound.setMute(!a.getActive());case l.VIBRATION:case l.NIGHT_MODE:}}}).setOrigin(0);return a}}const D={type:i().WEBGL,physics:{default:"arcade",arcade:{gravity:{y:0}}},scale:{width:n,height:h,parent:"phaser-game",mode:i().Scale.FIT,autoCenter:i().Scale.CENTER_BOTH},plugins:{scene:[{key:"DotLinePlugin",plugin:B,start:!0,mapping:"dotLine"}]},roundPixels:!0,backgroundColor:"0xe5e5e5",scene:[r,T,E,P,O,I,A]};new(i().Game)(D)}},s={};function a(t){var i=s[t];if(void 0!==i)return i.exports;var r=s[t]={exports:{}};return e[t].call(r.exports,r,r.exports,a),r.exports}a.m=e,t=[],a.O=(e,s,i,r)=>{if(!s){var n=1/0;for(l=0;l<t.length;l++){for(var[s,i,r]=t[l],h=!0,o=0;o<s.length;o++)(!1&r||n>=r)&&Object.keys(a.O).every((t=>a.O[t](s[o])))?s.splice(o--,1):(h=!1,r<n&&(n=r));if(h){t.splice(l--,1);var c=i();void 0!==c&&(e=c)}}return e}r=r||0;for(var l=t.length;l>0&&t[l-1][2]>r;l--)t[l]=t[l-1];t[l]=[s,i,r]},a.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return a.d(e,{a:e}),e},a.d=(t,e)=>{for(var s in e)a.o(e,s)&&!a.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:e[s]})},a.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),(()=>{var t={179:0};a.O.j=e=>0===t[e];var e=(e,s)=>{var i,r,[n,h,o]=s,c=0;if(n.some((e=>0!==t[e]))){for(i in h)a.o(h,i)&&(a.m[i]=h[i]);if(o)var l=o(a)}for(e&&e(s);c<n.length;c++)r=n[c],a.o(t,r)&&t[r]&&t[r][0](),t[r]=0;return a.O(l)},s=self.webpackChunktype_project_template=self.webpackChunktype_project_template||[];s.forEach(e.bind(null,0)),s.push=e.bind(null,s.push.bind(s))})();var i=a.O(void 0,[216],(()=>a(345)));i=a.O(i)})();