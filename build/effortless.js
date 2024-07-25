/*! bga-effortless 2024-07-25 */
var __extends=this&&this.__extends||function(){var a=function(t,e){return(a=Object.setPrototypeOf||({__proto__:[]}instanceof Array?function(t,e){t.__proto__=e}:function(t,e){for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])}))(t,e)};return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function o(){this.constructor=t}a(t,e),t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)}}(),GameBasics=function(e){function t(){var t=e.call(this)||this;return t.curstate=null,t.pendingUpdate=!1,t.currentPlayerWasActive=!1,console.log("(BASICS) game constructor"),t}return __extends(t,e),t.prototype.setup=function(t){console.log("(BASICS) Starting game setup"),this.gamedatas=t},t.prototype.onEnteringState=function(t,e){this.curstate=t,e=e?e.args:null,this.callfn("onEnteringState_"+t,e),this.pendingUpdate&&(this.onUpdateActionButtons(t,e),this.pendingUpdate=!1)},t.prototype.onLeavingState=function(t){this.currentPlayerWasActive=!1},t.prototype.onUpdateActionButtons=function(t,e){console.log("(BASICS) onUpdateActionButtons()"),this.curstate!==t?this.pendingUpdate=!0:(this.pendingUpdate=!1,gameui.isCurrentPlayerActive()&&!1===this.currentPlayerWasActive?(console.log("onUpdateActionButtons: "+t,e,this.debugStateInfo()),this.currentPlayerWasActive=!0,this.callfn("onUpdateActionButtons_"+t,e)):this.currentPlayerWasActive=!1)},t.prototype.debugStateInfo=function(){var t=gameui.isCurrentPlayerActive(),e=!1;return"undefined"!=typeof g_replayFrom&&(e=!0),{instantaneousMode:!!gameui.instantaneousMode,isCurrentPlayerActive:t,replayMode:e}},t.prototype.ajaxCallWrapper=function(t,e,o,a){void 0===o&&(o=!1),(e=e||{}).lock=!0,(o||gameui.checkAction(t))&&gameui.ajaxcall("/"+gameui.game_name+"/"+gameui.game_name+"/"+t+".html",e,gameui,function(t){},a)},t.prototype.onScriptError=function(t,e,o){if(!gameui.page_is_unloading)return console.error(t),this.inherited(arguments)},t.prototype.wipeOutAndDestroy=function(t,e){void 0===(e=void 0===e?{}:e).duration&&(e.duration=500),this.instantaneousMode&&(e.duration=Math.min(1,e.duration)),e.node=t;t=dojo.fx.wipeOut(e);dojo.connect(t,"onEnd",function(t){dojo.destroy(t)}),t.play()},t.prototype.placeAndWipeIn=function(t,e,o){void 0===o&&(o={});t=dojo.place(t,e);dojo.setStyle(t,"display","none"),void 0===o.duration&&(o.duration=500),this.instantaneousMode&&(o.duration=Math.min(1,o.duration)),o.node=t,dojo.fx.wipeIn(o).play()},t.prototype.callfn=function(t,e){if(void 0!==this[t])return console.log("Calling "+t,e),this[t](e)},t.prototype.triggerUpdateActionButtons=function(){this.updatePageTitle()},t}(GameGui=function(){}),__extends=this&&this.__extends||function(){var a=function(t,e){return(a=Object.setPrototypeOf||({__proto__:[]}instanceof Array?function(t,e){t.__proto__=e}:function(t,e){for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])}))(t,e)};return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function o(){this.constructor=t}a(t,e),t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)}}(),GameBody=function(o){function t(){var c=o.call(this)||this;return c.mutableBoardState=null,c.privateState=null,c.tablewidePanelEl=void 0,c.inputArgs=null,c.selectedLocation=null,c.selectedCard=null,c.selectedEffortPile=null,c.handZone=null,c.locationZones={},c.locationByPos={},console.log("effortless constructor"),c.cardZoneObserver=new MutationObserver(function(t,e){for(var o=0,a=t;o<a.length;o++)for(var i=a[o],r=0,s=Array.from(i.addedNodes);r<s.length;r++){var n=s[r];c.onCardAddedToZone(n,c.getCardState(c.cardIdFromElId(n.id)))}}),c}return __extends(t,o),t.prototype.setup=function(t){console.log("*** Entering `setup()`; gamedatas=",t);var e,o,a=document.querySelector("#ewc_handarea #ewc_handarea_zone");for(e in this.handZone=new ebg.zone,this.setUpCardZone(this.handZone,a),t.players)t.players.hasOwnProperty(e)&&(o=t.players[e],console.log(o));this.setupSeatBoards(t.mutableBoardState),this.setupPlayArea(t.mutableBoardState),this.setupNotifications();for(var i=0,r=this.allCardZones();i<r.length;i++){var s=r[i];this.cardZoneObserver.observe(s.container_div,{childList:!0})}console.log("Ending game setup")},t.prototype.onCardAddedToZone=function(t,e){e=e.visible?StaticDataCards.cardMetadata[e.cardType]:null;null!==e?(console.log("  metadata found; adding tooltip: ",t.id,e),this.addTooltipHtml(t.id,this.format_block("jstpl_tooltip_card",e))):this.removeTooltip(t.id)},t.prototype.updatePlayerOrdering=function(){console.log("*** updatePlayerOrdering()");for(var t=1,e=0,o=Object.keys(this.gamedatas.playerorder);e<o.length;e++){var a=o[e],a=this.gamedatas.playerorder[a];dojo.place("overall_player_board_"+a,"player_boards",t),t++}},t.prototype.setupSeatBoards=function(t){console.log("setupSeatBoards(): #player_boards =",$("player_boards").children.length),this.tablewidePanelEl=dojo.place(this.format_block("jstpl_tablewide_panel",{}),$("player_boards"),"first");for(var e={},o=0,a=Object.values(t.effortPiles);o<a.length;o++){var i=a[o];null===i.locationId&&(e[i.seatId]=i)}for(var r=0,s=Object.values(t.seats);r<s.length;r++){var n=s[r],c=(null===n.playerId&&dojo.place(this.format_block("jstpl_seat_board",{seatColor:n.seatColor,seatId:n.id,seatLabel:n.seatLabel}),$("player_boards")),null===n.playerId?document.querySelector("#overall_seat_board_"+n.id+" .player_panel_content"):document.querySelector("#overall_player_board_"+n.playerId+" .player_panel_content"));dojo.place(this.format_block("jstpl_seat_board_contents",{colorName:n.colorName,reservePileId:e[n.id].id}),c)}document.querySelectorAll(".player_score").forEach(function(t){t.style.visibility="hidden"})},t.prototype.setupPlayArea=function(a){for(var i=this,t=0,e=Object.values(a.locations);t<e.length;t++){var o=e[t];this.locationByPos[o.sublocationIndex]=o}for(var r=this,s=0;s<6;++s)!function(e){var t=dojo.place(r.format_block("jstpl_setloc_panel",{classes:"ewc_setloc_location_"+r.locationByPos[e].id,id:"ewc_setloc_panel_"+e}),$("ewc_setlocarea_column_"+e%2));dojo.connect(t.querySelector(".ewc_setloc_setloc_wrap"),"onclick",r,function(t){i.onClickLocation(t,i.locationByPos[e].id)})}(s);for(var n=0,c=Object.values(a.locations);n<c.length;n++){var l=c[n],f=(console.log("*** location",l),document.querySelector("#ewc_setloc_panel_"+l.sublocationIndex+" .ewc_setloc_cards")),h=new ebg.zone;this.setUpCardZone(h,f),this.locationZones[l.id]=h}for(var d=this,_=0,p=Object.values(a.effortPiles);_<p.length;_++)!function(e){var t,o;null!==e.locationId&&(o=a.seats[e.seatId],t=a.locations[e.locationId],t=document.querySelector("#ewc_setloc_panel_"+t.sublocationIndex+" .ewc_effort_counter_wrap"),o=dojo.place(d.format_block("jstpl_effort_counter",{colorName:o.colorName,id:e.id}),t),dojo.connect(o,"onclick",d,function(t){i.onClickEffortPile(t,e.id)}))}(p[_]);this.applyState(a,null)},t.prototype.setUpCardZone=function(o,t){o.create(this,t,50,185),o.setPattern("custom"),o.itemIdToCoords=function(t,e){e=(e-(o.item_width+35*(o.items.length-1)))/2;return{h:o.item_height,w:o.item_width,x:e+35*t,y:0}}},t.prototype.applyState=function(t,e){for(var o=this,a=(null==t?(t=this.mutableBoardState,console.log("applyState(): using cached mutableBoardState")):(this.mutableBoardState=t,console.log("applyState(): using novel mutableBoardState")),null==e?(e=this.privateState,console.log("applyState(): using cached privateState")):(this.privateState=e,console.log("applyState(): using novel privateState")),console.log("using mutableBoardState & privateState:",t,e),null!==t&&(console.log("applyState(): updating mutableBoardState",t),this.applyMutableBoardState(t)),{}),i=0,r=this.allCardState();i<r.length;i++){var s=r[i];switch(s.sublocation){case"SETLOC":case"HAND":a[s.id]=!0}this.placeCard(s)}console.log("*** seenCardIds:",a),document.querySelectorAll(".ewc_card_playarea").forEach(function(t){var e=o.cardIdFromElId(t.id);console.log("  - existent card ID:",t.id,e),a.hasOwnProperty(e)||(console.log("     not present in update; destroying el!"),o.removeFromCardZones(t,!0))}),this.rescaleCardSprites(),this.refreshUiElements()},t.prototype.allCardState=function(){var t=[];return null!==this.privateState&&(t=t.concat(Object.values(this.privateState.cards))),t=null!==this.mutableBoardState?t.concat(Object.values(this.mutableBoardState.cards)):t},t.prototype.getCardState=function(t){for(var e=0,o=this.allCardState();e<o.length;e++){var a=o[e];if(a.id===t)return a}return null},t.prototype.refreshUiElements=function(){this.handZone.updateDisplay();for(var t=0,e=Object.values(this.locationZones);t<e.length;t++)e[t].updateDisplay()},t.prototype.cardIdFromElId=function(t){t=/^cardid_(\d+)$/.exec(t);return parseInt(t[1],10)},t.prototype.rescaleCardSprites=function(){var e=this;console.log("*** qsa ***"),document.querySelectorAll(".tmp_scalable_card").forEach(function(t){t.classList.contains("tmp_scaled_card")||(t.classList.add("tmp_scaled_card"),e.rescaleSprite(t,.5))})},t.prototype.applyMutableBoardState=function(t){var e=this;this.mutableBoardState=t;for(var o=0,a=Object.values(t.locations);o<a.length;o++){var i=a[o];console.log("*** location",i),document.querySelector("#ewc_setloc_panel_"+i.sublocationIndex+" .ewc_setloc_location").classList.add(i.cardType.replace(":","_"))}for(var r=0,s=Object.values(t.effortPiles);r<s.length;r++){var n=s[r];document.querySelector("#ewc_effort_counter_"+n.id+" .ewc_effort_counter_value").innerText=""+n.qty}for(var c=0,l=Object.values(t.settings);c<l.length;c++){var f=l[c];document.querySelector("#ewc_setloc_panel_"+f.sublocationIndex+" .ewc_setloc_setting").classList.add(f.cardType.replace(":","_"))}document.querySelectorAll(".tmp_scalable_cube").forEach(function(t){t.classList.contains("tmp_scaled_cube")||(t.classList.add("tmp_scale_cube"),e.rescaleSpriteCube(t,.6))}),document.querySelectorAll(".tmp_tintable").forEach(function(t){t.classList.contains("tmp_tinted")||(t.classList.add("tmp_tinted"),t.classList.contains("ewc_playercolor_teal")&&e.tintSprite(t,"#00b796"),t.classList.contains("ewc_playercolor_pink")&&e.tintSprite(t,"#ff5fa2"),t.classList.contains("ewc_playercolor_blue")&&e.tintSprite(t,"#001489"),t.classList.contains("ewc_playercolor_yellow")&&e.tintSprite(t,"#ffe900"),t.classList.contains("ewc_playercolor_white")&&e.tintSprite(t,"#ffffff"))})},t.prototype.allCardZones=function(){return[this.handZone].concat(Object.values(this.locationZones))},t.prototype.placeCardInZone=function(t,e){t.isInZone(e.id)||(this.removeFromCardZones(e,!1),t.placeInZone(e.id))},t.prototype.removeFromCardZones=function(t,e){for(var o=0,a=this.allCardZones();o<a.length;o++)a[o].removeFromZone(t.id,!1);e&&this.fadeOutAndDestroy(t)},t.prototype.placeCard=function(t){switch(t.sublocation){case"SETLOC":case"HAND":break;default:return}console.log("*** card",t);var e,o=document.getElementById("cardid_"+t.id);switch(null===o&&(e=document.getElementById("tablewide_panel"),i=t.visible?t.cardType:"back",o=dojo.place(this.format_block("jstpl_playarea_card",{cardType:i,id:t.id}),e)),t.sublocation){case"SETLOC":console.log("  - in setloc");var a=this.locationByPos[t.sublocationIndex];this.placeCardInZone(this.locationZones[a.id],o);break;case"HAND":console.log("  - in hand"),this.placeCardInZone(this.handZone,o);break;default:console.log("  - other sublocation: "+t.sublocation)}var i=t.visible?t.cardType:"back";if(!o.classList.contains("card_"+i)){for(var r=0,s=Array.from(o.classList).filter(function(t){return t.match(/^card_/)});r<s.length;r++){var n=s[r];o.classList.remove(n)}o.classList.add("card_"+i),this.rescaleSprite(o,.5)}this.onCardAddedToZone(o,t)},t.prototype.getSpriteName=function(t){for(var e=0,o=Object.values(t.classList);e<o.length;e++){var a=o[e];if(console.log(a),a.match(/^card_/g))return a}throw new Error("XXX: Unable to find sprite name.")},t.prototype.rescaleSprite=function(t,e){var o=this.getSpriteName(t),o=StaticDataSprites.spriteMetadata[o],a=(t.style.height=o.height*e+"px",t.style.width=o.width*e+"px",StaticDataSprites.totalWidth*e+"px "+StaticDataSprites.totalHeight*e+"px");t.style.backgroundSize=a,t.style.backgroundPosition=o.offsetX*e+"px "+o.offsetY*e+"px"},t.prototype.rescaleSpriteCube=function(t,e){t.style.height=30*e+"px",t.style.width=30*e+"px";var o=312*e+"px "+302.4*e+"px",o=(t.style.backgroundSize=o,t.style.maskSize=o,-276*e+"px "+-121.2*e+"px");t.style.backgroundPosition=o,t.style.maskPosition=o},t.prototype.tintSprite=function(t,e){t.style.backgroundBlendMode="multiply",t.style.backgroundColor=e},t.prototype.format_string_recursive=function(t,e){var o;for(console.log("XXX:",e);o=t,(t=this.inherited(arguments))!==o;);return this.replaceLogEntities(t)},t.prototype.replaceLogEntities=function(t){return t.replace(/:([a-z0-9-_]+)=([a-z0-9-_]+?):/g,function(t,e,o){return console.log("match parts: ",t,e,o),o.charAt(0).toUpperCase()+o.slice(1)})},t.prototype.updateSelectables=function(t){var a=this;switch(console.log("*** updateSelectables()"),document.querySelectorAll(".ewc_selectable").forEach(function(t){t.classList.remove("ewc_selectable")}),document.querySelectorAll(".ewc_unselectable").forEach(function(t){t.classList.remove("ewc_unselectable")}),document.querySelectorAll(".ewc_selected").forEach(function(t){t.classList.remove("ewc_selected")}),t.inputType){case"inputtype:location":console.log("  *** inputtype:location");for(var e=0,o=t.choices;e<o.length;e++){var i=o[e];document.querySelector(".ewc_setloc_location_"+i+" .ewc_setloc_setloc_wrap").classList.add("ewc_selectable")}document.querySelectorAll(".ewc_setloc_setloc_wrap:not(.ewc_selectable)").forEach(function(t){t.classList.add("ewc_unselectable")});break;case"inputtype:card":console.log("  *** inputtype:card",t),this.placeAndWipeIn(this.format_block("jstpl_promptarea",{}),"ewc_promptarea_wrap");for(var r=this,s=0,n=Object.values(t.choices);s<n.length;s++)!function(t){var e=t,t=e.visible?e.cardType:"back",o=document.querySelector(".ewc_promptarea .ewc_promptarea_choices"),t=dojo.place(r.format_block("jstpl_prompt_card",{cardType:t,id:e.id}),o);r.rescaleSprite(t,.35),t.classList.add("ewc_selectable"),dojo.connect(t,"onclick",r,function(t){a.onClickCard(t,e.id)})}(n[s]);break;case"inputtype:effort-pile":console.log("  *** inputtype:effort-pile");for(var c=0,l=t.choices;c<l.length;c++){i=l[c];document.querySelector("#ewc_effort_counter_"+i).classList.add("ewc_selectable")}document.querySelectorAll(".ewc_effort_counter:not(.ewc_selectable)").forEach(function(t){t.classList.add("ewc_unselectable")});break;default:throw new Error("Unexpected input type: "+t.inputType)}},t.prototype.onClickLocation=function(t,e){console.log("onClickLocation",t),null!==this.inputArgs&&"inputtype:location"===this.inputArgs.inputType&&this.inputArgs.choices.includes(e)&&(document.querySelectorAll(".ewc_selected").forEach(function(t){t.classList.remove("ewc_selected")}),t.currentTarget.classList.add("ewc_selected"),this.selectedLocation=e,this.triggerUpdateActionButtons())},t.prototype.onClickEffortPile=function(t,e){console.log("onClickEffortPile",t),console.log("  clicked pile = "+e+"; choices = ",this.inputArgs.choices),null!==this.inputArgs&&"inputtype:effort-pile"===this.inputArgs.inputType&&this.inputArgs.choices.includes(e)&&(document.querySelectorAll(".ewc_selected").forEach(function(t){t.classList.remove("ewc_selected")}),t.currentTarget.classList.add("ewc_selected"),this.selectedEffortPile=e,this.triggerUpdateActionButtons())},t.prototype.onClickCard=function(t,e){console.log("onClickCard",t),null!==this.inputArgs&&"inputtype:card"===this.inputArgs.inputType&&this.inputArgs.choices.map(function(t){return t.id}).includes(e)&&(document.querySelectorAll(".ewc_selected").forEach(function(t){t.classList.remove("ewc_selected")}),t.currentTarget.classList.add("ewc_selected"),this.selectedCard=e,this.triggerUpdateActionButtons())},t.prototype.onEnteringState=function(t,e){switch(console.log("Entering state",t,e),o.prototype.onEnteringState.call(this,t,e),null!==e&&null!==e.args&&this.applyState(e.args.mutableBoardState,e.args._private),t){case"stInput":this.isCurrentPlayerActive()&&(console.log("*** stInput: ",e),this.inputArgs=e.args.input,this.updateSelectables(e.args.input));break;case"stPostScoring":console.log("*** stPostScoring: ",e)}},t.prototype.onLeavingState=function(t){var e=this;console.log("Leaving state: "+t),o.prototype.onLeavingState.call(this,t),this.inputArgs=null,document.querySelectorAll(".ewc_promptarea").forEach(function(t){e.wipeOutAndDestroy(t)})},t.prototype.onUpdateActionButtons=function(t,e){var o=this;if(console.log("onUpdateActionButtons()",t,e),this.isCurrentPlayerActive()&&"stInput"===t){this.addActionButton("btn_input_confirm",_("Confirm"),function(){var t=null;switch(o.inputArgs.inputType){case"inputtype:location":t={selection:JSON.stringify({inputType:"inputtype:location",value:o.selectedLocation})};break;case"inputtype:card":t={selection:JSON.stringify({inputType:"inputtype:card",value:o.selectedCard})};break;case"inputtype:effort-pile":t={selection:JSON.stringify({inputType:"inputtype:effort-pile",value:o.selectedEffortPile})};break;default:throw new Error("Unexpected input type.")}console.log("confirmed!",t),o.ajaxCallWrapper("actSelectInput",t)},void 0,void 0,"blue");var a=!1;if(null!==this.inputArgs)switch(this.inputArgs.inputType){case"inputtype:location":a=null!==this.selectedLocation;break;case"inputtype:card":a=null!==this.selectedCard;break;case"inputtype:effort-pile":a=null!==this.selectedEffortPile;break;default:throw new Error("Unexpected input type.")}a||dojo.addClass("btn_input_confirm","disabled")}},t.prototype.setupNotifications=function(){console.log("notifications subscriptions setup")},t}(GameBasics),StaticDataCards=(define(["dojo","dojo/_base/declare","ebg/core/gamegui","ebg/counter","ebg/stock","ebg/zone"],function(t,e){e("bgagame.effortless",ebg.core.gamegui,new GameBody)}),function(){function t(){}return t.cardMetadata={attr_str_1:{title:"Strength +1"},attr_dex_1:{title:"Dexterity +1"},attr_con_1:{title:"Constitution +1"},attr_wis_1:{title:"Wisdom +1"},attr_int_1:{title:"Intelligence +1"},attr_cha_1:{title:"Charisma +1"},attr_str_2:{title:"Strength +2"},attr_dex_2:{title:"Dexterity +2"},attr_con_2:{title:"Constitution +2"},attr_wis_2:{title:"Wisdom +2"},attr_int_2:{title:"Intelligence +2"},attr_cha_2:{title:"Charisma +2"},item_1:{title:"Silver Sword"},item_2:{title:"Compact Crossbow"},item_3:{title:"Poison Antidote"},item_4:{title:"Binding Rope"},item_5:{title:"Phantom Lantern"},item_6:{title:"Loaded Dice"},item_7:{title:"Handy Cannon"},item_8:{title:"Reflective Shield"},item_9:{title:"Awakened Artifact"},item_10:{title:"Wooden Stake"},item_11:{title:"Glacial Spear"},item_12:{title:"Sea Trident"},item_13:{title:"Iron Horseshoes"},item_14:{title:"Holy Water"},item_15:{title:"Explosive Trap"},item_16:{title:"Woven Net"},item_17:{title:"Hypnotic Flute"},item_18:{title:"Crystal Goggles"},item_19:{title:"Burning Torch"},item_20:{title:"Music Box"},item_21:{title:"Cheese Wheel"},armor_mage_head:{title:"Armor: mage head"},armor_mage_chest:{title:"Armor: mage chest"},armor_mage_hands:{title:"Armor: mage hands"},armor_mage_feet:{title:"Armor: mage feet"},armor_plate_head:{title:"Armor: plate head"},armor_plate_chest:{title:"Armor: plate chest"},armor_plate_hands:{title:"Armor: plate hands"},armor_plate_feet:{title:"Armor: plate feet"},armor_leather_head:{title:"Armor: leather head"},armor_leather_chest:{title:"Armor: leather chest"},armor_leather_hands:{title:"Armor: leather hands"},armor_leather_feet:{title:"Armor: leather feet"},armor_obsidian_head:{title:"Armor: obsidian head"},armor_obsidian_chest:{title:"Armor: obsidian chest"},armor_obsidian_hands:{title:"Armor: obsidian hands"},armor_obsidian_feet:{title:"Armor: obsidian feet"},armor_scale_head:{title:"Armor: scale head"},armor_scale_chest:{title:"Armor: scale chest"},armor_scale_hands:{title:"Armor: scale hands"},armor_scale_feet:{title:"Armor: scale feet"},armor_assassin_head:{title:"Armor: assassin head"},armor_assassin_chest:{title:"Armor: assassin chest"},armor_assassin_hands:{title:"Armor: assassin hands"},armor_assassin_feet:{title:"Armor: assassin feet"},xp:{title:"Experience"},grit:{title:"Grit"}},t}()),StaticDataSetlocs=function(){function t(){}return t.locationMetadata={coliseum:{name:"Coliseum",text:"Take one card from here and discard the other."},library:{name:"Library",text:"View both cards here and take 1.  Replace the missing card face-down."},market:{name:"Market",text:"Discard a card from your hand and take both cards here."},cave:{name:"Cave",text:""},river:{name:"River",text:"Discard a card at another location."},prison:{name:"Prison",text:"Move another player’s effort from any other location to here."},tunnels:{name:"Tunnels",text:"Move another player’s effort from here to any other location."},city:{name:"City",text:"Move one of your effort from any other location to here."},wasteland:{name:"Wasteland",text:""},docks:{name:"Docks",text:"Move one of your effort from here to any other location."},temple:{name:"Temple",text:"Discard a card from your hand to take the top 2 cards from the deck."},crypt:{name:"Crypt",text:"Take 1 of the top 2 cards from the discard."},tundra:{name:"Tundra",text:"Once all players have placed half of their effort, replace this location at random."}},t.settingMetadata={active:{name:"Active",text:"Most here gains 4 points."},crowded:{name:"Crowded",text:"Gain 10 points if you have at least 5 effort here."},lively:{name:"Lively",text:"Gain 1 point for each effort here."},peaceful:{name:"Peaceful",text:"Gain 3 points for every 2 effort here."},battling:{name:"Battling",text:"Most here gains 8 points."},barren:{name:"Barren",text:""},hidden:{name:"Hidden",text:"Least here loses 5 points."},treacherous:{name:"Treacherous",text:"Lose 1 point for each effort here."},quiet:{name:"Quiet",text:"Most here loses 5 points."},eerie:{name:"Eerie",text:"Least here gains 5 points."},holy:{name:"Holy",text:"Most here gains 2 points for each effort."},ghostly:{name:"Ghostly",text:"Lose 2 points for every 2 effort here."},frozen:{name:"Frozen",text:"Once all players have placed half of their effort, replace this setting at random."}},t}(),StaticDataSprites=function(){function t(){}return t.totalWidth=3517.2,t.totalHeight=3328.2,t.spriteMetadata={card_armor_assassin_chest:{width:233.4,height:363.6,offsetX:0,offsetY:0},card_armor_assassin_feet:{width:233.4,height:363.6,offsetX:-233.4,offsetY:0},card_armor_assassin_hands:{width:233.4,height:363.6,offsetX:-466.8,offsetY:0},card_armor_assassin_head:{width:233.4,height:363.6,offsetX:-700.2,offsetY:0},card_armor_leather_chest:{width:233.4,height:363.6,offsetX:0,offsetY:-363.6},card_armor_leather_feet:{width:233.4,height:363.6,offsetX:-233.4,offsetY:-363.6},card_armor_leather_hands:{width:233.4,height:363.6,offsetX:-466.8,offsetY:-363.6},card_armor_leather_head:{width:233.4,height:363.6,offsetX:-700.2,offsetY:-363.6},card_armor_mage_chest:{width:233.4,height:363.6,offsetX:-933.6,offsetY:0},card_armor_mage_feet:{width:233.4,height:363.6,offsetX:-933.6,offsetY:-363.6},card_armor_mage_hands:{width:233.4,height:363.6,offsetX:0,offsetY:-727.2},card_armor_mage_head:{width:233.4,height:363.6,offsetX:-233.4,offsetY:-727.2},card_armor_obsidian_chest:{width:233.4,height:363.6,offsetX:-466.8,offsetY:-727.2},card_armor_obsidian_feet:{width:233.4,height:363.6,offsetX:-700.2,offsetY:-727.2},card_armor_obsidian_hands:{width:233.4,height:363.6,offsetX:-933.6,offsetY:-727.2},card_armor_obsidian_head:{width:233.4,height:363.6,offsetX:-1167,offsetY:0},card_armor_plate_chest:{width:233.4,height:363.6,offsetX:-1167,offsetY:-363.6},card_armor_plate_feet:{width:233.4,height:363.6,offsetX:-1167,offsetY:-727.2},card_armor_plate_hands:{width:233.4,height:363.6,offsetX:-1400.4,offsetY:0},card_armor_plate_head:{width:233.4,height:363.6,offsetX:-1400.4,offsetY:-363.6},card_armor_scale_chest:{width:233.4,height:363.6,offsetX:-1400.4,offsetY:-727.2},card_armor_scale_feet:{width:233.4,height:363.6,offsetX:0,offsetY:-1090.8},card_armor_scale_hands:{width:233.4,height:363.6,offsetX:-233.4,offsetY:-1090.8},card_armor_scale_head:{width:233.4,height:363.6,offsetX:-466.8,offsetY:-1090.8},card_attr_cha_1:{width:233.4,height:363.6,offsetX:-700.2,offsetY:-1090.8},card_attr_cha_2:{width:233.4,height:363.6,offsetX:-933.6,offsetY:-1090.8},card_attr_con_1:{width:233.4,height:363.6,offsetX:-1167,offsetY:-1090.8},card_attr_con_2:{width:233.4,height:363.6,offsetX:-1400.4,offsetY:-1090.8},card_attr_dex_1:{width:233.4,height:363.6,offsetX:-1633.8,offsetY:0},card_attr_dex_2:{width:233.4,height:363.6,offsetX:-1633.8,offsetY:-363.6},card_attr_int_1:{width:233.4,height:363.6,offsetX:-1633.8,offsetY:-727.2},card_attr_int_2:{width:233.4,height:363.6,offsetX:-1633.8,offsetY:-1090.8},card_attr_str_1:{width:233.4,height:363.6,offsetX:0,offsetY:-1454.4},card_attr_str_2:{width:233.4,height:363.6,offsetX:-233.4,offsetY:-1454.4},card_attr_wis_1:{width:233.4,height:363.6,offsetX:-466.8,offsetY:-1454.4},card_attr_wis_2:{width:233.4,height:363.6,offsetX:-700.2,offsetY:-1454.4},card_back:{width:233.4,height:363.6,offsetX:-933.6,offsetY:-1454.4},card_dwarf:{width:233.4,height:363,offsetX:-2567.4,offsetY:-2181.6},card_elf:{width:233.4,height:363,offsetX:-2800.8,offsetY:0},card_exp:{width:233.4,height:363.6,offsetX:-1167,offsetY:-1454.4},card_fairy:{width:233.4,height:363,offsetX:-2800.8,offsetY:-363},card_gnome:{width:233.4,height:363,offsetX:-2800.8,offsetY:-726},card_goblin:{width:233.4,height:363,offsetX:-2800.8,offsetY:-1089},card_grit:{width:233.4,height:363.6,offsetX:-1400.4,offsetY:-1454.4},card_human:{width:233.4,height:363,offsetX:-2800.8,offsetY:-1452},card_item_1:{width:233.4,height:363.6,offsetX:-1633.8,offsetY:-1454.4},card_item_10:{width:233.4,height:363.6,offsetX:-1867.2,offsetY:0},card_item_11:{width:233.4,height:363.6,offsetX:-1867.2,offsetY:-363.6},card_item_12:{width:233.4,height:363.6,offsetX:-1867.2,offsetY:-727.2},card_item_13:{width:233.4,height:363.6,offsetX:-1867.2,offsetY:-1090.8},card_item_14:{width:233.4,height:363.6,offsetX:-1867.2,offsetY:-1454.4},card_item_15:{width:233.4,height:363.6,offsetX:-2100.6,offsetY:0},card_item_16:{width:233.4,height:363.6,offsetX:-2100.6,offsetY:-363.6},card_item_17:{width:233.4,height:363.6,offsetX:-2100.6,offsetY:-727.2},card_item_18:{width:233.4,height:363.6,offsetX:-2100.6,offsetY:-1090.8},card_item_19:{width:233.4,height:363.6,offsetX:-2100.6,offsetY:-1454.4},card_item_2:{width:233.4,height:363.6,offsetX:0,offsetY:-1818},card_item_20:{width:233.4,height:363.6,offsetX:-233.4,offsetY:-1818},card_item_21:{width:233.4,height:363.6,offsetX:-466.8,offsetY:-1818},card_item_3:{width:233.4,height:363.6,offsetX:-700.2,offsetY:-1818},card_item_4:{width:233.4,height:363.6,offsetX:-933.6,offsetY:-1818},card_item_5:{width:233.4,height:363.6,offsetX:-1167,offsetY:-1818},card_item_6:{width:233.4,height:363.6,offsetX:-1400.4,offsetY:-1818},card_item_7:{width:233.4,height:363.6,offsetX:-1633.8,offsetY:-1818},card_item_8:{width:233.4,height:363.6,offsetX:-1867.2,offsetY:-1818},card_item_9:{width:233.4,height:363.6,offsetX:-2100.6,offsetY:-1818},card_orc:{width:233.4,height:363,offsetX:-2800.8,offsetY:-1815},class_alchemist:{width:233.4,height:363,offsetX:-2800.8,offsetY:-2178},class_artificer:{width:233.4,height:363,offsetX:0,offsetY:-2545.2},class_barbarian:{width:233.4,height:363,offsetX:-233.4,offsetY:-2545.2},class_bard:{width:233.4,height:363,offsetX:-466.8,offsetY:-2545.2},class_cleric:{width:233.4,height:363,offsetX:-700.2,offsetY:-2545.2},class_druid:{width:233.4,height:363,offsetX:-933.6,offsetY:-2545.2},class_fighter:{width:233.4,height:363,offsetX:-1167,offsetY:-2545.2},class_merchant:{width:233.4,height:363,offsetX:-1400.4,offsetY:-2545.2},class_monk:{width:233.4,height:363,offsetX:-1633.8,offsetY:-2545.2},class_necromancer:{width:233.4,height:363,offsetX:-1867.2,offsetY:-2545.2},class_paladin:{width:233.4,height:363,offsetX:-2100.6,offsetY:-2545.2},class_ranger:{width:233.4,height:363,offsetX:-2334,offsetY:-2545.2},class_rogue:{width:233.4,height:363,offsetX:-2567.4,offsetY:-2545.2},class_wizard:{width:233.4,height:363,offsetX:-2800.8,offsetY:-2545.2},threat_threat_1:{width:233.4,height:363.6,offsetX:-2334,offsetY:0},threat_threat_10:{width:233.4,height:363.6,offsetX:-2334,offsetY:-363.6},threat_threat_11:{width:233.4,height:363.6,offsetX:-2334,offsetY:-727.2},threat_threat_12:{width:233.4,height:363.6,offsetX:-2334,offsetY:-1090.8},threat_threat_13:{width:233.4,height:363.6,offsetX:-2334,offsetY:-1454.4},threat_threat_14:{width:233.4,height:363.6,offsetX:-2334,offsetY:-1818},threat_threat_15:{width:233.4,height:363.6,offsetX:0,offsetY:-2181.6},threat_threat_16:{width:233.4,height:363.6,offsetX:-233.4,offsetY:-2181.6},threat_threat_17:{width:233.4,height:363.6,offsetX:-466.8,offsetY:-2181.6},threat_threat_18:{width:233.4,height:363.6,offsetX:-700.2,offsetY:-2181.6},threat_threat_19:{width:233.4,height:363.6,offsetX:-933.6,offsetY:-2181.6},threat_threat_2:{width:233.4,height:363.6,offsetX:-1167,offsetY:-2181.6},threat_threat_20:{width:233.4,height:363.6,offsetX:-1400.4,offsetY:-2181.6},threat_threat_21:{width:233.4,height:363.6,offsetX:-1633.8,offsetY:-2181.6},threat_threat_3:{width:233.4,height:363.6,offsetX:-1867.2,offsetY:-2181.6},threat_threat_4:{width:233.4,height:363.6,offsetX:-2100.6,offsetY:-2181.6},threat_threat_5:{width:233.4,height:363.6,offsetX:-2334,offsetY:-2181.6},threat_threat_6:{width:233.4,height:363.6,offsetX:-2567.4,offsetY:0},threat_threat_7:{width:233.4,height:363.6,offsetX:-2567.4,offsetY:-363.6},threat_threat_8:{width:233.4,height:363.6,offsetX:-2567.4,offsetY:-727.2},threat_threat_9:{width:233.4,height:363.6,offsetX:-2567.4,offsetY:-1090.8},threat_threat_back:{width:233.4,height:363.6,offsetX:-2567.4,offsetY:-1454.4},threat_threat_vacant:{width:233.4,height:363.6,offsetX:-2567.4,offsetY:-1818},location_cabin:{width:300,height:210,offsetX:-3034.2,offsetY:0},location_caravan:{width:300,height:210,offsetX:-3034.2,offsetY:-210},location_cave:{width:300,height:210,offsetX:-3034.2,offsetY:-420},location_city:{width:300,height:210,offsetX:-3034.2,offsetY:-630},location_coliseum:{width:300,height:210,offsetX:-3034.2,offsetY:-840},location_crypt:{width:300,height:210,offsetX:-3034.2,offsetY:-1050},location_docks:{width:300,height:210,offsetX:-3034.2,offsetY:-1260},location_dungeon:{width:300,height:210,offsetX:-3034.2,offsetY:-1470},location_forest:{width:300,height:210,offsetX:-3034.2,offsetY:-1680},location_garden:{width:300,height:210,offsetX:-3034.2,offsetY:-1890},location_laboratory:{width:300,height:210,offsetX:-3034.2,offsetY:-2100},location_labyrinth:{width:300,height:210,offsetX:-3034.2,offsetY:-2310},location_library:{width:300,height:210,offsetX:-3034.2,offsetY:-2520},location_market:{width:300,height:210,offsetX:0,offsetY:-2908.2},location_observatory:{width:300,height:210,offsetX:-300,offsetY:-2908.2},location_portal:{width:300,height:210,offsetX:-600,offsetY:-2908.2},location_prison:{width:300,height:210,offsetX:-900,offsetY:-2908.2},location_river:{width:300,height:210,offsetX:-1200,offsetY:-2908.2},location_stables:{width:300,height:210,offsetX:-1500,offsetY:-2908.2},location_temple:{width:300,height:210,offsetX:-1800,offsetY:-2908.2},location_tunnels:{width:300,height:210,offsetX:-2100,offsetY:-2908.2},location_wasteland:{width:300,height:210,offsetX:-2400,offsetY:-2908.2},setting_active:{width:183,height:210,offsetX:-2700,offsetY:-2908.2},setting_barren:{width:183,height:210,offsetX:-2883,offsetY:-2908.2},setting_battling:{width:183,height:210,offsetX:-3066,offsetY:-2908.2},setting_capable:{width:183,height:210,offsetX:0,offsetY:-3118.2},setting_corrupted:{width:183,height:210,offsetX:-183,offsetY:-3118.2},setting_crowded:{width:183,height:210,offsetX:-366,offsetY:-3118.2},setting_eerie:{width:183,height:210,offsetX:-549,offsetY:-3118.2},setting_equipped:{width:183,height:210,offsetX:-732,offsetY:-3118.2},setting_ghostly:{width:183,height:210,offsetX:-915,offsetY:-3118.2},setting_hidden:{width:183,height:210,offsetX:-1098,offsetY:-3118.2},setting_holy:{width:183,height:210,offsetX:-1281,offsetY:-3118.2},setting_lively:{width:183,height:210,offsetX:-1464,offsetY:-3118.2},setting_magical:{width:183,height:210,offsetX:-1647,offsetY:-3118.2},setting_nonexistent:{width:183,height:210,offsetX:-1830,offsetY:-3118.2},setting_overgrown:{width:183,height:210,offsetX:-2013,offsetY:-3118.2},setting_peaceful:{width:183,height:210,offsetX:-2196,offsetY:-3118.2},setting_quiet:{width:183,height:210,offsetX:-2379,offsetY:-3118.2},setting_secret:{width:183,height:210,offsetX:-2562,offsetY:-3118.2},setting_sheltered:{width:183,height:210,offsetX:-2745,offsetY:-3118.2},setting_starved:{width:183,height:210,offsetX:-2928,offsetY:-3118.2},setting_transcendent:{width:183,height:210,offsetX:-3111,offsetY:-3118.2},setting_traveling:{width:183,height:210,offsetX:-3334.2,offsetY:0},setting_treacherous:{width:183,height:210,offsetX:-3334.2,offsetY:-210}},t}();