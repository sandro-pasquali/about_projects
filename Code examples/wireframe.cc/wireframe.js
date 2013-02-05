$(function() {
	var offset_c = $('#canvas').offset();

	$(".editable").editnibble('hideAllEditors');
	$('#show-bg').hide();
});

var wirePresent = true;
var wirepanel=$('#wirepanel');
var annotPresent = true;
var offset_c = $('#canvas').offset();
var cwidth=$("#canvas-wrap").width();
var MIN_DISTANCE = 6; // minimum distance to "snap" to a guide
var guides = []; // no guides available ...
var innerOffsetX, innerOffsetY; // we'll use those during drag ...
var offseta1 = $('#canvas').offset();

var index_highest = 0;

$(document).ready(function() {

	$('.left , .icon , .colorpicker , .brcolor , #show-border , .stroke_width , #edit , #edittxt , #front , #back , #show-bg , #lock , #unlock ').tipsy({delayIn: 1000});
	$('.device-wrap span ').tipsy({delayIn: 1000 , gravity: 'nw'});
	$('body').append(img);
});


$('#empty').click(function(){

	var r=confirm("Do you want to clear the canvas?");
	if (r===true)
	{
		window.location = '/';
	}
	else
	{
		return;
	}

});

var imgs = $( '.device-wrap span' );

$('.device-mobile').click(function  () {

	imgs.eq(1).insertBefore( imgs.eq(2) );
	imgs.eq(0).insertAfter( imgs.eq(2) );

	$('#canvas-wrap').addClass('mobile').removeClass('browser-wrap , mobile-landscape').css({'width':'320px','height':'480px'}).center();
	$('.wire').resizable('option', 'maxWidth', 320);
	offset_c = $('#canvas').offset();
});
$('.device-window').click(function  () {
	imgs.eq(0).insertBefore( imgs.eq(1) );
	imgs.eq(2).insertAfter( imgs.eq(1) );

	$('#canvas-wrap').removeClass('mobile , mobile-landscape').addClass('browser-wrap').css({'width':'820px','height':'480px'}).center();
	$('.wire').resizable('option', 'maxWidth', 820);
	offset_c = $('#canvas').offset();
});

$('.device-mobile-landscp').click(function  () {
	imgs.eq(2).insertBefore( imgs.eq(1) );
	imgs.eq(0).insertAfter( imgs.eq(1) );

	$('#canvas-wrap').addClass('mobile-landscape').removeClass('browser-wrap , mobile').css({'width':'480px','height':'320px'}).center();
	$('.wire').resizable('option', 'maxWidth', 480);
	offset_c = $('#canvas').offset();
});

$('#show-annotation').click(function(){
	$('.aa').show();
	$('#hide-annotation').show();
	$(this).hide();
});

$('#hide-annotation').click(function(){
	$('.aa').hide();
	$('#show-annotation').show();
	$(this).hide();
});

$('#edit-wire').click(function(){
	$('.selected').dblclick();
});

$('#lock').click(function  () {
	$('.selected').addClass('locked icon-').draggable("destroy").resizable("destroy");
	$('#unlock').show();
	$('#lock').hide();
});
$('#unlock').click(function  () {
	$('.selected').removeClass('locked icon-');
	makeDrag($('.selected'));
	$('#lock').show();
	$('#unlock').hide();
});

var supports_pushState = 'pushState' in history;
$('#save').click(function() {
	var newURL=true;
	$('.wire , .aa  ').draggable("destroy").resizable("destroy");
$('#canvas-wrap').resizable("destroy");
	var wireHTML = $(".supercanvas").html();
	var datastr = encodeURI(wireHTML);

	if(filename===0){filename=randomID(6);}else{newURL=false;}

	if ( supports_pushState ) {

		history.pushState( {},'filename', '/'+filename);
	} else {
		location.hash = '#'+filename;
	}
	$.post('save.php', { 'note' : datastr, 'name':filename },function (){
MakeCanvasDrag();
		if (newURL) { $('.savedURL').html('http://wireframe.cc/'+filename);
		$('.save-wrap').fadeIn().delay(1600).fadeOut();

	}else{$('.saved').show().delay(600).fadeOut();}
	makeDrag($('.wire:not(.locked)'));
	makeDrag($('.aa'));

	});
});


function showSaveButton(){
	$('#slogan').fadeOut('fast',function(){
		$('#controls').fadeIn();
	});
}
function InstantShowSaveButton(){
	$('#slogan').hide();
	$('#controls').show();
}


$('.closeannot , .closeURLpopup').click(function(){
	var delit=$(this).parent();
	delit.remove();
});



