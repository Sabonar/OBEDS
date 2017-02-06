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
	};

function calcPrice(order){
	var total = 0;
	$(order).find('.dishprice').map(function(){total +=parseInt(this.textContent); return parseInt(this.textContent);});
	if (total == 0)	$('.delete_all').click();
	return total;
}

 $(document).ready(function(){
 	$('.podnos').on('click',function(){
		CopyToClipboard('highlight');
		Materialize.toast('Скопировано в буфер обмена :-)', 1500)
		$('#form').submit();
	});
	$('.delete_all').on('click',function(){
		$('#list').html('');
		$('#summary').html('');
		//$('#order').fadeOut('slow');
	});
	$('.random_all').on('click',function(){

		$('.delete_all').click();
		var cats = ['salads','soups','heats','garnish'];
		cats.forEach(function(item){
			el = menu[item][Math.floor((Math.random() * menu[item].length))];
			el = menu[item][Math.floor((Math.random() * menu[item].length))];
			var order = $('#order .row #list');
			var total = $('#order .row #summary');
			order.append('<div class="order_element" data-cat="'+item+'" data-id="'+el.id+'"><div class="col s8 dishname">(ID = '+el.id+') '+el.dishName+': </div><div class="col s2 dishprice">'+el.price+'</div><div class ="col s1 refresh"></div><div class ="col s1 close"></div></div>');
			total.html('<div class=" col s8 ">Итого: </div><div class=" col s4 ">'+calcPrice(order)+'</div>');
			$('.close').unbind('click').on('click',function(){
				$(this).parent().remove();
				total.html('<div class=" col s8 ">Итого: </div><div class=" col s4 ">'+calcPrice(order)+'</div>');

			});

			$('.refresh').on('click',function(){
				cat = $(this).parent().data().cat;
				el = menu[cat][Math.floor((Math.random() * menu[cat].length))];
				$(this).parent().find('.dishprice').html(el.price);
				$(this).parent().find('.dishname').html('(ID = '+el.id+')' + el.dishName);
				total.html('<div class=" col s8 ">Итого: </div><div class=" col s4 ">'+calcPrice(order)+'</div>');
			});


		});
		
		
	});


	$('#form').submit(function() {
        postToGoogle();
        return false;
    });


});
    
$.getJSON("https://spreadsheets.google.com/feeds/list/1-grygMa0PORQQC89bZbatam9bfcSIBuXsuhJjVR6lGs/od6/public/values?alt=json", function(data) {
	//first row "title" column
	rows = data.feed.entry;
	
	var cur = "";

	rows.forEach(function(item,i,arr){
		elem 	= item['gsx$меню']['$t'];
		pr 		= item['gsx$цена']['$t'];
		com 	= item['gsx$коммент']['$t'];
		id 		= item['gsx$id']['$t'];
		count	= item['gsx$кол']['$t'];	
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
				id: id,
				dishName:elem.charAt(0).toUpperCase() + elem.substr(1),
				price:pr,
				comment: com,
				count: count
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
			$('#'+cat+' .collection').append('<a href="javascript:void(0)" data-position="right"  data-tooltip="'+item.comment+'"  data-cat = "'+cat+'" data-id ="'+item.id+'" data-price="'+item.price+'"  class="collection-item '+(item.comment!=""?'tooltipped':'')+'"><span class ="layer_count" style = "background-color:rgba(255,222,173,'+item.count/100+');" ></span><span class="new badge '+color+' ">'+item.price+'</span>'+item.dishName+'</a>');
		})
	}

	$('.tooltipped').tooltip({delay: 0});

	var order = $('#order .row #list');
	var total = $('#order .row #summary');

	var summary = $('#order .row #summary');
	$('.collection-item').on('click',function(event){
		$('#order').fadeIn('slow');
		var test = $(this);
		order.append('<div class="order_element"  data-cat="'+test.data().cat+'" data-id  = "'+test.data().id+'"><div class="col s8 dishname">(ID = '+test.data().id+') '+test.clone().children().remove().end().text()+': </div><div class="col s2 dishprice">'+test.data().price+'</div><div class ="col s1 refresh"></div><div class ="col s1 close"></div></div>');
		total.html('<div class=" col s8 ">Итого: </div><div class=" col s4 ">'+calcPrice(order)+'</div>');
		$('.close').unbind('click').on('click',function(){
			//console.log($(this).parent());
			$(this).parent().remove();
			total.html('<div class=" col s8 ">Итого: </div><div class=" col s4 ">'+calcPrice(order)+'</div>');

		});

		$('.refresh').on('click',function(){
			cat = $(this).parent().data().cat;
			el = menu[cat][Math.floor((Math.random() * menu[cat].length))];
			$(this).parent().find('.dishprice').html(el.price);
			$(this).parent().find('.dishname').html('(ID = '+el.id+') ' + el.dishName);
			total.html('<div class=" col s8 ">Итого: </div><div class=" col s4 ">'+calcPrice(order)+'</div>');
		});
	});	
});



function postToGoogle() {
$('.order_element').each(function(){
	$.ajax({
    url: "https://docs.google.com/forms/d/1FD-sLN3GlU9zx4ES4thcAO0o9W0cD5rpaDFsc7yagdw/formResponse",
    data: {"entry.743518435": $(this).data().id, "entry.1865878543": 'test'},
    type: "POST",
    dataType: "xml",
    statusCode: {
        0: function() {
            //Success message
        },
        200: function() {
            //Success Message
        }
    }
	});
})

}
             