function CopyToClipboard(start) {
if (document.selection) { 
    var range = document.body.createTextRange();
    range.moveToElementText(document.getElementById(start));
    range.select().createTextRange();
    document.execCommand("Copy"); 
    //range.select();

} else if (window.getSelection) {
    var range = document.createRange();
     range.selectNode(document.getElementById(start));
     window.getSelection().addRange(range);
     document.execCommand("Copy");
     //range.select();
     //alert("text copied");
}}



var ii = 0;

function delete_el(order,i){
	order.find('#el'+i).remove();
}
function calcPrice(order){
	var total = 0;
	$(order).find('.s4').map(function(){total +=parseInt(this.textContent); return parseInt(this.textContent);});
	return total;
}

 $(document).ready(function(){
 	$('.podnos').on('click',function(){
		CopyToClipboard('highlight');
		Materialize.toast('Скопировано в буфер обмена :-)', 1500)

	})


});
    
$.getJSON("https://spreadsheets.google.com/feeds/list/1-grygMa0PORQQC89bZbatam9bfcSIBuXsuhJjVR6lGs/od6/public/values?alt=json", function(data) {
	//first row "title" column
rows = data.feed.entry;
var menu = {
	heats			:[],
	salads 			:[],
	snacks 			:[],
	breakfest		:[],
	soups 			:[],			
	garnish 		:[],
	deserts 		:[],
	sandwiches		:[],
	rolls			:[]
}
var cur = "";

rows.forEach(function(item,i,arr){
	elem 	= item['gsx$меню']['$t'];
	pr 		= item['gsx$цена']['$t'];
	com 	= item['gsx$коммент']['$t'];
	switch(elem.toLowerCase())
	{
		case 'салаты:':
			cur = 'salads';
			break;
		case 'закуски:':
			cur = 'snacks';
			break;
		case 'завтраки:':
			cur = 'breakfest';
			break;
		case 'первые блюда:':
			cur = 'soups';
			break;
		case 'вторые блюда:':
			cur = 'heats';
			break;
		case 'гарнир:':
			cur = 'garnish';
			break;
		case 'десерты:':
			cur = 'deserts';	
			break;
		case 'сендвичи:':
			cur = 'sandwiches';
			break;
		case 'роллы:':
			cur = 'rolls';
			break;
		default:
			break;
	}

	if (cur!="" && elem!="" && pr!="")
	{
		menu[cur].push({ 
			dishName:elem,
			price:pr,
			comment: com
		}); 
	}



});



for (var cat in menu)
{	
	menu[cat].sort(function(a, b) {
    	return a.price - b.price;
	})
	menu[cat].forEach(function(item,i,arr){
		color = item.price>150?"red darken-1":(item.price>100?"orange darken-1":"");
		$('#'+cat+' .collection').append('<a href="javascript:void(0)" data-position="right"  data-tooltip="'+item.comment+'"  data-cat = "'+cat+'" data-id ="'+i+'" data-price="'+item.price+'"  class="collection-item '+(item.comment!=""?'tooltipped':'')+'"><span class="new badge '+color+' ">'+item.price+'</span>'+item.dishName+'</a>');
	})
}
$('.tooltipped').tooltip({delay: 50});

var order = $('#order .row #list');
var total = $('#order .row #summary');

var summary = $('#order .row #summary');
$('.collection-item').on('click',function(event){
	$('#order').fadeIn('slow');
	var test = $(event.target);

	order.append('<div class="order_element" id="el'+(ii++)+'"><div class=" col s8 ">'+test.clone().children().remove().end().text()+': </div><div class=" col s4 ">'+test.data().price+'</div></div>');
	total.html('<div class=" col s8 ">Итого: </div><div class=" col s4 ">'+calcPrice(order)+'</div>');

	})	
});