function divClicked(event) {
	event.stopPropagation();
	$('.thelatest').addClass('thelatest');
	$(this).parent().addClass('latest');
	var divHtml = $(this).html();
	var editableText = $("<textarea />");
	editableText.val(divHtml).addClass('textareanow');
	$(this).replaceWith(editableText);
	editableText.focus();
    // setup the blur event for this new textarea
    editableText.blur(editableTextBlurred);
    $('.latest .ok').show();
    $('textarea').autosize();
    $('.annotbox').addClass('textareainside');
    $('.ok').click(editableTextBlurred);
}

function editableTextBlurred() {
	$('.textareanow').parent().removeClass('latest');
	var html = $('.textareanow').val();
	var viewableText = $("<div>");
	if (html ===''){
		html='...';
	}
	viewableText.html(html);
	$('.textareanow').replaceWith(viewableText);
    // setup the click event for this new div
    viewableText.click(divClicked);
    $('.ok').hide();


}

$('.ok').click(editableTextBlurred);





// Boxer plugin
$.widget("ui.boxer", $.extend({}, $.ui.mouse, {

	_init: function() {
		this.element.addClass("ui-boxer");

		this.dragged = false;

		this._mouseInit();

		this.helper = $(document.createElement('div'))
		.css({ background:'rgba(0,0,0,0.7)'})
		.addClass("ui-boxer-helper");


	},

	destroy: function() {
		this.element
		.removeClass("ui-boxer ui-boxer-disabled")
		.removeData("boxer")
		.unbind(".boxer");
		this._mouseDestroy();

		return this;
	},

	_mouseStart: function(event) {

		wirepanel.hide();
		if ($('.selected')){

		}


		$('.selected').removeClass('selected');
		$('.blank').remove();

		var self = this;

		this.opos = [event.pageX, event.pageY];

		if (this.options.disabled)
			return;

		var options = this.options;

		this._trigger("start", event);

		$(options.appendTo).append(this.helper);

		this.helper.css({
			"z-index": 100,
			"position": "absolute",
			"left": event.clientX,
			"top": event.clientY,
			"width": 0,
			"height": 0
		});
	},

	_mouseDrag: function(event) {

		var self = this;
		this.dragged = true;

		if (this.options.disabled)
			return;

		var options = this.options;
		var x1 = this.opos[0], y1 = this.opos[1], x2 = event.pageX, y2 = event.pageY;
		if (x1 > x2) { var tmp = x2; x2 = x1; x1 = tmp; }
		if (y1 > y2) { var tmp2 = y2; y2 = y1; y1 = tmp2; }
		var greyshade = 0.1+(x2-x1)/cwidth;
		if (greyshade>=0.7){greyshade=0.7;}
		this.helper.css({left: x1, top: y1, width: x2-x1, height: y2-y1}).css({ background:'rgba(0,0,0,'+greyshade+') url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAIUlEQVQYV2NkYGCQBGJ08BxdgHGIKMTiF0wPgjwz2BUCADTeBYguWvyCAAAAAElFTkSuQmCC)'});

		this._trigger("drag", event);

		return false;
	},

	_mouseStop: function(event) {
		$('.brandnew').removeClass('brandnew');
		$('.dimnow').remove();
		var self = this;

		this.dragged = false;

		var options = this.options;
		var x1 = this.opos[0], y1 = this.opos[1], x2 = event.pageX, y2 = event.pageY;
		if (x1 > x2) { var tmp = x2; x2 = x1; x1 = tmp; }
		if (y1 > y2) { var tmp2 = y2; y2 = y1; y1 = tmp2; }
		var offset_c = $('#canvas').offset();
		$(".wire").each(function() {
			var index_current = parseInt($(this).css("zIndex"), 10);
			if (index_current > index_highest) {
				index_highest = index_current;
			}
		});

		var clone = this.helper.clone().css({left: x1-offset_c.left, top: y1-offset_c.top,"z-index": index_highest+1})
		.removeClass('ui-boxer-helper').appendTo(this.element).addClass('brandnew blank');

		this._trigger("stop", event, { box: clone });

		this.helper.remove();

		return false;
	}

}));
$.extend($.ui.boxer, {
	defaults: $.extend({}, $.ui.mouse.defaults, {
		appendTo: 'body',
		distance: 0
	})
});




