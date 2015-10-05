$(function(){
	$('.form_date').datetimepicker({
        language:  'fr',
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0
    });
	$('.del').click(function(e){
		var target = $(e.target)
		var id = target.data('id')
		var tr = $('.item-id-' + id)

		$.ajax({
			type: 'DELETE',
			url: '/list?id=' + id
		})
		.done(function(results){
			if(results.success === 1){
				if(tr.length > 0){
					tr.remove();
				}
			}
		})
	})
});