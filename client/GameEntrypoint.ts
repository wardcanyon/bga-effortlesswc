define([
  'dojo',
  'dojo/_base/declare',
  'ebg/core/gamegui',
  'ebg/counter',
  'ebg/stock',
  'ebg/zone',
], (_dojo: any, declare: any) => {
  declare('bgagame.effortlesswc', ebg.core.gamegui, new GameBody());
});