/////////////// Using the boxer plugin
$('#canvas').boxer({
	cursor: 'pointer',
	stop: function(event, ui) {


		var box_h= ui.box.height();
		var box_w= ui.box.width();
		if(ui.box.width()>20 || ui.box.height()>20){
			$('#icons').show().siblings().hide();
			aspect_ratio($('.blank'));
			$('#annotate').show();
			$('#textinput').removeClass('lasticon');
			var boxposition = ui.box.position();
			var boxtop = boxposition.top;
			var boxleft = boxposition.left;
			var offset_c = $('#canvas').offset();
			var newtop=boxtop+box_h/2+offset_c.top;

			var xx = event.pageX ;

			var wirepanelhidth = wirepanel.width();
			var panel_left=boxleft+(box_w/2)-(wirepanelhidth/2)+offset_c.left;
			if(panel_left<=0){
				panel_left=0;
			}

			wirepanel.css({top:newtop-10, left:panel_left});

			wirepanel.show();

			//////////////

			if ($('.brandnew')){



				$('#wirepanel .icon').hover(function(){
$('.locked.selected').removeClass('selected');

					$('.brandnew').css({ background:'white'});


					$('.brandnew').removeAttr('class').addClass('wire brandnew blank').empty();


					var type=$(this).attr('elementtype');




					$('.brandnew').addClass('new wire').addClass(type).css('margin-top',0);

					if (type=='annotate'){

						$('.brandnew.annotate').removeClass('wire').addClass('aa').css('z-index','5000').append(annotationhtml).draggable({cancel:'.annotbox , .closeannot', cursor:'move'});

					}

					if (type=='slider'|| type=='line_hor'||type=='scrollh'){
						$('.brandnew').addClass('resizeX');
					}
					if (type=='slider'){
						$('.brandnew').css('margin-top',(box_h/2)-3);
					}
					if (type=='line_hor'){
						$('.brandnew').css('margin-top',box_h/2);
					}
					if (type=='scrollh'){
						$('.brandnew').css('margin-top',(box_h/2)-10);
					}

					if (type=='paragraph'){
						$('.brandnew').append(paragraph);
					}

					if (type=='list'){
						$('.brandnew').append(list);
					}

					if ($('.brandnew').hasClass('headlinetxt')){
						$('.brandnew.headlinetxt').addClass('lastheadline').html('<span  class="editable"></span');
						$(".editable").editnibble({hideEditorOnFinish: true});


					}


					if ($('.brandnew').hasClass('headline')){
						$('.headline').html(headtxt);
					}
					if ($('.brandnew').hasClass('image')){
						var image_to_add=$('#imgwire').clone().show();
						$('.brandnew').html(image_to_add).addClass('svginside imgwire').find('div').removeAttr('id');
						var imgwidth=$('.brandnew').width();
						console.log(imgwidth);
						$('.brandnew svg ').css('width', imgwidth+'px');
						var imgheight=$('.brandnew').height();
						$('.brandnew svg ').css('height', imgheight+'px');

					}


					$('#wirepanel .icon').click(function(){


						if ($('.brandnew').hasClass('headlinetxt')){
							$('.lastheadline').find('span').dblclick();
							$('.headlinetxt.lastheadline').removeClass('lastheadline');
						}

						if (type=='annotate'){

							$(".editme").click(divClicked);

							$(".aa").draggable().resizable({handles:'all'});
							$(".thelatest").click();
							$('.closeannot').click(function(){
								var delit=$(this).parent();
								delit.remove();
							});

							if (annotPresent){
								$("#hide-annotation").removeClass('inactive');

								$('#hide-annotation').click(function(){
									$('.aa').hide();
									$('#show-annotation').show();
									$(this).hide();
								});
								annotPresent = false;
							}

						}

						$('.blank').removeClass('blank brandnew');
						if (wirePresent){
							var anywire =$('.wire').length;
							if (anywire > 0){
								showSaveButton();
								wirePresent = false;
							}
						}

						makeDrag($('.wire:not(.locked)'));
						wirepanel.fadeOut('fast');
					});

});

}
			////////////

		}
		else{
			ui.box.remove();

		}


	}


});



