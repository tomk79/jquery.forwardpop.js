/**
 * jquery.forwardpop.js
 * @author Tomoya Koyanagi <tomk79@gmail.com>
 */
(function($){
	var _targetItems = [];
	var _defMinWidth = 0;
	var _defTitle = '内容';
	var _id = 0;
	var _tpl = function(src, minWidth, title, item){ var prt = ''; prt += '<html><head><meta name="viewport" content="width='+(20+minWidth)+'" /><title>'+$('<div/>').text( title ).html()+'</title></head><body><div style="width:'+minWidth+'px; margin:0 auto;">'+src+'</div></body></html>'; return prt; }

	var isZoom = navigator.userAgent.indexOf('MSIE')>0 || navigator.userAgent.indexOf('AppleWebKit')>0;
	// isZoom = true;

	/**
	 * fit contents
	 */
	function fit_elm(item){
		var tw = item.elm.parent().width();
		var uw = item.minWidth;

		var zoom = tw/uw;

		if(zoom < 1){
			item.elm.html('<p><a href="javascript:$.forwardpop.open('+item.id+');">'+$('<div/>').text( item.title ).html()+'を見る</a></p>');
		}else{
			item.elm.html(item.elmSrc);
		}

	}

	/**
	 * id から アイテムを探す。
	 */
	function getItemById(id){
		for(var index in _targetItems){
			if( _targetItems[index].id == id){
				return _targetItems[index];
			}
		}
		return false;
	}

	$.forwardpop = new (function(){

		/**
		 * init();
		 */
		this.init = function(opt){
			_targetItems = [];
			if(opt.defMinWidth){
				_defMinWidth = opt.defMinWidth;
			}
			if(opt.tpl){
				_tpl = opt.tpl;
			}
			if(opt.defTitle){
				_defTitle = opt.defTitle;
			}
			return this;
		}// init();


		/**
		 * addElements();
		 */
		this.addElements = function(target, minWidth){
			$(target)
				.each(function(){
					var item = {
						id: _id++,
						elm: $(this) ,
						elmSrc: $(this)[0].innerHTML,
						title: _defTitle,
						minWidth: (minWidth?minWidth:_defMinWidth)
					};
					if(item.elm[0].attributes['data-min-width']){
						item.minWidth = item.elm[0].attributes['data-min-width'].value;
						item.minWidth = Number(item.minWidth);
					}
					if(item.elm[0].attributes['data-title']){
						item.title = item.elm[0].attributes['data-title'].value;
					}

					item.elm.css('-webkit-text-size-adjust','auto');

					fit_elm(item);
					_targetItems.push( item );
				})
			;
			return this;
		}// addElements();

		/**
		 * open();
		 */
		this.open = function(id){
			var newWin = window.open('');
			var item = getItemById(id);
			var src = '';
			src += _tpl( item.elmSrc, item.minWidth, item.title, item );
			newWin.document.write(src);
			newWin.document.close();
		}

	})();

	// bind window.resize event
	$(window).bind('resize', function(){
		for(var index in _targetItems){
			fit_elm(_targetItems[index]);
		}
	});

})(jQuery);
