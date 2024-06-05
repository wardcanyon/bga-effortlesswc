/*! bga-effortlesswc 2024-06-05 */
var __extends=this&&this.__extends||function(){var c=function(e,t){return(c=Object.setPrototypeOf||({__proto__:[]}instanceof Array?function(e,t){e.__proto__=t}:function(e,t){for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}))(e,t)};return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function o(){this.constructor=e}c(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)}}();define("bgagame/effortlesswc",["require","exports","ebg/core/gamegui","ebg/counter"],function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});__extends(s,c=o),s.prototype.setup=function(e){for(var t in console.log("Starting game setup"),e.players)e.players.hasOwnProperty(t)&&(t=e.players[t],console.log(t));this.setupPlayArea(),this.setupNotifications(),console.log("Ending game setup")},s.prototype.setupPlayArea=function(){for(var o=this,e=0;e<6;++e)dojo.place(this.format_block("jstpl_setloc_panel",{classes:"",id:"ewc_setloc_panel_"+e}),$("ewc_setlocarea_column_"+e%2));document.querySelector("#ewc_setloc_panel_0 .ewc_setloc_location").classList.add("location_cabin"),document.querySelector("#ewc_setloc_panel_1 .ewc_setloc_location").classList.add("location_forest"),document.querySelector("#ewc_setloc_panel_2 .ewc_setloc_location").classList.add("location_garden"),document.querySelector("#ewc_setloc_panel_3 .ewc_setloc_location").classList.add("location_river"),document.querySelector("#ewc_setloc_panel_4 .ewc_setloc_location").classList.add("location_stables"),document.querySelector("#ewc_setloc_panel_5 .ewc_setloc_location").classList.add("location_city"),document.querySelector("#ewc_setloc_panel_0 .ewc_setloc_setting").classList.add("setting_battling"),document.querySelector("#ewc_setloc_panel_1 .ewc_setloc_setting").classList.add("setting_secret"),document.querySelector("#ewc_setloc_panel_2 .ewc_setloc_setting").classList.add("setting_traveling"),document.querySelector("#ewc_setloc_panel_3 .ewc_setloc_setting").classList.add("setting_active"),document.querySelector("#ewc_setloc_panel_4 .ewc_setloc_setting").classList.add("setting_eerie"),document.querySelector("#ewc_setloc_panel_5 .ewc_setloc_setting").classList.add("setting_starved"),console.log("*** qsa ***"),document.querySelectorAll(".tmp_scalable").forEach(function(e){var t=e;t.classList.contains("tmp_scaled")||(t.classList.add("tmp_scaled"),console.log("*** qsa foreach",e),o.rescaleSprite(t,.5))}),document.querySelectorAll(".tmp_tintable").forEach(function(e){e.classList.contains("tmp_tinted")||e.classList.add("tmp_tinted")})},s.prototype.rescaleSprite=function(e,t){e.style.height=363.6*t+"px",e.style.width=233.4*t+"px";var o=3334.2*t+"px "+3328.2*t+"px";console.log("*** bgSize = ",o),e.style.backgroundSize=o,e.style.backgroundPosition=-700.2*t+"px "+-1090.8*t+"px"},s.prototype.tintSprite=function(e,t){e.style.backgroundBlendMode="multiply",e.style.maskImage=e.style.background,e.style.maskPosition=e.style.backgroundPosition,e.style.maskSize=e.style.backgroundSize,e.style.backgroundColor=t},s.prototype.onEnteringState=function(e,t){console.log("Entering state",e,t)},s.prototype.onLeavingState=function(e){console.log("Leaving state: "+e)},s.prototype.onUpdateActionButtons=function(e,t){console.log("onUpdateActionButtons: "+e,t),this.isCurrentPlayerActive()},s.prototype.setupNotifications=function(){console.log("notifications subscriptions setup")};var c,t=s;function s(){var e=c.call(this)||this;return console.log("effortlesswc constructor"),e}dojo.setObject("bgagame.effortlesswc",t)});