function makeDrag (tt) {
	$('.wire').mousedown(function(event) {
		var cloned='';
		if (event.altKey==1) {

			$(this).draggable('option', 'helper','clone');

			$('#canvas').droppable(
			{
				drop: function(event, ui) {
					var cloned=$(ui.helper).clone();
					cloned.appendTo('#canvas').find('.ui-resizable-handle').remove();
					makeDrag(cloned);
					$('.wire').draggable('option', 'helper','none');
					$('#canvas').droppable('destroy');
				}
			});

		}

	});



	tt.not('.locked').draggable({
		snap: ".wire" ,

		start: function( event, ui ) {

			wirepanel.hide();
			$('.selected').children().removeClass('selected');
			posTopArray = [];
			posLeftArray = [];
								if ($(this).hasClass("selected")) {  // Loop through each element and store beginning start and left positions
									$(".selected").each(function(i) {
										thiscsstop = $(this).css('top');
										if (thiscsstop == 'auto') thiscsstop = 0; // For IE

										thiscssleft = $(this).css('left');
										if (thiscssleft == 'auto') thiscssleft = 0; // For IE

										posTopArray[i] = parseInt(thiscsstop,10);
										posLeftArray[i] = parseInt(thiscssleft,10);
									});
								}

								begintop = $(this).offset().top; // Dragged element top position
								beginleft = $(this).offset().left; // Dragged element left position

								///
								guides = $.map( $( ".wire, #canvas" ).not( this ), computeGuidesForElement );

								innerOffsetX = event.pageX-this.offsetLeft;
								innerOffsetY = event.pageY-this.offsetTop;
								console.log(innerOffsetY);
								/////

							},
							drag: function( event, ui ){

								var topdiff = $(this).offset().top - begintop;  // Current distance dragged element has traveled vertically
								var leftdiff = $(this).offset().left - beginleft; // Current distance dragged element has traveled horizontally

								if ($(this).hasClass("selected")) {
									$(".selected").each(function(i) {
										$(this).css('top', posTopArray[i] + topdiff); // Move element veritically - current css top + distance dragged element has travelled vertically
										$(this).css('left', posLeftArray[i] + leftdiff); // Move element horizontally - current css left + distance dragged element has travelled horizontally
									});
								}

								// iterate all guides, remember the closest h and v guides
								var offseta1 = $('#canvas').offset();

								var guideV, guideH, distV = MIN_DISTANCE+1, distH = MIN_DISTANCE+1, offsetV, offsetH;
								var $t = $(this);
								var pos = {top:event.pageY-innerOffsetY  , left:event.pageX-innerOffsetX };

								var w = $t.outerWidth() - 1;
								var h = $t.outerHeight() - 1;
								var d;
								$.each( guides, function( i, guide ){
									if( guide.type == "h" ){
										if( ( d = Math.abs( pos.top - guide.y ) ) < distH ){
											distH = d;
											guideH = guide;
											offsetH = 0;
										}
										if( ( d = Math.abs( pos.top - guide.y + h ) ) < distH ){
											distH = d;
											guideH = guide;
											offsetH = h;
										}
									}
									if( guide.type == "v" ){
										if( ( d = Math.abs( pos.left - guide.x ) ) < distV ){
											distV = d;
											guideV = guide;
											offsetV = 0;
										}
										if( ( d = Math.abs( pos.left - guide.x + w ) ) < distV ){
											distV = d;
											guideV = guide;
											offsetV = w;
										}
									}
								} );

								if( distH <= MIN_DISTANCE ){
									$( "#guide-h" ).css( "top", guideH.y ).show();
									ui.position.top = guideH.y - offsetH ;
								}
								else{
									$( "#guide-h" ).hide();
									ui.position.top = pos.top;
								}

								if( distV <= MIN_DISTANCE ){
									$( "#guide-v" ).css( "left", guideV.x ).show();
									ui.position.left = guideV.x - offsetV;
								}
								else{
									$( "#guide-v" ).hide();
									ui.position.left = pos.left;
								}

							},
							stop: function( event, ui ){
								$( "#guide-v, #guide-h" ).hide();

							}
						});
tt.resizable({
	maxWidth:cwidth+1,
	start: function (event, ui)
	{
		wirepanel.hide();
		var missingborder=$(this).css('border-width');
		missingborder=parseInt(missingborder,10)*2;
		ui.size.height = ui.size.height+missingborder;
		ui.size.width = ui.size.width+missingborder;
	},
	resize: function (event, ui)
	{
		if ($(".ui-resizable-resizing").hasClass('svginside')){
			var imgwidth=ui.size.width;
			$('.ui-resizable-resizing svg ').css('width', imgwidth);
			var imgheight=ui.size.height;
			$('.ui-resizable-resizing svg ').css('height', imgheight);

		}
	},
	stop: function (event, ui)
	{


		if ($(".ui-resizable-resizing").hasClass('svginside')){
			var imgwidth=ui.size.width;
			$('.ui-resizable-resizing svg ').css('width', imgwidth);
			var imgheight=ui.size.height;
			$('.ui-resizable-resizing svg ').css('height', imgheight);

		}
	},

	handles: "all" ,
	autoHide:true

});
}


