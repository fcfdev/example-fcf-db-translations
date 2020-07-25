fcf.module({name:"fcfControls:templates/table.wrapper.js",dependencies:["fcf:NRender/Wrapper.js"],module:function(Wrapper){return class extends Wrapper{constructor(a_initializeOptions){super(a_initializeOptions),this._currentDragRow=void 0}_attach(a_cb){Wrapper.prototype._attach.call(this,a_cb)}getCurrentData(){return fcf.application.getLocalData().getItem(this._id,"data")}onDragOver(a_event){var firstRow=parseInt(this.select("tr[row]")[0].getAttribute("row")),links=this.getArg("_links"),row=this._getTr(a_event.toElement).getAttribute("row");(row="bottom"==row?this.select(">table>tbody")[0].rows.length:isNaN(parseInt(row))?firstRow-1:parseInt(row))<0||row>=links.length||a_event.preventDefault()}onDragStart(a_event){this._currentDragRow=parseInt(a_event.target.getAttribute("row"))}onDrop(a_event){a_event.target.parentNode.classList.remove("drag-enter");var links=this.getArg("_links"),firstRow=parseInt(this.select("tr[row]")[0].getAttribute("row")),row=this._getTr(a_event.toElement).getAttribute("row");if("bottom"==row?(bottom=!0,row=firstRow+this.select(">table>tbody")[0].rows.length):row=isNaN(parseInt(row))?firstRow-1:parseInt(row),!(row<0||row>=links.length)){var rows=this.getArg("value");rows.splice(row+(row>this._currentDragRow?1:0),0,rows[this._currentDragRow]),rows.splice(this._currentDragRow+(this._currentDragRow>=row?1:0),1),this.setArg("value",rows),this.update()}}onDragEnter(a_event){if(this.getArg("dragable")){var firstRow=parseInt(this.select("tr[row]")[0].getAttribute("row")),links=this.getArg("_links"),row=this._getTr(a_event.toElement).getAttribute("row");(row="bottom"==row?firstRow+this.select(">table>tbody")[0].rows.length:isNaN(parseInt(row))?firstRow-1:parseInt(row))<0||row>=links.length||a_event.target.parentNode.classList.add("drag-enter")}}onDragLeave(a_event){if(this.getArg("dragable")){var firstRow=parseInt(this.select("tr[row]")[0].getAttribute("row")),links=this.getArg("_links"),row=this._getTr(a_event.toElement).getAttribute("row");(row="bottom"==row?firstRow+this.select(">table>tbody")[0].rows.length:isNaN(parseInt(row))?firstRow-1:parseInt(row))<0||row>=links.length||a_event.target.parentNode.classList.remove("drag-enter")}}_getTr(a_element){for(;;){var tag=a_element.tagName.toLowerCase();if("tr"==tag)return a_element;if("body"==tag||"table"==tag)return;a_element=a_element.parentNode}}onSort(a_event){var key=a_event.target.getAttribute("key"),sortOrder=this.getArg("sortOrder",{});key in sortOrder&&"asc"==sortOrder[key]?sortOrder[key]="desc":key in sortOrder&&"desc"==sortOrder[key]?sortOrder[key]="unsort":sortOrder[key]="asc",this.setArg("sortOrder",sortOrder),this.update()}onSearch(a_event){var search=this.getChild("sort").getArg("value");this.setArg("search",search),this.update()}onClear(a_event){this.setArg("search",""),this.update()}onPage(a_event){this.setArg("page",a_event.page),this.update()}}}});