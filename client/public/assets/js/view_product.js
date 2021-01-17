$('document').ready(function() {
    $('.tb_size_box_content').hide();
    $('.tb_color_box_content').hide();

    $('.color_btn').click(function() {
      if($(this).find('.arrow').attr('class').indexOf('down') > 0) {
        $(this).find('.arrow').removeClass('ft-arrow-down');
        $(this).find('.arrow').addClass('ft-arrow-right');
      } else {
        $(this).find('.arrow').removeClass('ft-arrow-right');
        $(this).find('.arrow').addClass('ft-arrow-down');
      }
      $(this).siblings('.tb_color_box_content').toggle();
    })
    $('.size_btn').click(function() {
      if($(this).find('.arrow').attr('class').indexOf('down') > 0) {
        $(this).find('.arrow').removeClass('ft-arrow-down');
        $(this).find('.arrow').addClass('ft-arrow-right');
      } else {
        $(this).find('.arrow').removeClass('ft-arrow-right');
        $(this).find('.arrow').addClass('ft-arrow-down');
      }
      $(this).siblings('.tb_size_box_content').toggle();
    })
  })