function select(e,s){

	if (!e.shiftKey) {
		$('.selected').removeClass('selected');}

		s.addClass('selected');



	}


	function MakeCanvasDrag () {

		$( "#canvas-wrap").resizable({
			minWidth: 320,
			minHeight: 320,
			start: function (event, ui)
			{
				wirepanel.hide();
				var cheight=$('#canvas').height();
				$('#canvas').css('width',cwidth+2);
				$('#canvas').css('height',cheight+2);
			},
			resize:function( event, ui ) {
				cwidth=ui.size.width;

				if (cwidth===320) {$('#canvas-wrap').addClass('mobile').removeClass('browser-wrap , mobile-landscape');
				imgs.eq(1).insertBefore( imgs.eq(2) );
				imgs.eq(0).insertAfter( imgs.eq(2) );
			}
			if (cwidth>320) {$('#canvas-wrap').removeClass('mobile , mobile-landscape').addClass('browser-wrap');
			imgs.eq(0).insertBefore( imgs.eq(1) );
			imgs.eq(2).insertAfter( imgs.eq(1) );
		}
		if (ui.size.height===320) {$('#canvas-wrap').addClass('mobile-landscape').removeClass('browser-wrap , mobile');
		imgs.eq(2).insertBefore( imgs.eq(1) );
		imgs.eq(0).insertAfter( imgs.eq(1) );
	}

	$('#canvas').css('width','100%');
	$('#canvas').css('height','100%');
},
stop:function( event, ui ) {
	cwidth=ui.size.width;
	if ($('#canvas-wrap').hasClass('mobile-landscape')) {
		cwidth=480;
	}
	$('.wire').resizable('option', 'maxWidth', cwidth);
	$(this).center();
$(this).css('top','160px');
},
alsoResize: ".container",
handles: "se , s, e, w"
}).draggable({handle:'#browser',
cursor: 'move',
containment:'.container',
stop: function(ui){
	offset_c = $('#canvas').offset();
}});
$('#canvas-wrap').find('.ui-resizable-se').html('<i class=icon-resize-full ></i>');

}

MakeCanvasDrag();





$('#del').click(function(){
	$('.selected').not( "#canvas-wrap").remove();
});

$('#edit').click(function(){

	$('#icons').show().siblings().hide();
	positionwirepanel();

});

function positionwirepanel(){
	offset_c = $('#canvas').offset();
	var box_h= $('.selected').height();
	var box_w= $('.selected').width();


	var boxposition = $('.selected').position();
	var boxtop = boxposition.top;
	var boxleft = boxposition.left;

	var newtop=boxtop+box_h/2+offset_c.top;

	var wirepanelhidth = wirepanel.width();
	var panel_left=boxleft+(box_w/2)-(wirepanelhidth/2)+offset_c.left;
	if(panel_left<=0){
		panel_left=0;
	}

	wirepanel.css({top:newtop-10, left:panel_left}).show();
}


function editme(){
	$('#edittxt').click(function(){
		if ($('.selected') && $('.selected').hasClass('headlinetxt')){
			$('.selected').find(".editable").dblclick();
		}
		wirepanel.hide();
	});
	render_edit_menu();
	aspect_ratio($('.selected'));
	positionwirepanel();
	var box_h= $('.selected').height();

	$('.icon').hover(function(){
		$('.selected').find('span').remove();

		$('.selected:not(.brandnew)').removeAttr('class').addClass('selected wire ui-draggable ui-resizable').find('span').empty();


		var type=$(this).attr('elementtype');

		$('.selected').addClass(type).css('margin-top',0);


		if (type=='slider'|| type=='line_hor'||type=='scrollh'){
			$('.selected').addClass('resizeX');
		}
		if (type=='slider'){
			$('.selected').css('margin-top',(box_h/2)-3);
		}
		if (type=='line_hor'){
			$('.selected').css('margin-top',box_h/2);
		}
		if (type=='scrollh'){
			$('.selected').css('margin-top',(box_h/2)-10);
		}

		if ($('.selected').hasClass('headline')){
			$('.selected.headline').append(headtxt);
		}



		if ($('.selected').hasClass('image')){
			var image_to_add=$('#imgwire').clone().show();
			$('.selected').append(image_to_add).addClass('svginside imgwire').find('span').removeAttr('id');
			var imgwidth=$('.selected').width();

			$('.selected svg ').css('width', imgwidth+'px');
			var imgheight=$('.selected').height();
			$('.selected svg ').css('height', imgheight+'px');

		}

		if (type=='paragraph'){
			$('.selected.paragraph').append(paragraph);
		}

		if (type=='list'){
			$('.selected.list').append(list);
		}

		if ($('.selected').hasClass('headlinetxt')){

			$('.selected.headlinetxt').addClass('lastheadline').append('<span  class="editable"></span');
			$(".editable").editnibble('hideAllEditors');
		}
	});


$('.icon').click(function(){

	$('.selected.headlinetxt').removeClass('lastheadline').find('span').dblclick();

	wirepanel.hide();
});


}

var copied;
$('#copy').click(function(){
	copied=$('.selected');
	$('.copied').fadeIn().delay(600).fadeOut();
});
$(document).bind('keydown', 'Ctrl+c', function () {
	copied=$('.selected');
	$('.copied').fadeIn().delay(600).fadeOut();

});
$(document).bind('keydown', 'Del', function () {
	$('.selected:not(#canvas-wrap)').remove();
});

$('#paste').click(function(){
	var inserted=copied.clone();
	inserted.appendTo('#canvas').css({'top':'20px','left':"20px"}).find('.ui-resizable-handle').remove();
	makeDrag(inserted);
});
$(document).bind('keydown', 'Ctrl+v', function () {
	var inserted=copied.clone();
	inserted.appendTo('#canvas').css({'top':'20px','left':"20px"}).find('.ui-resizable-handle').remove();
	makeDrag(inserted);
});


