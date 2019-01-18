years = [
  [2003, 12],
  [2005, 06],
  [2012, 06],
  [2006, 01],
  [2004, 06],
  [2018, 09],
  [2017, 03],
  [2012, 10],
  [2014, 01],
  [2015, 06],
  [2013, 05],
  [2009, 10],
  [2010, 08],
  [2007, 11],
  [2008, 01],
  [2016, 11]
]

// Whether the two pictures represented by the indices are in the right chronological order
function is_right_order(i1, i2) {
  y1 = years[i1];
  y2 = years[i2];
  return y1[0]<y2[0] || (y1[0]===y2[0] && y1[1]<y2[1])
}

function reset_hints() {
  $( "#feedback span" ).text('');
  $( "#answer span" ).text('')
}

function show_answer() {
  $( "#sortable img" ).each(function( index, element ) {
    let pic_i = element.getAttribute('index');
    $( "#answer span" ).eq(index).text(years[pic_i][1]+' / '+years[pic_i][0]);
  });
}

function get_order() {
  order = ''
  $( "#sortable img" ).each(function( index, element ) {
    order += element.getAttribute('index')+'|'
  });
  return order
}

function log_action(action, data) {
  $.post("/logevent", { "order": get_order(),
                        "action": action,
                        "data": data})
}

$( function() {
  
  
  // sortable elements:
  let w = ($( "#sortable" ).width())/16
  
  // $( "#sortable" ).height(270)
  
  for(let i=0; i<16; i++) {
    $( "#sortable" ).append('<img src="yanas/'+i+'.jpg" index='+i+' width="'+w+'"/>')
  }
  // $( "#sortable.img" ).css('vertical-align', 'bottom')
  
  $( "#sortable" ).sortable({
    start: function(e, ui){
      reset_hints()
      ui.placeholder.height(ui.item.height());
      // ui.item.width(270);
      // ui.item.height(270);
      // console.log(ui.item.attr('src'))
    },
    stop: function(e, ui){
      log_action('sort', ui.item.attr('index')) 
    }
  });
  $( "#sortable" ).disableSelection();
  
  
  // Set up feedback & answer sections:
  for(let i=0; i<15; i++) {
    $( "#feedback" ).append('<span align=right style="display: inline-block;color: red;font-weight: bold; width: '+w+'px "></span>')
  }
  for(let i=0; i<16; i++) {
    $( "#answer" ).append('<span style="display: inline-block; width: '+w+'px "></span>')
  }
  
  
  // Check (and give feedback):
  $( "#check" ).click(function() {
    log_action('check', ''); 
    reset_hints();
    num_wrong = 0
    $( "#sortable img" ).each(function( index, element ) {
      let next = element.nextSibling
      if(next) {
        let this_i = element.getAttribute('index');
        let next_i = next.getAttribute('index');
        if (!is_right_order(this_i, next_i)) {
          $( "#feedback span" ).eq(index).text('>');
          num_wrong += 1;
        }
      }
    });
    if(num_wrong === 0) {
      show_answer();
    }
  });
  
  
  $( "#answer_btn" ).click(function() {
    log_action('giveup', '');
    show_answer();
  });
  
} );
