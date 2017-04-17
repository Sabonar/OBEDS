
function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
}


function CopyToClipboard(start) {
	window.getSelection().removeAllRanges(); 	
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
function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }
  var old_cookie = getCookie('obeds');
 	old_cookie = old_cookie==undefined?'':JSON.parse(old_cookie);
 	console.log(old_cookie);
  var cookie_data = [];
  if(old_cookie!="" && old_cookie!=undefined)
  {
  	old_cookie.push(value);
  	cookie_data = old_cookie;
  }
  else
  {
  	cookie_data.push(value);
  }
  	
  

  value = JSON.stringify(cookie_data);
  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
}

// возвращает cookie с именем name, если есть, если нет, то undefined
function getCookie(name) {
	var matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

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
var order;
var total;

function calcPrice(order){
	var total = 0;
	$(order).find('.dishprice').map(function(){total +=parseInt(this.textContent); return parseInt(this.textContent);});
	if (total == 0)	$('.delete_all').click();
	return total;
}


function addInOrder(cat,id)
{
	// console.log(cat + " " + id);
	// console.log(menu[cat]);
	el = menu[cat].filter(function(item){
		// console.log(item.id + " = " + id);
		return item.id == id;
	})[0];
	// console.log(el);
	order.append('<div class="order_element" data-cat="'+cat+'" data-id="'+el.id+'"><div class="col s8 dishname">(ID = '+el.id+') '+el.dishName+': </div><div class="col s2 dishprice">'+el.price+'</div><div class ="col s1 refresh"></div><div class ="col s1 close"></div></div>');
	total.html('<div class=" col s8 ">Итого: </div><div class=" col s4 ">'+calcPrice(order)+'</div>');

}

function bindButtons()
{

	$('.close').unbind('click').on('click',function(){
		$(this).parent().remove();
		total.html('<div class=" col s8 ">Итого: </div><div class=" col s4 ">'+calcPrice(order)+'</div>');

	});

	$('.refresh').on('click',function(){
		cat = $(this).parent().data().cat;
		el = menu[cat][Math.floor((Math.random() * menu[cat].length))];
		$(this).parent().find('.dishprice').html(el.price);
		$(this).parent().find('.dishname').html('(ID = '+el.id+') ' + el.dishName + ':');
		total.html('<div class=" col s8 ">Итого: </div><div class=" col s4 ">'+calcPrice(order)+'</div>');
	});
}
function makeCard(date,data)
{
	var date_temp = new Date(date);
	var datestring = formatDate(date_temp);


	var card = '<div style ="margin:10px;" class="card col s5"> <div class="card-content "> <span class="card-title">'+datestring+'</span> '+data.map(function(item){ 
				cat = item.cat;
				id = item.id;
				// console.log(menu[cat]);
				el = menu[cat].filter(function(item){
					return item.id == id;
				})[0];
				// console.log(el);
				

		return '<p data-cat="'+item.cat+'" data-id="'+item.id+'">'+el.dishName+'  :  '+el.price+'</p>'}).join("")+'</div><div class="card-action"><a class="copy_history" href="javascript:void(0)">Скопировать</a></div></div>'; 
	return card;
}
function makeHistory(cc)
{
	output = '';
	cookie = getCookie('obeds');
 	if(cookie==undefined)
 		return output;
 	else
 	{
 		cookie_bundle = JSON.parse(cookie);

 		cookie_bundle.forEach(function(item,i){
 			output+=makeCard(item.date,item.data);
 		});
 		
 	}
 	return output;

}

$(document).ready(function(){






	$('#history_link').on('click',function(){
		$('#menu').css('display','none');	
		$('#history').fadeIn('slow');
		
	});
	$('#menu_link').on('click',function(){
		$('#history').css('display','none');
		$('#menu').fadeIn('slow');	
	});


	







	order = $('#order .row #list');
	total = $('#order .row #summary');


 	$('.podnos').on('click',function(){
		CopyToClipboard('highlight');
		Materialize.toast('Скопировано в буфер обмена :-)', 1500);
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
			addInOrder(item,menu[item][Math.floor((Math.random() * menu[item].length))].id);
		});
		bindButtons();		
	});


	$('.previous').on('click',function(){
		
		previous_obed = getCookie('obeds');
		//console.log(previous_obed);
		if (previous_obed == undefined || previous_obed.length == 0)
		{
			Materialize.toast('Пока нет информации о предыдущем обеде', 1500);
		}
		else
		{
			previous_obed = JSON.parse(previous_obed);

			$('.delete_all').click();
			previous_obed = previous_obed[0].data;
			previous_obed.forEach(function(item){
				addInOrder(item.cat,item.id);
			});
			bindButtons();	

		}


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
		//console.log(item['gsx$наличие']['$t']);
		stock 	= item['gsx$наличие']['$t'].trim()=='в наличии'?1:0;	
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
				count: count,
				stock: stock

			}); 
		}



	});



	for (var cat in menu)
	{	
		menu[cat].sort(function(a, b) {
	    	return a.price - b.price;
		})
		menu[cat].forEach(function(item,i,arr){
			// console.log(item.stock);
			color = item.price>150?"red darken-1":(item.price>100?"orange darken-1":"");
			$('#'+cat+' .collection').append('<a  href="javascript:void(0)" data-position="right"  data-tooltip="'+item.comment+'"  data-cat = "'+cat+'" data-id ="'+item.id+'" data-price="'+item.price+'"  class="collection-item '+(item.stock?'':'disabled_item')+''+(item.comment!=""?'tooltipped':'')+'"><span class ="layer_count" style = "background-color:rgba(255,222,173,'+item.count/100+');" ></span><span class="new badge '+(item.stock?color:'disabled_item')+' ">'+item.price+'</span>'+item.dishName+'</a>');
		})
	}
	$('#history').html(makeHistory('obeds'));
	$('.tooltipped').tooltip({delay: 0});
	$('.copy_history').on('click',function(){
		$('.delete_all').click();
		// console.log($(this).parent().parent().find('.card-content p'));
		$($(this).parent().parent().find('.card-content p')).each(function(item,i){

			addInOrder($(i).data().cat,$(i).data().id);
		});
			
		bindButtons();		
	});
	var order = $('#order .row #list');
	var total = $('#order .row #summary');

	var summary = $('#order .row #summary');
	$('.collection-item').on('click',function(event){
		if ($(this).hasClass('disabled_item'))
		{
			Materialize.toast('Эта позиция временно недоступна ):', 1500);
		}
		else
		{
			$('#order').fadeIn('slow');
			var test = $(this);
			addInOrder(test.data().cat,test.data().id);
			bindButtons();
		}
		
	});	
});



function postToGoogle() {
	var date = new Date;
	var options = [];
	var date_data = {};
	date_data.date = date;
	date_data.data = [];
	$('.order_element').each(function(){
		
		date_data.data.push($(this).data());

		
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
	});
	date.setDate(date.getDate() + 7);
	options.expires =  date.toUTCString()
	options.path='/';
	setCookie('obeds',date_data,options);

}
             