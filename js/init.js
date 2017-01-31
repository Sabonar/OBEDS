(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('.parallax').parallax();

  }); // end of document ready
})(jQuery); // end of jQuery name space


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
			price:pr 
		}); 
	}



});



for (var cat in menu)
{	
	menu[cat].forEach(function(item,i,arr){
		$('#'+cat+' .collection').append('<a href="javascript:void(0)"  data-cat = "'+cat+'" data-id ="'+i+'" data-price="'+item.price+'" class="collection-item"><span class="new badge">'+item.price+'</span>'+item.dishName+'</a>');
	})
}

var order = $('#order .row #list');
var total = $('#order .row #summary');

var summary = $('#order .row #summary');
$('.collection-item').on('click',function(event){
	$('#order').fadeIn('slow');
	var test = $(event.target);
	order.append('<div class="order_element" id="el'+(ii++)+'"><div class=" col s8 ">'+test.clone().children().remove().end().text()+'</div><div class=" col s4 ">'+test.data().price+'</div></div>');
	total.html('<div class=" col s8 ">Итого: </div><div class=" col s4 ">'+calcPrice(order)+'</div>');

	})	
});