$('.colorpicker').click(function(){

	var current_bgcolor=$(this).css('background-color');
	if ($('.selected')){
		$('.selected').css('background-color',current_bgcolor);
		if($('.selected').hasClass('headline')){
			$('.selected.headline').find('span').css('background-color',current_bgcolor);}
			if($('.selected').hasClass('headlinetxt')){
				$('.selected.headlinetxt').find('span').css('color',current_bgcolor);}
				if($('.selected').hasClass('paragraph')){
					$('.selected.paragraph span').find('span').css('background-color',current_bgcolor);}
					if($('.selected').hasClass('list')){
						$('.selected.list span ul li span').css('background-color',current_bgcolor);}
					}
					if($('.selected').hasClass('svginside')){
						$('.selected .image *').css('background-color',current_bgcolor);
					}
				});

$('.strokeweight').click(function(){
	current_stroke=$(this).attr('stroke');

	$('.selected').css('border-width',current_stroke);
	if($('.selected').hasClass('svginside')){
		$('.selected svg *').css('stroke-width', current_stroke);
	}
});

$('.brcolor').click(function(){
	current_brcolor=$(this).css('borderColor');
	$('.selected').css('borderColor',current_brcolor);
	if($('.selected').hasClass('svginside')){
		$('.selected svg *').css('stroke', current_brcolor);
	}

});

$('#front').click(function(){
	$(".wire").each(function() {
		var index_current = parseInt($(this).css("zIndex"), 10);
		if (index_current > index_highest) {
			index_highest = index_current;
		}
	});
	$('.selected').css('z-index',index_highest+1);
});

$('#back').click(function(){
	$(".wire").each(function() {
		var index_now = parseInt($(this).css("zIndex"), 10);
		console.log(index_now);
		$(this).css('z-index',index_now+1);
	});
	$('.selected').css('z-index',1);
});

function computeGuidesForElement( elem ){
	var $t = $(elem);
	var pos = $t.position();
	var w = $t.outerWidth() - 1;
	var h = $t.outerHeight() - 1;
	return [
	{ type: "h", x: pos.left, y: pos.top },
	{ type: "h", x: pos.left, y: pos.top + h },
	{ type: "v", x: pos.left, y: pos.top },
	{ type: "v", x: pos.left + w, y: pos.top }
	];
}

function aspect_ratio(bb){

	var b1=bb.width();
	var b2=bb.height();
	var proportions=b1/b2;

	if (proportions >= 0.3 && proportions <= 8){
		$('.icon.rect').show();
		$('.icon:not(.rect)').hide();
	}
	if (proportions < 0.3 ){
		$('.icon.vertical').show();
		$('.icon:not(.vertical)').hide();
	}
	if (proportions > 8){
		$('.icon.horizontal').show();
		$('.icon:not(.horizontal)').hide();
	}
	$('#annotate').hide();
	$('#textinput').addClass('lasticon');
}

function render_edit_menu(){
	$('#icons').hide().siblings().not("#lock , #unlock").show();

	var totalwire =$('#canvas').find('.wire').length;
	if (totalwire < 2){
		$('#bring-back-front').hide();
	}

	if ($('.selected').hasClass('ui-draggable') ){
		$('#lock').show();
		$('#unlock').hide();
	} else {
		$('#lock').hide();
		$('#unlock').show();

	}

	if ($('.paragraph')){
		$('#strokes').hide();
		$('#show-border , #show-bg').hide();
		$('#colorpickers').show();
		$('#bordercolors').hide();
		$('#textalign , #textsize').show();
		$('#edittxt').hide();
	}

	if ($('.selected').hasClass('list') ){
		$('#strokes').hide();
		$('#show-border , #show-bg').hide();
		$('#colorpickers').show();
		$('#bordercolors').hide();
		$('#textsize').show();
		$('#textalign').hide();
		$('#edittxt').hide();
	}

	if (!$('.selected').hasClass('headlinetxt')&& !$('.selected').hasClass('paragraph') && !$('.selected').hasClass('list')){
		$('#edittxt').hide();
		$('#show-border').show();
		$('#brind-back-front').show();
		$('#colorpickers').show();
		$('#bordercolors').hide();
		$('#strokes').show();
		$('#textalign , #textsize').hide();
	}
	if ($('.selected').hasClass('headlinetxt')){
		$('#strokes').hide();
		$('#show-border , #show-bg').hide();
		$('#colorpickers').show();
		$('#bordercolors').hide();
		$('#textalign , #textsize').hide();
		$('#edittxt').show();
		$('#textsize').show();
	}

}

