//>>built
define("dojox/grid/enhanced/plugins/_SelectionPreserver",["dojo/_base/declare","dojo/_base/lang","dojo/_base/connect","../../_SelectionPreserver"],function(n,h,e,p){return n("dojox.grid.enhanced.plugins._SelectionPreserver",p,{constructor:function(d){var a=this.grid;a.onSelectedById=this.onSelectedById;this._oldClearData=a._clearData;var b=this;a._clearData=function(){b._updateMapping(!a._noInternalMapping);b._trustSelection=[];b._oldClearData.apply(a,arguments)};this._connects.push(e.connect(d,"selectRange",
h.hitch(this,"_updateMapping",!0,!0,!1)),e.connect(d,"deselectRange",h.hitch(this,"_updateMapping",!0,!1,!1)),e.connect(d,"deselectAll",h.hitch(this,"_updateMapping",!0,!1,!0)))},destroy:function(){this.inherited(arguments);this.grid._clearData=this._oldClearData},reset:function(){this.inherited(arguments);this._idMap=[];this._trustSelection=[];this._defaultSelected=!1},_reSelectById:function(d,a){var b=this.selection,k=this.grid;if(d&&k._hasIdentity){var f=k.store.getIdentity(d);void 0===this._selectedById[f]?
this._trustSelection[a]||(b.selected[a]=this._defaultSelected):b.selected[a]=this._selectedById[f];this._idMap.push(f);k.onSelectedById(f,a,b.selected[a])}},_selectById:function(d,a){this.inherited(arguments)||(this._trustSelection[a]=!0)},onSelectedById:function(d,a,b){},_updateMapping:function(d,a,b,k,f){var h=this.selection,g=this.grid,e=0,m=0,c,l;for(c=g.rowCount-1;0<=c;--c)if(g._by_idx[c]){if((l=g._by_idx[c].idty)&&(d||void 0===this._selectedById[l]))this._selectedById[l]=!!h.selected[c]}else++m,
e+=h.selected[c]?1:-1;m&&(this._defaultSelected=0<e);!b&&(void 0!==k&&void 0!==f)&&(b=!g.usingPagination&&Math.abs(f-k+1)===g.rowCount);if(b&&(!g.usingPagination||"single"===g.selectionMode))for(c=this._idMap.length-1;0<=c;--c)this._selectedById[this._idMap[c]]=a}})});