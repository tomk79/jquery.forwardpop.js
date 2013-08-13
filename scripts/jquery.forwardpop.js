/**
 * jquery.forwardpop.js 0.1.0-nb
 * @author Tomoya Koyanagi <tomk79@gmail.com>
 */
(function($){
	var _targetItems = [];
	var _defMinWidth = 0;
	var _defTitle = '内容';
	var _id = 0;
	var _tpl = function(opts){ var prt = ''; prt += '<html><head><meta name="viewport" content="width='+(20+opts.minWidth)+'" /><title>'+$('<div/>').text( opts.title ).html()+'</title></head><body><div style="width:'+opts.minWidth+'px; margin:0 auto;">'+opts.elmSrc+'</div></body></html>'; return prt; }
	var _tplLink = '<p><a href="javascript:$.forwardpop.open({$itemId});">{$itemTitle}を見る</a></p>';

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
			var options = {itemId:item.id, itemTitle: item.title};
			if( typeof(_tplLink) == 'function' ){
				item.elm.html( _tplLink(options) );
			}else{
				item.elm.html( bindContents(_tplLink, options) );
			}
		}else{
			item.elm.html(item.elmSrc);
		}

	}

	/**
	 * テンプレートにコンテンツをバインドする
	 */
	function bindContents(tpl, data){
		var rtn = '';
		while( tpl.match(new RegExp('^(.*?)\\{\\$([a-zA-Z0-9]+)\\}(.*)$','mg') ) ){
			rtn += RegExp.$1;
			rtn += data[RegExp.$2];
			tpl = RegExp.$3;
		}
		rtn += tpl;
		return rtn;
	}//bindContents();

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
			if(opt.tplLink){
				_tplLink = opt.tplLink;
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
						tplLink: _tplLink,
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

			var options = {elmSrc: item.elmSrc, minWidth: item.minWidth, title: item.title, item:item};
			if( typeof(_tpl) == 'function' ){
				src += _tpl( options );
			}else{
				src += bindContents(_tpl, options);
			}
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