$('#show-bg').click(function(){
	$('#colorpickers').show();
	$('#bordercolors').hide();
	$('#show-border').show();
	$('#show-bg').hide();
});
$('#show-border').click(function(){
	$('#bordercolors').show();
	$('#colorpickers').hide();
	$('#show-border').hide();
	$('#show-bg').show();
});

$('#alignleft').click(function(){
	$('.selected').find('.txtcont').css('text-align','left');
});

$('#aligncenter').click(function(){
	$('.selected').find('.txtcont').css('text-align','center');
});

$('#alignright').click(function(){
	$('.selected').find('.txtcont').css('text-align','right');
});
$('#alignjustify').click(function(){
	$('.selected').find('.txtcont').css('text-align','justify');
});

$('#font-s').click(function(){
	$('.selected.paragraph span').css({'font-size':'7px', 'line-height':'13px'});
	$('.selected.list span ul li span').css({'font-size':'7px', 'line-height':'13px'});
	$('.selected.headlinetxt .editable .content-wrapper').css({'font-size':'12px', 'line-height':'12px'});
});
$('#font-m').click(function(){
	$('.selected.paragraph span').css({'font-size':'10px', 'line-height':'20px'});
	$('.selected.list span ul li span').css({'font-size':'10px', 'line-height':'20px'});
	$('.selected.headlinetxt .editable .content-wrapper').css({'font-size':'18px', 'line-height':'18px'});
});
$('#font-l').click(function(){
	$('.selected.paragraph span').css({'font-size':'18px', 'line-height':'36px'});
	$('.selected.list span ul li span').css({'font-size':'18px', 'line-height':'36px'});
	$('.selected.headlinetxt .editable .content-wrapper').css({'font-size':'28px', 'line-height':'28px'});
});


jQuery.fn.center = function(parent) {
	if (parent) {
		parent = this.parent();
	} else {
		parent = window;
	}
	this.animate({
		"left": ((($(parent).width() - this.outerWidth()) / 2) + $(parent).scrollLeft() + "px"),
		"margin-left":"0"

	});
	return this;
};


var annotationhtml="<span class=annotbox><div class='editme thelatest'></div><button class=ok><i class=icon-ok></i> ok</button></span><div class=closeannot><i class=icon-remove></i></div>";

var paragraph="<span class=txtcont><span>Lorem ipsum dolor sit amet, et delectus accommodare his, consul copiosae legendos at vix, ad putent delectus delicata usu. Vidit dissentiet eos cu, eum an brute copiosae hendrerit. Eos erant dolorum an. Per facer affert ut. Mei iisque mentitum moderatius cu. Sit munere facilis accusam eu, dicat falli consulatu at vis.</br>Te facilisis mnesarchum qui, posse omnium mediocritatem est cu. Modus argumentum ne qui, tation efficiendi in eos. Ei mea falli legere efficiantur, et tollit aliquip debitis mei. No deserunt mediocritatem mel. Lorem ipsum dolor sit amet, et delectus accommodare his, consul copiosae legendos at vix, ad putent delectus delicata usu. Vidit dissentiet eos cu, eum an brute copiosae hendrerit. Eos erant dolorum an. Per facer affert ut. Mei iisque mentitum moderatius cu. Sit munere facilis accusam eu, dicat falli consulatu at vis.</br>Te facilisis mnesarchum qui, posse omnium mediocritatem est cu. Modus argumentum ne qui, tation efficiendi in eos. Ei mea falli legere efficiantur, et tollit aliquip debitis mei. No deserunt mediocritatem mel. Lorem ipsum dolor sit amet, et delectus accommodare his, consul copiosae legendos at vix, ad putent delectus delicata usu. Vidit dissentiet eos cu, eum an brute copiosae hendrerit. Eos erant dolorum an. Per facer affert ut. Mei iisque mentitum moderatius cu. Sit munere facilis accusam eu, dicat falli consulatu at vis.</br>Te facilisis mnesarchum qui, posse omnium mediocritatem est cu. Modus argumentum ne qui, tation efficiendi in eos. Ei mea falli legere efficiantur, et tollit aliquip debitis mei. No deserunt mediocritatem mel.</span></span>";

var list="<span class=listcont><ul><li><span>Lorem ipsum dolorsit amet, consectetuer adipiscing elit.</span></li><li><span>Aliquam tincidunt mauris eu risus.</span></li><li><span>Vestibulum auctor dapibus neque.</span></li><li><span>Lorem ipsum dolor sit amet, consectetuer adipiscing.</span></li><li><span>Aliquam tincidunt mauris eu risus.</span></li><li><span>Vestibulum auctor dapibus neque.</span></li><li><span>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</span></li><li><span>Aliquam tincidunt mauris eu risus.</span></li><li><span>Vestibulum auctor neque.</span></li></ul></span>";
var headtxt="<span class='headtext'><span>Lorem</span> <span>ipsum</span> <span>dolor</span> <span>sitammet</span> <span>quam</span> <span>Lorem</span> <span>ipsumdolor</span> <span>sitammet</span> <span>quam</span></span>";

