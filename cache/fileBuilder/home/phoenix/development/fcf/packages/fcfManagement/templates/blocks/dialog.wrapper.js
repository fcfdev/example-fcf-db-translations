fcf.module({name:"fcfManagement:templates/blocks/dialog.wrapper.js",dependencies:["fcf:NRender/Wrapper.js"],module:function(Wrapper){return class extends Wrapper{constructor(a_initializeOptions){super(a_initializeOptions);let self=this;this._resizeCaller=function(a_event){self.onResize(a_event)}}onDestroy(){window.removeEventListener("resize",this._resizeCaller)}onAttach(){window.removeEventListener("resize",this._resizeCaller),window.addEventListener("resize",this._resizeCaller),this.onResize()}onResize(){let wpHeight=window.innerHeight,wpWidth=window.innerWidth,bodyMaxHeight=.9*wpHeight-130;this.getDomElement().style.width=wpWidth,this.getDomElement().style.height=wpHeight,this.getDomElement().style.display="table",this.select("[name=body]")[0].style.maxHeight=bodyMaxHeight+"px"}onArg(a_argName,a_value,a_suffix){this.update()}onButtonClick(a_button){this.emit("close",{button:a_button}).stopDefault||this.destroy()}}}});