var img="<span id='imgwire' style='display:none;'><?xml version='1.0' encoding='utf-8'?><!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1 Tiny//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11-tiny.dtd'><svg version='1.1' baseProfile='tiny' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'width='200px' height='100px' viewBox='0 0 200 100' preserveAspectRatio='none'><line vector-effect='non-scaling-stroke' fill='none' stroke='#444444' stroke-width='2' x1='0' y1='100' x2='200' y2='0'/><line vector-effect='non-scaling-stroke' fill='none' stroke='#444444' stroke-width='2' x1='0' y1='0' x2='200' y2='100'/></svg></span>";

function getRandomNumber(range)
{
	return Math.floor(Math.random() * range);
}

function getRandomChar()
{
	var chars = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
	return chars.substr( getRandomNumber(62), 1 );
}

function randomID(size)
{
	var str = "";
	for(var i = 0; i < size; i++)
	{
		str += getRandomChar();
	}
	return str;
}


$('#watch-demo').click(function  () {
	if (!$('.panel').is(':visible')) {
		demo0();
	}
});

function demo0 () {
	$('#canvas').append("<div id='demo'><div class='demoinfo'>Click & drag to draw</div><div id='demobox' ></div><div id='democursor'><i class='icon2-cursor'></i></div><div id='demopanel'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><div id='demoeditpanel'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>");
	$("#demobox").css({'width':"0","height":"0"}).removeAttr('class');
	$('.demoinfo').text('Click & drag to draw');
	$('#demo').fadeIn('slow', demo1);
}

function demo1 () {
	$("#democursor").animate({
		top: "40px",
		left: '20px'
	}, 1500, demo1a);
}

function demo1a () {
	$("#democursor").addClass('drag');
	demo2();
}

function demo2 () {
	$("#demobox").delay(500).animate({
		width: "240px",
		height: '160px'
	}, 3500 );
	$("#democursor").delay(500).animate({
		top: "200px",
		left: '260px'
	}, 3500 ,demo3);

}
function demo3 () {
	$("#democursor").removeClass('drag');
	$('#demopanel').delay(500).show(0,demo4);
}
function demo4 () {
	$('.demoinfo').text('Select stencil');
	$("#democursor").delay(800).animate({
		top: "125px",
		left: '55px'
	}, 1500 ,demo5);
}

function demo4a () {

	demo5();
}

function demo5 () {
	$('#demobox').addClass('demobox');
	$("#democursor").delay(800).animate({
		top: "125px",
		left: '80px'
	}, 500 ,demo5a);
}
function demo5a () {
	$('#demobox').addClass('round');
	$("#democursor").delay(800).animate({
		top: "125px",
		left: '105px'
	}, 500 ,demo5b);

}
function demo5b () {
	$('#demobox').addClass('demoround');
	$("#democursor").delay(800).animate({
		top: "125px",
		left: '105px'
	}, 500 ,demo5c);
}
function demo5c () {
	$("#democursor").addClass('drag');
	demo5d();
}

function demo5d () {
	$('#demopanel').delay(300).hide(0, demo5e);
}
function demo5e () {
	$("#democursor").removeClass('drag');
	demo6();
}
function demo6 () {
	$('#demopanel').delay(1500).hide(0, demo6a);
}
function demo6a () {
	$('.demoinfo').text('Doubleclick to edit');
	$("#democursor").addClass('drag');
	$('#demopanel').delay(200).hide(0, demo6b);
}
function demo6b () {
	$("#democursor").removeClass('drag');
	demo6c();
}
function demo6c () {
	$('#demopanel').delay(200).hide(0, demo6d);
}
function demo6d () {
	$("#democursor").addClass('drag');
	$('#demopanel').delay(200).hide(0, demo6e);
}
function demo6e () {
	$("#democursor").removeClass('drag');
	$('#demoeditpanel').delay(400).show(0,demo7);

}
function demo7 () {
	$("#democursor").delay(800).animate({top: "125px",
		left: '178px'
	}, 500 ,demo7a);
}
function demo7a () {
	$('#demopanel').delay(500).hide(0, demo7b);
}
function demo7b () {
	$("#democursor").addClass('drag');
	$('#demobox').addClass('grey');
	demo7c();
}
function demo7c () {
	$('#demoeditpanel').delay(300).hide(0,demo7d);
}
function demo7d () {
	$("#democursor").removeClass('drag');
	demo8();
}
function demo8 () {
	$('#demo').delay(1600).hide('slow');
}


    $('.annotbox div').click(divClicked);
var anyannot =$('.aa').length;
							if (anyannot > 0){
								$('#hide-annotation').show();
							}